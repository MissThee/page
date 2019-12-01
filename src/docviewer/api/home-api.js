import request from 'src/docviewer/utils/request';
import Global from 'src/docviewer/utils/global';

export default {
  getFileFromGithub: requestData => request({
    method: 'get',
    url:  requestData.url,
  }),
};
