/**
 * Main File
 */
import Vue from 'vue'

/**
 * Plugins
 */
import 'promise-polyfill/src/polyfill'
import '@/plugins/vuex'
import '@/plugins/config'
import '@/plugins/tawk'
import '@/plugins/axios'
import { i18n } from '@/plugins/vue-i18n'
import '@/plugins/bootstrap'
import '@/plugins/font-awesome'
import '@/plugins/vee-validate'
import '@/plugins/vue-tabs'
import '@/plugins/toast'
import '@/plugins/vue-modal'
import '@/plugins/vue-event-bus'
import '@/plugins/v-calendar'
import '@/plugins/vue-upload-component'
import '@/utils/numeric'
import '@/utils/signed-type-filter'
/**
 * Styling
 */
import '@/assets/style/main.sass'
import '@/store/proxies/interceptors/index'
import App from './app'
import { router } from './routes'
import store from './store'

store.dispatch('auth/check')

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
