import { getToken, setToken, setUser, getUser, removeToken } from '@/utils/auth'
import { login, logOut,getUsers } from '@/api/login'





const user = {
  state: {
    token: getToken(),
    user: getUser()
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      setToken(token)
    },
    SET_USER(state, user) {
      state.user = user
      setUser(user)
    },
  },
  actions: {
    // 登录获取token
    Login({ commit }, form) {
      // resolve触发成功之后的处理,reject触发异常处理
      return new Promise((resolve, reject) => {
        login(form.username.trim(), form.password).then(response => {
          const resp = response.data
          commit('SET_TOKEN', resp.data.token)
          console.log('1.Login',resp);
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 通过token获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUsers(state.token).then(response => {
          const respUser = response.data
          console.log('3.GetUserInfo',respUser);
          commit('SET_USER', respUser.data)
          resolve(respUser)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出
    LoginOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logOut(state.token).then((response) => {
          const resp = response.data;
          commit('SET_TOKEN', null)
          commit('SET_USER', null)
          removeToken()
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user