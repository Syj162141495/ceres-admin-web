import Vue from 'vue'
import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

const baseURL = process.env.VUE_APP_DOMAIN_PREFIX
// create an axios instance
Vue.prototype.axios = axios
axios.defaults.timeout = 5000
const service = axios.create({
  // baseURL: "http://172.16.101.241:8003", // url = base url + request url
  baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

export const uploadUrl = `${baseURL}/file/upload`

// request interceptor
service.interceptors.request.use(
  config => {
    // console.log(config)
    if (store.getters.token) {
      config.headers['Authorization-admin'] = getToken()
      console.log(getToken())
      config.headers['Content-Type'] = 'application/json; charset=UTF-8'
      // config.headers['type'] = ' admin'
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.config.responseType === 'blob') {
      console.log(response.data)
      return response.data
    }
    if (res.code !== '') {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (!error.message.includes('timeout')) {
      Message({
        message: '服务器暂无响应，请稍后重试',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
