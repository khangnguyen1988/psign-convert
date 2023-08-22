import Vue from 'vue'
import BaseProxy from './base-proxy'

/**
 * Class CaSignProxy
 */
class CaSignProxy extends BaseProxy {
  /**
   * Constructor.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor (parameters = {}) {
    super('/e-invoice-api/api/ca-sign', parameters)
  }

  sign (payload, uploadStatus) {
    uploadStatus.uploading = true
    const formData = new FormData()
    formData.append('pdf_url', payload.pdf_url)
    formData.append('sign_pos', payload.sign_pos)
    formData.append('reason', payload.reason)
    formData.append('page_number', payload.page_number)

    return this.submit('post', `http://localhost:32318/api/ca/sign-pdf-form/${payload.serial_number}`, formData, {
      showLoading: true,
      responseType: 'blob',
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

  getActiveCertificate (caType) {
    return this.submit('get', `${this.endpoint}/list?page=1&page_size=1&is_active=true&ca_type=${caType || ''}`)
  }

  listAll () {
    return this.submit('get', `${this.endpoint}/list?page=1&page_size=100`)
  }

  delete () {
    return this.submit('delete', `${this.endpoint}/delete`)
  }

  deleteSignature (signatureId) {
    const toast = {
      success: Vue.i18n.t('user.deleteSignatureSuccess')
    }
    return this.submit('delete', `${this.endpoint}/delete/${signatureId}`, null, { toast })
  }

  activeSignature (signatureId) {
    const toast = {
      success: 'Kích hoạt thành công'
    }
    return this.submit('post', `${this.endpoint}/active-signature/${signatureId}`, null, { toast })
  }

  blockSignature (signatureId) {
    const toast = {
      success: 'Vô hiệu thành công'
    }
    return this.submit('post', `${this.endpoint}/block-signature/${signatureId}`, null, { toast })
  }

  createSign (payload, uploadStatus) {
    uploadStatus.uploading = true
    const formData = new FormData()
    formData.append('password', payload.password)
    formData.append('ca_type', payload.ca_type)
    formData.append('cert_file', payload.cert_file)

    const toast = {
      success: 'Tạo chứng thư số thành công',
      error: 'Tạo chứng thư số bị lỗi'
    }
    return this.submit('post', `${this.endpoint}/create`, formData, {
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
}

export default CaSignProxy
