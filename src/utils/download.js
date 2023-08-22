export const downloadFile = (fileName, content) => {
  const isIE11 = !!window.MSInputMethodContext && !!document.documentMode
  if (isIE11) {
    return window.navigator.msSaveBlob(new Blob([content]), fileName)
  }

  const url = window.URL.createObjectURL(new Blob([content]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  })
  return true
}

export default {
  downloadFile
}
