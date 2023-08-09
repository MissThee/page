+ 配置axios（重要）  `{ responseType: 'blob' }`
+ 将返回内容转为文件，并为其命名
```
import * as iconv from 'iconv-lite'
/**
 * 文本转换为文件并下载
 * @param text 文件文本
 * @param filename 下载时的文件名
 * */
const transTextToDownloadFile = (res) => {
  const contentDisposition = iconv.decode(res.headers['content-disposition'] || '', 'utf8')
  const fileName = (contentDisposition.split('=')[1] || '').replace(/"/g, '')
  let fileReader = new FileReader()
  fileReader.readAsDataURL(res.data)
  fileReader.onload = e => {
    const a = document.createElement('a')
    a.download = fileName
    a.href = e.target.result as string
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
```
