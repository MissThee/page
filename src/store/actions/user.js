import types from 'src/store/mutation-types';
import Cookie from 'src/utils/cookies';

export default {
  setUser(context, value) {
    Cookie.user.setUserValue(JSON.stringify(value));
    context.commit(types.SET_USER, value);
  },
};
