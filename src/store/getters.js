export const isXmlInvoice = state => state.invoiceBase64File.length > 10 && state.invoiceBase64File.indexOf('application/pdf') === -1

export default {
  isXmlInvoice
}
