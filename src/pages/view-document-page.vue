<template>
  <div class="document-list-container w-100">
    <div class="page-title">
      <h6>Chi tiết văn bản</h6>
    </div>
    <view-document :id="id"></view-document>
  </div>
</template>

<script>

import ViewDocument from '@/portal-components/documents/view/view-document'

export default {
  name: 'ViewDocumentPage',
  components: {
    ViewDocument
  },
  props: {
    id: String
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
  }
}
</script>
<style lang="scss">
.page-title {
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 70px;
  h6 {
    font-size: 1.25rem;
  }
}
</style>
