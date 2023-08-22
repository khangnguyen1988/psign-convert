export default {
  created () {
    this.$i18n.locale = localStorage.getItem('lang')
    this.$i18n.fallbackLocale = this.$config.fallbackLocale
    if (!this.$i18n.locale) {
      localStorage.setItem('lang', this.$i18n.locale = this.$config.locale)
    }
  }
}
