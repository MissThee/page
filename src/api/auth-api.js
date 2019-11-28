import request from 'src/utils/request';
import Global from 'src/utils/global';

export default {
  getAccessToken: requestData => request({
    method: 'post',
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
};
