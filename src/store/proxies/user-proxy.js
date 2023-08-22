import Vue from 'vue'
import BaseProxy from './base-proxy'

/**
 * Class UserProxy
 */
class UserProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/user-api/api', parameters)
  }

  updateUserInfo (payload) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    return this.submit('post', `${this.endpoint}/update-user-info`, payload, { toast })
  }

  register (payload) {
    const toast = {
      success: Vue.i18n.t('app.createSuccess')
    }
    return this.submit('post', `${this.endpoint}/register-new-account`, payload, { toast })
  }

  updateCompanyInfo (payload) {
    const toast = {
      success: Vue.i18n.t('user.updateCompanyInfoSuccess')
    }
    return this.submit('post', `${this.endpoint}/update-company-info`, payload, { toast })
  }

  setUserPassword (password) {
    const toast = {
      subject: Vue.i18n.t('user.setPassword')
    }
    return this.submit('post', `${this.endpoint}/set-user-password`, { password }, {
      toast
    })
  }

  forgotUserPassword (email) {
    const toast = {
      subject: Vue.i18n.t('user.forgotPassword')
    }
    return this.submit('post', `${this.endpoint}/forgot-user-password`, { email }, { toast })
  }

  searchCompanyInfo (searchText) {
    return this.submit('get', `${this.endpoint}/search-list-info-company?search=${encodeURIComponent(searchText)}`)
  }
}

export default UserProxy
