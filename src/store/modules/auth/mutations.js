/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import Vue from 'vue'
import {
  CHECK,
  REGISTER,
  LOGIN,
  LOGOUT, UPDATE_COMPANY_INFO, UPDATE_USER_PROFILE
} from './mutation-types'

export default {
  [CHECK] (state) {
    state.authenticated = !!localStorage.getItem('id_token')
    if (state.authenticated) {
      Vue.$http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('id_token')}`
    }
  },

  [REGISTER] () {
    //
  },

  [LOGIN] (state, response) {
    state.authenticated = true
    state.currentUser = response.profile
    localStorage.setItem('currentUser', JSON.stringify(response.profile))
    localStorage.setItem('id_token', response.access)
    localStorage.setItem('refresh_token', response.refresh)
    Vue.$http.defaults.headers.common.Authorization = `Bearer ${response.access}`
  },
  REFRESH (state, response) {
    localStorage.setItem('id_token', response.access)
    localStorage.setItem('refresh_token', response.refresh)
    Vue.$http.defaults.headers.common.Authorization = `Bearer ${response.access}`
  },
  [LOGOUT] (state) {
    state.authenticated = false
    state.currentUser = null
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('currentUser')
    Vue.$http.defaults.headers.common.Authorization = ''
  },

  [UPDATE_COMPANY_INFO] (state, response) {
    state.currentUser.company = response
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
  },
  [UPDATE_USER_PROFILE] (state, response) {
    state.currentUser.name = response.name
    state.currentUser.phone = response.phone
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
  }

}
