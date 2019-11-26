import request from 'src/utils/request';
import Global from 'src/utils/global';

export default {
  getFileFromGithub: requestData => request({
    method: 'get',
    url:  requestData.url,
  }),
};
