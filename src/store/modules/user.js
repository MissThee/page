import types from 'src/store/mutation-types';
import Cookie from 'src/utils/cookies';

const state = {
  user: JSON.parse(Cookie.user.getUserValue()) || {}
};

const mutations = {
  [types.SET_USER](obj, value) {
    state.user = JSON.parse(JSON.stringify(value));
  },
};

export default {
  state,
  mutations,
};
