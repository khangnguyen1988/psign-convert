<template>
  <div class="home-container">

  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'HomePage',
  data () {
    return {}
  },
  beforeDestroy () {
    // this.$bus.off('update-invoice-success', this.onUpdateInvoiceSuccess);
  },
  created () {
    // this.$bus.on('update-invoice-success', this.onUpdateInvoiceSuccess);
  },

  mounted () {
    // const vm = this;
  },
  computed: {
    ...mapState([
      'directoryTagFilterText',
      'appNavbarDisplay'
    ]),
    ...mapGetters(['isXmlInvoice'])
  },
  methods: {
    ...mapActions(['getTags'])
  },
  watch: {
  },
  components: {
  }
}
</script>
<style>
</style>
