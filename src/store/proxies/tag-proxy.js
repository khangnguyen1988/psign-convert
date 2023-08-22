import BaseProxy from './base-proxy'

/**
 * Class TagProxy
 */
class TagProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/esign-api/api/tag', parameters)
  }

  getTags (searchParams) {
    this.setParameters(Object.assign({}, { limit: 100, page: 1 }, searchParams))
    return this.submit('get', `${this.endpoint}/get`)
  }

  createTag (payload) {
    const toast = {
      success: 'Tạo nhãn thành công'
    }
    return this.submit('post', `${this.endpoint}/create`, payload, { toast })
  }

  updateTag (payload) {
    const toast = {
      success: 'Cập nhật nhãn thành công'
    }
    return this.submit('post', `${this.endpoint}/update`, payload, { toast })
  }

  deleteTag (id) {
    const toast = {
      success: 'Xoá nhãn thành công'
    }
    return this.submit('delete', `${this.endpoint}/delete/${id}`, null, { toast })
  }

  setTagForDocument (payload) {
    return this.submit('post', `${this.endpoint}/assign-document-to-tag`, payload)
  }
}

export default TagProxy
