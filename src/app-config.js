export default {
  fallbackLocale: 'en',
  locale: 'vi',
  locales: [{
    name: 'vi',
    format: {
      delimiters: {
        thousands: ',',
        decimal: '.'
      },
      currency: {
        symbol: 'VND'
      },
      abbreviations: {
        billion: ' tỷ',
        million: ' tr',
        thousand: ' k',
        trillion: ' nghìn tỷ'
      }
    }
  }],
  format: {
    bytes: '0b', // numeral, 100B, 1KB
    currency: '0.00a', // numeral, 10 nghìn
    date: 'DD.MM.YY', // moment, 06.12.17
    datePicker: 'DD.MM.YYYY', // moment, 06.12.2020
    datetime: 'DD.MM.YY HH:mm', // moment, 06.12.17 18.52
    exponential: '0,0e+0', // numeral, 1e+9
    numbers: '0,0', // numeral, 10,000
    percentages: '0%', // numeral, 100%
    time: 'HH:mm', // moment, 18.52
    year: 'YYYY' // moment, 2017
  }
}
