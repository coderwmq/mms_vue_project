import router from './router'
import { getUser } from '@/api/login'

router.beforeEach((to, from, next) => {
  /* 获取token */
  const token = localStorage.getItem('mms-token')
  // 如果token为null
  if (!token) {
    // 无token访问非登录页面
    if (to.path !== '/login') {
      // 则返回登录页面
      next({ path: '/login' })
    } else {//访问登陆页面
      next()
    }
  } else {//获取到了token
    if (to.path === '/login') {
      next()
    } else {
      // 获取本地用户信息
      const userInfo = localStorage.getItem('msm-user')
      // 有本地用户信息
      if (userInfo) {
        next()//允许访问任意页面
      } else {//没有用户信息
        // 根据token获取用户信息
        getUser(token).then(response => {
          const respUser = response.data
          // 如果获取到了用户信息
          if (respUser.flag) {
            // 用户信息存储本地
            localStorage.setItem('msm-user', JSON.stringify(respUser.data))
            next()//去哪里都可以
          } else {//没有获取到用户信息
            next({ path: '/login' })
          }
        }).catch(error => {
          return false
        })
      }
    }
  }
});