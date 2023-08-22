/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import Vue from 'vue'
import AuthProxy from '@/store/proxies/auth-proxy'
import UserProxy from '@/store/proxies/user-proxy'
import * as types from './mutation-types'

const onSuccess = (commit, resolve, actionType) => (result) => {
  commit(actionType, result)
  resolve(result)
}

export const check = ({ commit }) => {
  commit(types.CHECK)
}

function toNextRoute () {
  const originalRoute = JSON.parse(localStorage.getItem('originalRoute'))
  const nextRoute = {
    path: originalRoute ? originalRoute.path : '/incoming-documents/wait-for-sign'
  }
  localStorage.removeItem('originalRoute')
  Vue.router.push(nextRoute)
}

export const login = ({ commit }, payload) => new Promise((resolve, reject) => {
  new AuthProxy()
    .login(payload)
    .then((response) => {
      commit(types.LOGIN, response)
      resolve(response)
      toNextRoute()
    })
    .catch((errors) => {
      reject(errors)
    })
})

export const refresh = ({ commit, dispatch }) => new Promise((resolve, reject) => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (refreshToken) {
    new AuthProxy().refresh(refreshToken).then((response) => {
      commit('REFRESH', response)
      resolve(response)
      location.reload()
    })
  } else {
    reject(true)
    dispatch('logout')
  }
})

export const logout = ({ commit }) => {
  Vue.router.push({
    name: 'login'
  })
  commit(types.LOGOUT)
}

export const register = ({ commit }, payload) => new Promise((resolve, reject) => {
  new UserProxy().register(payload).then(res => resolve(res)).catch(e => reject(e))
})

export const forgotPassword = ({ commit }, payload) => new Promise((resolve) => {
  new UserProxy().forgotUserPassword(payload).then(res => resolve(res))
})

export const updateCompanyInfo = ({ commit }, payload) => new Promise((resolve) => {
  new UserProxy().updateCompanyInfo(payload).then(onSuccess(commit, resolve, types.UPDATE_COMPANY_INFO))
})

export const updateUserProfile = ({ commit }, payload) => new Promise((resolve) => {
  const userProxy = new UserProxy()
  userProxy.updateUserInfo({
    name: payload.name,
    phone: payload.phone
  }).then(onSuccess(commit, resolve, types.UPDATE_USER_PROFILE))
  if (payload.password) {
    userProxy.setUserPassword(payload.password)
  }
})

export default {
  check,
  register,
  refresh,
  login,
  logout,
  updateCompanyInfo,
  updateUserProfile,
  forgotPassword
}
