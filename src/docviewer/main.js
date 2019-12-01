import Vue from 'vue';
import store from './store';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import 'src/docviewer/assets/css/style.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Base64 from 'js-base64';

Vue.config.devtools = true;//使浏览器调试插件可用
Vue.use(ElementUI);
Vue.use(mavonEditor);
Vue.use(Base64);

new Vue({
  el: '#app',
  router: router,
  store,
  components: { App },
  template: '<App/>',
});
