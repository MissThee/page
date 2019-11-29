import Cookie from 'src/utils/cookies';

export default {
  namespaced: true,//不加namespaced: true,会使getters在this.$store中暴露的名称改变为 nameSpace/property
  state: {
    user: JSON.parse(Cookie.user.getUserValue() ? Cookie.user.getUserValue() : '{}') || {}
  },
  mutations: {
    setUser(state, value) {
      state.user = JSON.parse(JSON.stringify(value));
    },
  },
  actions: {
    setUser(context, value) {
      Cookie.user.setUserValue(JSON.stringify(value));
      context.commit('setUser', value);
    },
  },
  getters: {
    getUser: (state) => state.user,
    getText: () => 'text!!!',
  }
};
