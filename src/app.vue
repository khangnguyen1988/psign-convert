<script>
import AppLayout from '@/layouts/app-layout'
import EmptyLayout from '@/layouts/empty-layout'
import LayoutMixin from './mixins/layout'

export default {
  name: 'PvsEContractWeb',
  mixins: [LayoutMixin],
  created () {
    this.$i18n.locale = localStorage.getItem('lang')
    this.$i18n.fallbackLocale = this.$config.fallbackLocale
    if (!this.$i18n.locale) {
      localStorage.setItem('lang', this.$i18n.locale = this.$config.locale)
    }
    this.$validator.localize(this.$i18n.locale)
  },
  mounted () {
    if (this.$store.state.auth.authenticated) {
      // this.$store.dispatch('account/find');
    }
  },
  components: {
    AppLayout,
    EmptyLayout
  }
}
</script>
