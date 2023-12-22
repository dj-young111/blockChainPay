import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 生产
let baseURL =  'https://sharechain.xacip.net' //'http://144.7.99.96:12448' //'http://144.7.99.96:23559'

if (process.env.NODE_ENV == 'development') {
    // baseURL = 'http://35.201.215.236:13448'  'http://172.16.10.97:8081' //
    baseURL = 'http://144.7.99.96:12448'
    // baseURL = 'http://172.16.10.97:8081'
}
// 生产
export const fileUrl = 'https://sharechain.xacip.net/api'

// 测试
// export const fileUrl = 'http://144.7.99.96:12448/api'

// 

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
  // console.log(response.data)
  if(response.data && response.data.status == -9 || response.data && response.data.status == -99 || response.data && response.data.status == -8) {
    storage.remove('Access-Token')
    notification.error({
      message: `${response.data.message}`
    });
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } else {
    return response.data
  }
  if(response.data.status == -1) {
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
