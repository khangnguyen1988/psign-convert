import Vue from 'vue'
import BaseProxy from './base-proxy'

/**
 * Class ESignUserProxy
 */
class ESignUserProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/esign-api/api', parameters)
  }

  createUser (payload) {
    const toast = {
      success: Vue.i18n.t('user.createUserSuccess')
    }
    return this.submit('post', `${this.endpoint}/user/create-new-esign-user`, payload, { toast })
  }

  updateUserRole (payload) {
    const toast = {
      success: Vue.i18n.t('user.updateRoleSuccess')
    }
    return this.submit('post', `${this.endpoint}/user/update-role-esign-user/${payload.id}`, payload, { toast })
  }

  deleteUser (payload) {
    const toast = {
      success: Vue.i18n.t('user.deleteUserSuccess')
    }
    return this.submit('post', `${this.endpoint}/user/delete-esign-user/${payload.id}`, payload, { toast })
  }

  getUsers (searchText) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const companyId = currentUser.company.company_id || currentUser.company.id
    return this.submit('get', `${this.endpoint}/user/get?page=1&limit=1000&company_id=${companyId}&search_text=${searchText || ''}`)
  }
}

export default ESignUserProxy
