import axios, {AxiosHeaders} from 'axios'
import {ElMessage, ElMessageBox} from "element-plus";
import homeRouter from 'home/router'
import adminRouter from 'admin/router'

const httpErrorMessage: Record<number, string> = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '权限不足，拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}
const unauthorizedCode = 401 // 未登录状态码
const unauthenticatedCode = 403 // 已登录但无权限

// 限制相同内容message的弹出辅助参数
const messageLimit: Record<string, number> = {}
const messageLimitTime = 3000 // 3秒内，由axios发出的相同内容报错，不会出现第二个

// 登录过期弹窗不重复弹出辅助参数
let isMessageAlertShow = false

// 取消请求的辅助参数
const requestingList: Record<string, any> = {}

const customAxios = axios.create({
  baseURL: process.env.BASE_URL || '',
  timeout: 60 * 1e3, // 超时时间60s
  headers: new AxiosHeaders(),
  withCredentials: true
})

type Options = {
  cancel?: string,
  noMessage?: boolean // true时，失败也不自动弹出message
}
type HandleWrapParam = {
  method: string,
  url: string,
  paramsOrData: any,
  options?: Options,
  axiosOptions: Record<string, any>,// 这个对象会直接传给axios，可配置原生参数
};

const handleWrap = async (handleWrapParam: HandleWrapParam) => {
  const requestOpt: Record<string, any> = {url: handleWrapParam.url, method: handleWrapParam.method, ...handleWrapParam.axiosOptions}
  // 取消重复请求，当两个请求都携带了 options.cancel 参数，且拼接的 cancelKey 值相同，则后者请求时，会将前者自动取消
  if (handleWrapParam.options?.cancel !== undefined && handleWrapParam.options?.cancel !== null) {
    // 查找上一个重复key，有对应请求则将其取消
    const cancelKey = `${handleWrapParam.method}_${handleWrapParam.url}_${handleWrapParam.options?.cancel}`
    if (requestingList[cancelKey]) {
      requestingList[cancelKey].abort()
      delete requestingList[cancelKey]
    }
    // 给本次请求配置key
    const controller = new AbortController()
    requestOpt.signal = controller.signal
    // 记录下key，以之后取消使用
    requestingList[cancelKey] = controller
  }
  // 设置参数，移除参数中的空值
  switch (handleWrapParam.method) {
    case 'get':
      if (handleWrapParam.paramsOrData !== undefined) {
        requestOpt.params = handleWrapParam.paramsOrData
      }
      break;
    case 'post':
      if (handleWrapParam.paramsOrData !== undefined) {
        requestOpt.data = handleWrapParam.paramsOrData
      }
      break;
    default:
      throw new Error('其他请求方法参数传递暂未配置，在此添加')
  }
  return customAxios(requestOpt)
    .then((res) => {
      // 如果返回的body是字符串，即不是一个对象如{ errcode: 0, data:xxx }，则直接返回请求结果对象
      if (Object.prototype.toString.call(res.data) === '[object String]') {
        return res
      }
      // 如果返回的类型是blob，则返回请求结果对象（如使用post请求下载文件时，会走此分支，大部分项目不会使用）
      if (res.config.responseType === 'blob') {
        return res
      }
      // 约定的返回结构 { errcode: ,data, message }。errcode不为0时弹出错误提示
      if (res.data.errcode !== 0) {
        if (!handleWrapParam.options?.noMessage) {
          messageLimited(res.data?.message || '请求出现未知错误错误')
        }
      }
      return res.data
    })
    .catch(error => {
      // 异常处理
      if (axios.isCancel(error)) {
        // 异常类型1：被取消的请求
        console.info('请求取消', requestOpt.url, error)
      } else if (error.response) {
        // 异常类型2： 请求成功发出且服务器也响应了，但状态代码超出了 2xx 的范围
        if (error.response.status === unauthorizedCode) {
          // 登录过期跳转登录页
          if (!isMessageAlertShow) {
            isMessageAlertShow = true
            ElMessageBox.alert('登录已过期', '提示').then(() => {
              const pathLogin = '/login'
              homeRouter?.replace?.(pathLogin)
              adminRouter?.replace?.(pathLogin)
            }).finally(() => {
              isMessageAlertShow = false
            })
          }
        } else if (error.response.status === unauthenticatedCode) {
          // 跳转无权限页
          const path403 = '/403'
          homeRouter?.replace?.(path403)
          adminRouter?.replace?.(path403)
        } else {
          if (!handleWrapParam.options?.noMessage) {
            messageLimited(httpErrorMessage[error.response.status] || '请求出现未知错误错误')
          }
          console.error('请求异常:非2xx响应', requestOpt.url, error.response.status, error.response.data)
        }
      } else if (error.request) {
        // 异常类型3：请求已经成功发起，但没有收到响应
        console.error('请求异常:未响应', requestOpt.url, error, error.request)
        messageLimited( '请求超时')
      } else {
        // 异常类型4：其他异常
        console.error('请求异常:其他', requestOpt.url, error)
      }
      throw error
    })
}

// 相同文字的消息在设置的时间内不重复弹出
const messageLimited = (msg: string) => {
  if (msg && (!messageLimit[msg] || messageLimit[msg] < Date.now())) {
    messageLimit[msg] = Date.now() + messageLimitTime
    ElMessage.error(msg)
  }
}


const get = (url: string, paramsOrData?: Record<string, any>, options: Options = {}, axiosOptions: Record<string, any> = {}) =>
  handleWrap({method: 'get', url, paramsOrData, options, axiosOptions})
const post = (url: string, paramsOrData?: Record<string, any>, options: Options = {}, axiosOptions: Record<string, any> = {}) =>
  handleWrap({method: 'post', url, paramsOrData, options, axiosOptions})
export default {get, post}
