import numeral from 'numeral'
import Vue from 'vue'

Vue.$config.locales.forEach((item) => {
  numeral.register('locale', item.name, item.format)
})
numeral.locale(Vue.$config.locale)

export default class NumericUtils {
  static formatNumber (value, pattern) {
    switch (pattern) {
      case 'bytes':
      case 'currency':
      case 'exponential':
      case 'numbers':
      case 'percentages':
      case 'time':
        pattern = Vue.$config.format[pattern]
        break
      default:
        pattern = pattern || Vue.$config.format.numbers
    }
    return numeral(value).format(pattern)
  }
}

Vue.filter('formatNumber', (value, pattern) => NumericUtils.formatNumber(value, pattern))
