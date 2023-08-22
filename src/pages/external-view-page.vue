<template>
  <div class="full-screen-container d-flex justify-content-center">
    <div class="card">
      <div class="card-body">
         <view-document v-if="uuid_url" :uuid="uuid_url"></view-document>
      </div>
    </div>
  </div>
</template>

<script>
import ViewDocument from '@/portal-components/documents/view/view-document'

export default {
  name: 'ExternalViewPage',
  components: {
    ViewDocument
  },
  props: {
    uuid_url: String
  },
  data () {
    return {}
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
  }
}
</script>
<style scoped>
.card {
  width: 100%;
}
.full-screen-container {
  padding: 4rem;
}
</style>
