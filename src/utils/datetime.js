import moment from 'moment'
import Vue from 'vue'

moment.locale(Vue.$config.locale)

export default class DateTimeUtils {
  static parseDate (dateString, pattern) {
    return moment(dateString, pattern || 'YYYY-MM-DD')
  }

  static formatDate (value, pattern) {
    if (!value) {
      return null
    }
    return moment(value).format(pattern || Vue.$config.format.date)
  }

  static formatDateTime (value, pattern) {
    if (!value) {
      return ''
    }
    return moment(value).format(pattern || Vue.$config.format.datetime)
  }

  static formatTime (value, pattern) {
    if (!value) {
      return ''
    }
    return moment(value).format(pattern || Vue.$config.format.time)
  }

  static formatYear (value, pattern) {
    if (!value) {
      return ''
    }
    return moment(value).format(pattern || Vue.$config.format.year)
  }

  static now (pattern) {
    return moment().format(pattern)
  }
}

Vue.filter('formatDate', (value, pattern) => DateTimeUtils.formatDate(value, pattern))
Vue.filter('formatDateTime', (value, pattern) => DateTimeUtils.formatDateTime(value, pattern))
Vue.filter('formatTime', (value, pattern) => DateTimeUtils.formatTime(value, pattern))
Vue.filter('formatYear', (value, pattern) => DateTimeUtils.formatYear(value, pattern))
