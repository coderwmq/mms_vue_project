import axios from 'axios'
import { Loading, Message } from 'element-ui'

// 手动创建一个axios对象
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 单例模式
const loading = {
  loadingInstance: null,
  open() {
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
        target: '.app-main-right',
        text: '拼命加载中',
        background: "rgba(0, 0, 0, 0.8)"
      })
    }
  },
  close() {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close()
    }
    this.loadingInstance = null
  }
}

// 请求拦截器
request.interceptors.request.use(config => {
  // 请求拦截
  loading.open()
  return config
}, error => {
  loading.close()
  return Promise.reject(error)
})


// 响应拦截器
request.interceptors.response.use(response => {
  // 响应拦截
  const resp = response.data


  // 后台正常响应的状态，如果不是2000，说明后台处理有问题
  if (resp.code !== 2000) {
    Message({
      message: resp.message || '系统异常',
      type: 'warning',
      duration: 5 * 1000
    })
  }

  loading.close()
  return response
}, error => {
  loading.close()
  return Promise.reject(error)
})

export default request
