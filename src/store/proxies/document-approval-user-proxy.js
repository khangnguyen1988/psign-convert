import Vue from 'vue'
import BaseProxy from './base-proxy'

/**
 * Class DocumentApprovalUserProxy
 */
class DocumentApprovalUserProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/esign-api/api/doc_approval_user', parameters)
  }

  addPersons (signedPersons, signedVendorId) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    return this.submit('post', `${this.endpoint}/add_by_partner`, {
      signed_persons: signedPersons,
      doc_approval_partner: {
        id: signedVendorId
      }
    }, { toast })
  }
}

export default DocumentApprovalUserProxy
