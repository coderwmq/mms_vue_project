import axios from 'axios'

// 手动创建一个axios对象
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 导出request对象
export default request