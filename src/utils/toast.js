import Vue from 'vue'

export default class ToastUtils {
  constructor (toastOptions) {
    if (!toastOptions) {
      return
    }

    this.messages = {
      success: toastOptions.subject ? `${toastOptions.subject} ${Vue.i18n.t('app.hasBeenUpdated')}.` : toastOptions.success,
      error: toastOptions.subject ? `${Vue.i18n.t('app.errorOnUpdate')} ${toastOptions.subject}!` : toastOptions.error,
      loading: toastOptions.loading || toastOptions.subject
    }
  }

  show (type) {
    if (!this.messages || !this.messages[type]) {
      return
    }
    ToastUtils.showToast(type, this.messages[type] || '')
  }

  static getToastConfig (type) {
    const config = {
      loading: {
        type: 'info',
        duration: null,
        className: 'spinner',
        position: 'top-center'
      },
      warning: {
        type: 'info',
        duration: 60000,
        className: 'warning'
      },
      success: { type: 'success' },
      error: { type: 'error' }
    }
    return config[type]
  }

  static showToast (type, msg) {
    const toastConfig = ToastUtils.getToastConfig(type)
    return Vue.toasted.show(msg || `${Vue.i18n.t('app.processing')}...`, toastConfig)
  }
}
