/* ============
 * Vue i18n
 * ============
 *
 * Internationalization plugin of Vue.js.
 *
 * https://kazupon.github.io/vue-i18n/
 */

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/locale'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'vi',
  fallbackLocale: 'en',
  messages
})

Vue.i18n = i18n

export default {
  i18n
}
