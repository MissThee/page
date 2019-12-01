import Vue from 'vue';
import App from './App';
Vue.config.devtools = true;//使浏览器调试插件可用
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
