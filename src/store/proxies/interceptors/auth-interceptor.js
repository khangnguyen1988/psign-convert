import Vue from 'vue'
import store from '@/store'
import ToastUtils from '@/utils/toast'

let timeout = null

Vue.$http.interceptors.response.use(
  response => response,
  (error) => {
    let message = error.response.data.detail || error.response.data.message
    if (typeof error.response.data.detail === 'object' && error.response.data.detail !== null) {
      message = JSON.stringify(error.response.data.detail)
    }
    const status = error.response.status
    let maxRetry = localStorage.getItem('maxRetry')
    maxRetry = maxRetry ? parseInt(maxRetry, 0) : 5
    switch (status) {
      case 401:
      case 403:
        if (error.response.config.url.indexOf('/user-api/api/token/refresh/') === -1 && maxRetry > 0) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            store.dispatch('auth/refresh')
            localStorage.setItem('maxRetry', `${maxRetry - 1}`)
          }, 200)
        } else {
          localStorage.setItem('maxRetry', '5')
          store.dispatch('auth/logout')
        }
        break
      case 422:
        ToastUtils.showToast('warning', message)
        break
      default:
        ToastUtils.showToast('error', message)
    }
    return Promise.reject(error)
  })
