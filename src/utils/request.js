import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 生产
let baseURL = 'https://203.110.222.136:13448'

// let baseURL = 'http://35.201.215.236:13448' // test
if (process.env.NODE_ENV == 'development') {
  // baseURL = 'http://120.53.124.140:8083'
  // baseURL = 'http://192.168.3.33:8080'
    // baseURL = 'http://203.110.221.120:8889'
    // baseURL = 'http://192.168.3.190:8081' 
    baseURL = 'http://35.201.215.236:13448'
    // baseURL = 'https://203.110.222.136:13448'

}
// 生产
export const fileUrl = 'https://203.110.222.136:13448/api'


// export const fileUrl = 'https://203.110.222.136:13448/api' 


// export const fileUrl = 'http://27.128.239.88:13448/api'

// export const fileUrl = 'http://35.201.215.236:13448/api'


// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  baseURL: baseURL + '/api',
  // baseURL: baseURL,
  timeout: 30000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['TOKEN'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  if(response.data.data && response.data.data.status == -99) {
    storage.remove('Access-Token')
    notification.error({
      message: `${response.data.data.message}`
    });
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } else {
    return response.data
  }
  if(response.data.data.status == -1) {
    notification.error({
      message: `${response.data.data.message}`
    });
  } else {
    return response.data
  }
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
