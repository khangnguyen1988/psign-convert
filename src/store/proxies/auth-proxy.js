import Vue from 'vue'
import BaseProxy from './base-proxy'

/**
 * Class AuthProxy
 */
class AuthProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('', parameters)
  }

  /**
   * @param {Object} user
   * @returns {Promise}
   */
  login (user) {
    const toast = {
      error: Vue.i18n.t('user.invalidEmailOrPass')
    }
    return this.submit('post', `${this.endpoint}/user-api/api/token/`, user, { toast })
  }

  refresh (token) {
    return this.submit('post', `${this.endpoint}/user-api/api/token/refresh/`, { refresh: token })
  }
}

export default AuthProxy
