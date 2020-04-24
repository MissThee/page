import request from 'src/utils/request';

export default {
  queryList: requestData => request({
    method: 'post',
    url: '/caseManage/list',
    data: requestData,
  }),
  queryOneTransaction: requestData => request({
    method: 'post',
    url: '/caseManage',
    data: requestData,
  }),
  departmentList: requestData => request({
    method: 'post',
    url: '/caseManage/deptList',
    data: requestData,
  }),
  SubmitForm: requestData => request({
    method: 'patch',
    url: '/caseManage',
    data: requestData,
  }),
  submitDismiss: requestData => request({
    method: 'patch',
    url: '/caseManage/refuse',
    data: requestData,
  }),
  casePipeAdd: requestData => request({
    method: 'put',
    url: '/caseManage/letClue',
    data: requestData,
  }),
  casePipeAmend: requestData => request({
    method: 'patch',
    url: '/caseManage/letClue',
    data: requestData,
  }),
  queryCasePipeId: requestData => request({
    method: 'post',
    url: '/caseManage/letClue',
    data: requestData,
  }),
};
