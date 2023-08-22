import BaseProxy from './base-proxy'

/**
 * Class LicenseProxy
 */
class LicenseProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/esign-api/api/license', parameters)
  }

  getLicense () {
    return this.submit('get', `${this.endpoint}/get`)
  }
}

export default LicenseProxy
