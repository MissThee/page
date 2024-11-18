import React, {useState, useEffect, useRef} from 'react'
import BaseModal from '@/components/BaseModal'
import {Upload, message, Button, Progress, Select} from 'antd'
import {UploadOutlined, FileOutlined, CheckCircleOutlined} from '@ant-design/icons'
import BaseIcon from '@/components/BaseIcon'
import OSS from 'ali-oss'
import {isTest} from '@/utils/utils'
import SparkMD5 from 'spark-md5'
import {getOssInit, upload, verifRecord, getLanguageList} from '../service'
import styles from './index.less'

// 文件hash
const getFileHash = (targetFile: File) => new Promise<string>((resolve, reject) => {
  const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  const file = targetFile
  const chunkSize = 2097152                             // Read in chunks of 2MB
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result);                   // Append array buffer
    currentChunk += 1;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      const res = spark.end()
      // console.log('filehash', res)
      resolve(res)
    }
  };

  fileReader.onerror = (ev: any) => {
    console.error('读物文件出现错误', ev);
    reject(ev)
  };

  function loadNext() {
    const start = currentChunk * chunkSize
    const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
})

const {Option} = Select

interface UploadProps {
  visibleUpload: boolean
  setVisible: () => void
  onCancel: () => void
  updateList: () => void
}

export const UploadRecord: React.FC<UploadProps> = (props) => {
  const ossData = useRef<object>({
    region: '',
    accessKeyId: '',
    accessKeySecret: '',
    secure: true,
    timeout: 3600000,
    bucket: ''
  })
  // const uploadCount = useRef(0)
  const [fileList, setFileList] = useState<any[]>([])
  const [uploading, setUploading] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [languageValue, setLanguageValue] = useState(1)
  const [languageList, setLanguageList] = useState<string[]>([])

  const [expireData, setExpireData] = useState('')
  const [db, setDb] = useState<any>(null)

  const {visibleUpload, onCancel, updateList, setVisible} = props

  useEffect(() => {
    const getOssConfig = async () => {
      const {
        accessKeyId = '',
        accessKeySecret = '',
        securityToken = '',
        expiration = ''
      } = await getOssInit()
      ossData.current = {
        accessKeyId,
        accessKeySecret,
        stsToken: securityToken,
        secure: true,
        region: 'oss-cn-zhangjiakou',
        bucket: isTest ? 'testnice' : 'nice2021',
        timeout: 3600000
      }
      setExpireData(expiration)
    }
    getOssConfig()
    const getIndexDB = () => {
      const indexedDB = window.indexedDB.open('cloundUploadPartDemo')
      indexedDB.onsuccess = () => {
        setDb(indexedDB.result)
      }
      indexedDB.onupgradeneeded = (event: any) => {
        const {target} = event
        const dbInit = target.result
        if (!dbInit.objectStoreNames.contains('cloundfilesdemo')) {
          const objectStore = dbInit.createObjectStore('cloundfilesdemo', {keyPath: 'name'})
          objectStore.createIndex('name', 'name', {unique: false})
          objectStore.createIndex('files', 'files', {unique: true})
        }
        setDb(dbInit)
      }
    }
    getIndexDB()

    const getLanguageListData = async () => {
      const {language_type = []} = await getLanguageList()
      setLanguageList(language_type)
    }
    getLanguageListData()
  }, [])

  useEffect(() => {
    const loadingIndex = fileList.findIndex((item) => item.uploadStatus === 'loading')
    if (loadingIndex > -1) {
      setUploading(true)
    } else {
      setUploading(false)
    }
  }, [fileList])

  const getConfig = async () => {
    const {
      accessKeyId = '',
      accessKeySecret = '',
      securityToken = '',
      expiration = ''
    } = await getOssInit()
    ossData.current = {
      accessKeyId,
      accessKeySecret,
      stsToken: securityToken,
      secure: true,
      region: 'oss-cn-zhangjiakou',
      bucket: isTest ? 'testnice' : 'nice2021',
      timeout: 3600000
    }
    setExpireData(expiration)
  }

  const add = (cpt: any, name: string) => {
    const transaction = db.transaction(['cloundfilesdemo'], 'readwrite')
    const objectStore = transaction.objectStore('cloundfilesdemo')
    const content = JSON.stringify(cpt)
    objectStore.put({name, files: content})
  }

  const read = async (name: string, file: File) => {
    return new Promise((resolve) => {
      const transaction = db.transaction(['cloundfilesdemo'])
      const objectStore = transaction.objectStore('cloundfilesdemo')
      const request = objectStore.get(name)
      request.onsuccess = () => {
        if (request.result) {
          const data = JSON.parse(request.result.files)
          data.file = file
          resolve(data)
        } else {
          resolve(null)
        }
      }
    })
  }

  const removeDb = (name: string) => {
    db.transaction(['cloundfilesdemo'], 'readwrite').objectStore('cloundfilesdemo').delete(name)
  }

  const beforeUpload = async (file: any) => {
    return new Promise((resolve, reject) => {
      const {name} = file
      verifRecord({
        file_name: name
      }).then(async (res) => {
        const {path: dir, info = '', new_file_name = ''} = res
        if (!dir) {
          return reject()
        }

        const fileData = {
          file,
          lastModified: file.lastModified,
          percent: 0,
          userId: info,
          fileName: file.name,
          new_file_name,
          show: true,
          size: file.size,
          status: '',
          uploadStatus: 'pending',
          dir: `${dir}/${new_file_name}`,
          client: '',
          hashPromise: getFileHash(file)
        }
        setFileList((prevList) => [...prevList, fileData])
        const expireTime = new Date(expireData).getTime()
        if (expireTime < Date.now()) {
          await getConfig()
        }
        return reject()
      })
    })
  }

  const successCancel = () => {
    setUploading(false)
    onCancel()
    setFileList(() => [])
    setVisible()
  }


  const initOss = async ({fileData, index}: any) => {
    const fileHash = await fileData.hashPromise
    const {file: uploadFile, dir = '', userId = '', lastModified = 0} = fileData
    const {name: filename} = uploadFile
    const md = filename.split('.')[1]
    setSubmitLoading(false)
    try {
      const client = new OSS(ossData.current)
      setFileList((list) => {
        const prevList = list.slice()
        prevList[index].percent = 0
        prevList[index].client = client
        return prevList
      })
      const checkpoint = await read(fileHash, uploadFile) // 断点续传指针
      const results = await client.multipartUpload(`${dir}.${md}`, uploadFile, {
        checkpoint,
        async progress(p, cpt) {
          setFileList((list) => {
            const prevList = list.slice()
            prevList[index].percent = parseInt(`${p * 100}`, 10)
            prevList[index].uploadStatus = 'loading'
            prevList[index].status = ''
            return prevList
          })
          if (!cpt) return false
          add(cpt, fileHash)
          return true
        },
        meta: null,
        parallel: 3,
        partSize: 1000 * 1024 * 1 // 设置分片大小
      })

      const {res} = results
      if (res.status === 200) {
        // 上传成功
        removeDb(fileHash)
        const {requestUrls} = results.res
        const path = requestUrls[0].split('?')[0]
        // 通知后台写入数据
        const writeParams = {
          file_name: filename,
          path,
          file_time: '',
          lastModified,
          file_size: uploadFile.size,
          user_id: userId,
          language_type: languageValue
        }
        const {errcode = 0} = await upload(writeParams)
        setFileList((list) => {
          const prevList = list.slice(0)
          if (prevList[index]) {
            prevList[index].uploadStatus = 'done'
          }
          return prevList
        })
        if (errcode !== 0) return
        message.success(`${filename}文件上传成功`)
        updateList()

        if (fileList.length === 1) {
          successCancel()
        }
      }
    } catch (error) {
      console.error('上传未完成', error)
      const {status} = error
      if (status === 0) return
      if (status === 403) {
        await getConfig()
        initOss({fileData, index})
      } else {
        setFileList((list) => {
          const prevList = list.slice()
          prevList[index].status = 'exception'
          prevList[index].percent = 100
          // prevList.length > 0 && (prevList[index].uploadStatus = 'failed')
          return prevList
        })
      }
    }
  }

  const uploadProps = {
    name: 'file',
    fileList: [],
    action: '',
    accept: 'audio/*',
    multiple: true,
    beforeUpload
  }

  const handleCancel = () => {
    fileList.forEach((item) => {
      const {client} = item
      if (!client) return
      client.cancel()
    })
    setUploading(false)
    setLanguageValue(1)
    onCancel()
    setFileList(() => [])
  }

  const uploadFile = () => {
    if (submitLoading) return
    const uploadFileList = fileList.filter(
      (listItem) => listItem.show && listItem.uploadStatus === 'pending'
    )
    if (!uploadFileList.length) {
      message.warning('请先选择上传文件')
      return
    }
    const uploadAllList = fileList.filter((listItem) => listItem.show)
    if (uploadAllList.length > 20) {
      message.warning('当前限制上传20个文件')
      return
    }

    const sizeArr = uploadFileList.map((item) => item.size)
    const sizeTotal = sizeArr.reduce((prev, current) => {
      return prev + current
    }, 0)

    if (sizeTotal / (1024 * 1024 * 1024) > 2.5) {
      message.warning('上传文件总大小不能超过2.5G')
      return
    }
    setSubmitLoading(true)
    setUploading(true)
    fileList.forEach(async (item, index) => {
      const {show = true, uploadStatus = ''} = item
      if (show && uploadStatus !== 'done') {
        initOss({
          fileData: item,
          index
        })
      }
    })
  }

  const deleteHandler = (dItem: any, index: number) => {
    const {fileName = '', client = ''} = dItem
    removeDb(fileName)
    setFileList((list) => {
      const prevList = list.slice()
      prevList[index].show = false
      prevList[index].uploadStatus = 'pending'
      return prevList
    })
    if (!client) return
    client.cancel()
    const showList = fileList.filter((fItem) => fItem.show)
    if (showList.length) return
    setFileList([])
  }

  const handleIcon = (data: any, index: number) => {
    const {uploadStatus = ''} = data
    if (uploadStatus === 'done') {
      return (
        <span className={styles.upload_success}>
          <CheckCircleOutlined/>
        </span>
      )
    }
    return (
      <span className={styles.upload_close} onClick={() => deleteHandler(data, index)}>
        <BaseIcon type="close"/>
      </span>
    )
  }

  const handleChange = (value: number) => {
    setLanguageValue(value)
  }


  return (
    <BaseModal
      title="上传录音"
      closable={false}
      statusTitle={false}
      style={{textAlign: 'center'}}
      visible={visibleUpload}
      footer={null}
      width={462}
    >
      <div className={styles.upload_wrapper}>
        <span className={styles.upload_label}>方言选择：</span>
        <div className={styles.upload_details} style={{marginBottom: 10}}>
          <Select defaultValue={languageValue} style={{width: 110}} onChange={handleChange}>
            {languageList.map((langItem: any) => (
              <Option key={langItem.id} value={langItem.id}>
                {langItem.name}
              </Option>
            ))}
          </Select>
          <span className={styles.upload_tips}>同批上传的录音将使用相同的方言进行转写</span>
        </div>
      </div>
      <div className={styles.upload_wrapper}>
        <span className={styles.upload_label}>上传录音：</span>
        <div className={styles.upload_details}>
          <Upload {...uploadProps}>
            <Button>
              <UploadOutlined/>
              上传文件
            </Button>
          </Upload>
          <span className={styles.upload_tips}>仅支持.mp3、wav、wma等音频文件</span>
          <ul className={styles.upload_content}>
            {fileList.map((item: any, index: number) => {
              if (item.show) {
                return (
                  <li className={styles.upload_list} key={index}>
                    <FileOutlined/>
                    <div className={styles.upload_filename}>
                      <div className={styles.upload_names_wrapper}>
                        <div className={styles.upload_names}>{item.fileName}</div>
                        {handleIcon(item, index)}
                      </div>
                      <div style={{display: 'flex'}}>
                        <Progress
                          percent={item.percent}
                          strokeColor={item.status !== 'exception' ? '#27D38A' : '#ff4d4f'}
                          showInfo={false}
                          status={item.status}
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </li>
                )
              }
              return null
            })}
          </ul>
        </div>
      </div>
      <div className={`${styles.upload_btns} base_search`}>
        <Button className={styles.upload_btns_cancel} danger onClick={() => handleCancel()}>
          取消
        </Button>
        <Button type="primary" loading={uploading} onClick={() => uploadFile()}>
          提交
        </Button>
      </div>
    </BaseModal>
  )
}

export default UploadRecord
