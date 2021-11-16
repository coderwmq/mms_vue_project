import request from '@/utils/request'



// 获取token
export function login(username, pass) {
  return request({
    url: '/user/login',
    method: 'post',
    data() {
      username,
        pass
    },
  })
}


// 根据token获取用户信息
export function getUsers(token) {
  return request({
    url: `/user/info/${token}`,
    method: 'get'
  })
}

// 退出登录
export function logOut(token) {
  return request({
    url: `/user/logout`,
    method: 'post',
    data: {
      token
    }
  })
}