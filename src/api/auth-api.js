import request from 'src/utils/request';
import Global from 'src/utils/global';
import Cookie from 'src/utils/cookies';

export default {
  getAccessToken: requestData => request({
    method: 'get',
    url: 'https://github.com/login/oauth/access_token',
    headers: {
      Accept: 'application/json',
    },
    params: {
      client_id: Global.APP.client_id,
      client_secret: Global.APP.client_secret,
      code: requestData.code
    },
  }),
  getUserInfo: requestData => request({
    method: 'get',
    url: 'https://api.github.com/user',
    headers: {
      Accept: 'application/json',
    },
    params: {
      access_token: Cookie.token.getTokenValue(),
    },
  }),
};
