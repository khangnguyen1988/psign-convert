import Vue from 'vue'
import BaseProxy from './base-proxy'

/**
 * Class SignatureProxy
 */
class SignatureProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/esign-api/api/signature', parameters)
  }

  createSignature (payload, uploadStatus) {
    uploadStatus.uploading = true
    const formData = new FormData()
    Object.keys(payload).forEach((k) => {
      formData.append(k, payload[k])
    })

    const toast = {
      error: 'Upload error'
    }
    const result = this.submit('post', `${this.endpoint}/create`, formData, {
      toast,
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

  getSignature () {
    const toast = {
      error: 'Load chữ ký bị lỗi'
    }
    return this.submit('get', `${this.endpoint}/get`, null, { toast })
  }

  deleteSignature (signatureId) {
    const toast = {
      success: Vue.i18n.t('user.deleteSignatureSuccess')
    }
    return this.submit('delete', `${this.endpoint}/delete/${signatureId}`, null, { toast })
  }

  signByImage (payload, uploadStatus) {
    uploadStatus.uploading = true
    const formData = new FormData()
    Object.keys(payload).forEach((k) => {
      if (k === 'doc_files') {
        const files = payload[k]
        for (let i = 0; i < files.length; i++) {
          formData.append('doc_files', files[i])
        }
      } else {
        formData.append(k, payload[k])
      }
    })
    const toast = {
      success: 'Đã ký!',
      error: 'Upload error'
    }
    return this.submit('post', `${this.endpoint}/sign-by-image`, formData, {
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
  }

  signImageByAnonymous (payload, uploadStatus) {
    uploadStatus.uploading = true
    const formData = new FormData()
    Object.keys(payload).forEach((k) => {
      if (k === 'doc_files') {
        const files = payload[k]
        for (let i = 0; i < files.length; i++) {
          formData.append('doc_files', files[i])
        }
      } else {
        formData.append(k, payload[k])
      }
    })
    const toast = {
      success: 'Đã ký!',
      error: 'Upload error'
    }
    return this.submit('post', `${this.endpoint}/sign-by-image-by-anonymous-user`, formData, {
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
  }

  signConfirmation (payload, uploadStatus) {
    const formData = new FormData()
    Object.keys(payload).forEach((k) => {
      formData.append(k, payload[k])
    })
    const toast = {
      success: 'Đã ký nháy!',
      error: 'Upload error'
    }
    return this.submit('post', `${this.endpoint}/sign-by-agree`, formData, {
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
  }

  signHsm (caId, payload) {
    const toast = {
      success: 'Đã ký Hsm!',
      error: 'Ký Hsm bị lỗi'
    }
    return this.submit('post', `${this.endpoint}/sign-by-hsm/${caId}`, payload, { toast })
  }
}

export default SignatureProxy
