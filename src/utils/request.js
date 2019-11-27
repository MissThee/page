import Global from 'src/utils/global';
import axios from 'axios';
import { Notification } from 'element-ui';
// 创建实例
const request = axios.create({
  // baseURL: `${Global.HOST}`,
  timeout: 60000,
});
let requestErrorNotiTime = 0;
let responseErrorNotiTime = 0;
const errorNotiMinTime = 2;//错误提示出现的最小间隔
let interval;
//开启一个循环定时器
(function increaseNotiTime() {
  if (!interval) {
    interval = setInterval(() => {
      if (requestErrorNotiTime > 0) {
        requestErrorNotiTime -= 1;
      } else {
        requestErrorNotiTime = 0;
      }
      if (responseErrorNotiTime > 0) {
        responseErrorNotiTime -= 1;
      } else {
        responseErrorNotiTime = 0;
      }
    }, 1000);
  }
})();

// request拦截器，请求发送前修改发送内容
request.interceptors.request.use((request) => {
    if (!request.headers.Authorization && Global.TOKEN && Global.TOKEN.length > 0) {
      request.headers.Authorization = 'token ' + Global.TOKEN;
    }
    return request;
  }, error => {
    if (requestErrorNotiTime === 0) {
      requestErrorNotiTime = errorNotiMinTime;
      Notification({
        customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
        title: '发送信息出现错误',
        message: error,
        type: 'error'
      });
    }
  }
);

// response拦截器，接收返回值后可在此先对返回值进行操作
request.interceptors.response.use((response) => {
    return response;
  }, error => {
    if (responseErrorNotiTime === 0) {
      responseErrorNotiTime = errorNotiMinTime;
      Notification({
        customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
        title: '接收信息出现错误',
        message: error,
        type: 'error'
      });
    }
  }
);
export default request;
