import Cookies from 'js-cookie';
import { Notification } from 'element-ui';

const tokenKey = 'Admin-Token';

export function getToken() {
  return Cookies.get(tokenKey);
}

export function setToken(value) {
  return Cookies.set(tokenKey, value);
}

export function removeToken() {
  return Cookies.remove(tokenKey);
}

function noAuth() {
  Notification({
    customClass: 'custom-message-box-z-index',//确保不被dialog遮罩层遮盖，样式定义于assets/css/style.css中
    title: '您尚未登录',
    message: '请登录以获取更多权限',
    type: 'error'
  });
}
