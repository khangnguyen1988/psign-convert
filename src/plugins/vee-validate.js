import messages from 'vee-validate/dist/locale/vi'
import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'

// Merge the locales.
Validator.localize('vi', messages)

Vue.use(VeeValidate, {
  locale: 'en',
  fieldsBagName: 'formFields'
})
