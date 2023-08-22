import Vue from 'vue'
import BaseProxy from './base-proxy'

/**
 * Class DocumentProxy
 */
class DocumentProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/esign-api/api/document', parameters)
  }

  createDocument (payload = {}, uploadStatus) {
    uploadStatus.uploading = true
    const formData = new FormData()
    Object.keys(payload).forEach((k) => {
      if (k === 'doc_files') {
        const values = payload[k]
        for (let i = 0; i < values.length; i++) {
          formData.append(k, values[i])
        }
      } else if (k === 'tag_id' || k === 'group_id') {
        formData.append(k, JSON.stringify(payload[k].map(v => ({ id: v }))))
      } else {
        formData.append(k, payload[k])
      }
    })

    const toast = {
      error: 'Upload error'
    }
    const result = this.submit('post', `${this.endpoint}/create`, formData, {
      toast,
      showLoading: true,
      onUploadProgress (progressEvent) {
        uploadStatus.percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return result
  }

  markFile (payload) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    return this.submit('post', `${this.endpoint}/mark_file_in_draft`, payload, { toast })
  }

  removeFileFromDocument (payload) {
    const toast = {
      success: Vue.i18n.t('app.deleteSuccess')
    }
    return this.submit('post', `${this.endpoint}/delete_file_in_draft`, payload, { toast })
  }

  uploadFileToDocument (payload = {}, uploadStatus) {
    uploadStatus.uploading = true
    const formData = new FormData()
    Object.keys(payload).forEach((k) => {
      if (k === 'doc_files') {
        const values = payload[k]
        for (let i = 0; i < values.length; i++) {
          formData.append(k, values[i])
        }
      } else {
        formData.append(k, payload[k])
      }
    })

    const toast = {
      error: 'Upload error'
    }
    const result = this.submit('post', `${this.endpoint}/upload_file_in_draft`, formData, {
      toast,
      showLoading: true,
      onUploadProgress (progressEvent) {
        uploadStatus.percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return result
  }

  updateDocument (payload = {}) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    return this.submit('post', `${this.endpoint}/update`, payload, { toast })
  }

  changeDocument (payload = {}) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    const dataSubmit = {
      ...payload,
      tag_id: payload.document.tag_id.map(v => ({ id: v })),
      group_id: payload.document.group_id.map(v => ({ id: v }))
    }
    return this.submit('post', `${this.endpoint}/change`, dataSubmit, { toast })
  }

  deleteDocument (id) {
    const toast = {
      success: Vue.i18n.t('app.deleteSuccess')
    }
    return this.submit('post', `${this.endpoint}/delete`, { document_id: id }, { toast })
  }

  get (options) {
    return this.submit('get', `${this.endpoint}/get`, options)
  }

  getByPartner (options) {
    return this.submit('get', `${this.endpoint}/get_by_partner`, options)
  }

  getDraftByPartner (options) {
    return this.submit('get', `${this.endpoint}/get_draft_by_partner`, options)
  }

  getDraftByAnonymous (options) {
    return this.submit('get', `${this.endpoint}/get_draft_by_anonymous_user`, options)
  }

  getByUser (options) {
    return this.submit('get', `${this.endpoint}/get_by_user`, options)
  }

  countByUser (options) {
    return this.submit('get', `${this.endpoint}/count_by_user`, options)
  }

  getByAnonymous (options) {
    return this.submit('get', `${this.endpoint}/get_by_anonymous_user`, options)
  }

  rejectDocument (id, note) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    return this.submit('post', `${this.endpoint}/decline`, { id, note }, { toast })
  }

  rejectDocumentByVendor (id) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    return this.submit('post', `${this.endpoint}/decline-by-partner`, { id }, { toast })
  }

  rejectDocumentByAnonymous (id, note) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    return this.submit('post', `${this.endpoint}/decline-by-anonymous-user`, { uuid_url: id, note }, { toast })
  }

  createComment (payload) {
    const toast = {
      success: Vue.i18n.t('document.updateCommentSuccess')
    }
    return this.submit('post', `${this.endpoint}/create_comment`, payload, { toast })
  }

  getComments (options) {
    return this.submit('get', `${this.endpoint}/get_comment`, options)
  }

  getTasks (options) {
    return this.submit('get', `${this.endpoint}/get_check_list`, options)
  }

  createTask (payload) {
    const toast = {
      success: Vue.i18n.t('app.createSuccess')
    }
    return this.submit('post', `${this.endpoint}/create_check_list`, payload, { toast })
  }

  updateTask (payload) {
    const toast = {
      success: Vue.i18n.t('app.updateSuccess')
    }
    return this.submit('post', `${this.endpoint}/update_check_list`, payload, { toast })
  }

  deleteTask (payload) {
    const toast = {
      success: Vue.i18n.t('app.deleteSuccess')
    }
    return this.submit('post', `${this.endpoint}/delete_check_list`, payload, { toast })
  }
}

export default DocumentProxy
