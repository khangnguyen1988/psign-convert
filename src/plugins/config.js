import Vue from 'vue'
import AppConfig from '@/app-config'

Vue.$config = AppConfig
Object.defineProperty(Vue.prototype, '$config', {
  get () {
    return AppConfig
  }
})
