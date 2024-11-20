<template>
  <el-button @click="download" type="primary" :loading="isLoading" :icon="props.icon ? Download: ''">{{ isLoading?'导出中...':title }}</el-button>
</template>

<script setup lang="ts">
import {Download} from '@element-plus/icons-vue'
import * as iconv from 'iconv-lite'
import axios from "@/axios";
import {ref} from "vue";
import {TARGET_URL} from '@/utils/utils'

const props = withDefaults(defineProps<{
  title: string,
  url: string,
  icon?: boolean,
  type?: 'get' | 'post'
  data?: Record<string, any>
}>(), {
  title: '下载',
  url: '',
  icon: false,
  type: 'post',
  data: null,
})
const isLoading = ref(false)
const download = () => {
  if (!props.data) {
    let dom = document.createElement('a')
    const target_url = TARGET_URL?.endsWith('/') ? TARGET_URL?.slice(0, -1) : TARGET_URL
    dom.href = target_url + props.url
    dom.target = '_blank'
    dom.click()
  } else {
    isLoading.value = true
    axios.post(props.url, props.data, {}, {
      responseType: 'blob'
    }).then(res => {
      transTextToDownloadFile(res)
    }).catch(e => {
      console.error(e)
    }).finally(() => {
      isLoading.value = false
    })
  }
}

// 文本转换为文件并下载
const transTextToDownloadFile = (res) => {
  const contentDisposition = iconv.decode(res.headers['content-disposition'] || '', 'utf8')
  let fileName
  if (contentDisposition.includes(`filename*=utf-8''`)) {
    fileName = decodeURI(contentDisposition.split(`filename*=utf-8''`)[1].split(';')[0] || '导出.xlsx')
  } else if (contentDisposition.includes(`filename*=`)) {
    fileName = decodeURI(contentDisposition.split(`filename*=`)[1].split(';')[0] || '导出.xlsx')
  } else {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
      fileName = matches[1].replace(/['"]/g, '');
    }
  }

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
</script>

<style lang="less" scoped>
// .el-button{
//   height: var(--el-component-size);
//   border-color: #D4D4D4 ;
//   background-color: #ffffff;
//   color: #666666;
//   &:hover{
//     color: var(--el-color-primary);
//     border-color: var(--el-color-primary);
//   }
// }
.download {
  background-color: #fff;
  color: var(--el-color-primary);
}
</style>
