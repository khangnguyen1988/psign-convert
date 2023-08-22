export default function parseInvoiceFile (payload) {
  if (payload) {
    const base64Content = payload.replace(/^b'(.+)'$/, (match, p1) => p1)
    const decodedBase64Content = atob(base64Content)
    const parser = new DOMParser()
    const myDocument = parser.parseFromString(decodedBase64Content, 'text/xml')
    if (!myDocument.querySelector('parsererror')) {
      return { type: 'xml', content: decodeURIComponent(escape(decodedBase64Content)) }
    }
    return { type: 'pdf', content: `data:application/pdf;base64,${base64Content}` }
  }
  return null
}
