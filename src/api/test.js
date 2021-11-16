import request from "../utils/request";

// const BASE_URL = '/dev-api'
// const BASE_URL = 'https://mock.mengxuegu.com/mock/618cc2b54c5d9932f7e75f77/mms_vue_project'


// request.get(BASE_URL + '/test').then(response => {
//   console.log(response);
// }).catch(error => {
//   console.log(error);
// })

// request({
//   url: BASE_URL + '/test',
//   method: 'get'
// }).then(response => {
//   console.log(response);
// }).catch(error => {
//   console.log(error);
// })

export default {
  getList() {
    return request({
      url: '/test',
      method: 'get'
    })
  }
}