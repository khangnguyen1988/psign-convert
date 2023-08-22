import BaseProxy from './base-proxy'

/**
 * Class GroupProxy
 */
class GroupProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/esign-api/api/group', parameters)
  }

  getGroups (searchParams) {
    this.setParameters(Object.assign({}, { limit: 100, page: 1 }, searchParams))
    return this.submit('get', `${this.endpoint}/get`)
  }

  createGroup (payload) {
    const toast = {
      success: 'Tạo nhóm thành công'
    }
    return this.submit('post', `${this.endpoint}/create`, payload, { toast })
  }

  updateGroup (payload) {
    const toast = {
      success: 'Cập nhật nhóm thành công'
    }
    return this.submit('post', `${this.endpoint}/update`, payload, { toast })
  }

  deleteGroup (id) {
    const toast = {
      success: 'Xoá nhóm thành công'
    }
    return this.submit('delete', `${this.endpoint}/delete/${id}`, null, { toast })
  }

  getMembers (searchParams) {
    this.setParameters(Object.assign({}, { limit: 100, page: 1 }, searchParams))
    return this.submit('get', `${this.endpoint}/get-member`)
  }

  addDocuments (payload) {
    const toast = {
      success: 'Cập nhật nhóm thành công'
    }
    return this.submit('post', `${this.endpoint}/assign-document-to-group`, payload, { toast })
  }

  addMembers (payload) {
    const toast = {
      success: 'Thêm thành viên thành công'
    }
    return this.submit('post', `${this.endpoint}/assign-member-to-group`, payload, { toast })
  }
}

export default GroupProxy
