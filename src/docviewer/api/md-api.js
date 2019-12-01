import request from 'src/docviewer/utils/request';
import Global from 'src/docviewer/utils/global';

export default {
  getFileFromGithub: requestData => request({
    method: 'get',
    url: requestData.url,
  }),
  saveMdFile: requestData => request({
    method: 'put',
    headers:{
      Authorization:"token "+requestData.token
    },
    data: {
      message: 'a new commit message from web',
      content: requestData.content,
      sha: requestData.sha,
    },
    url: requestData.url,
  }),
};
