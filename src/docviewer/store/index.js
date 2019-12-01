import Vue from 'vue';
import Vuex from 'vuex';
import layout from 'src/docviewer/store/modules/layout';
import user from 'src/docviewer/store/modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: user,
    layout: layout,
  }
});
