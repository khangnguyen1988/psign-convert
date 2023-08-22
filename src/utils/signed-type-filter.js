import Vue from 'vue'

Vue.filter('signedType', (value) => {
  if (value === 'SIGNATURE_DIGITAL') {
    return 'Ký điện tử'
  }
  if (value === 'SIGNATURE_DIGITAL_HSM') {
    return 'Ký HSM'
  }
  if (value === 'SIGNATURE_IMAGE') {
    return 'Ký hiện ảnh'
  }
  if (value === 'SIGNATURE_APP_CONFIRMATION') {
    return 'Ký nháy'
  }
  return 'Xem văn bản'
})

Vue.filter('eSignRole', (value) => {
  if (value === 'ESIGN_ROLE_ADMIN') {
    return 'Quản trị viên'
  }
  if (value === 'ESIGN_ROLE_GENERAL') {
    return 'Nhân viên'
  }
  return value
})
