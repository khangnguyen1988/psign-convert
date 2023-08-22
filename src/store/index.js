/* ============
 * Vuex Store
 * ============
 *
 * The store of the application.
 *
 * http://vuex.vuejs.org/en/index.html
 */

import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
// Modules
import auth from './modules/auth'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
  modules: {
    auth
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
