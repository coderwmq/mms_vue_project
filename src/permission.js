import router from './router'
// import { getUsers, login } from '@/api/login'
import store from './store'

router.beforeEach((to, from, next) => {
  /* 获取token */
  // const token = localStorage.getItem('mms-token')
  const token = store.state.user.token
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
      // const userInfo = localStorage.getItem('mms-user')
      const userInfo = store.state.user.user
      console.log('userInfo',userInfo);
      // 有本地用户信息
      if (userInfo) {
        next()//允许访问任意页面
      } else {//没有用户信息
        console.log('2.有令牌',userInfo);
        // 根据token获取用户信息
        store.dispatch('GetUserInfo').then(response => {
          if (response.flag) {
            console.log('3.有令牌，有用户信息',response);
            next()
          } else {
            next({
              path: '/login'
            })
          }
        })
      }
    }
  }
});