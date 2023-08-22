import axios from 'axios'
import Vue from 'vue'
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    Accept: 'application/json'
  },
  withCredentials: false
})

Vue.prototype.$http = Vue.$http = instance
