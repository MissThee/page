import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import 'src/assets/css/style.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Base64 from 'js-base64';


Vue.use(Vuex);
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
