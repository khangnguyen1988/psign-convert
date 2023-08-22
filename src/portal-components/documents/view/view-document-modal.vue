<template>
  <app-modal name="view-document-modal" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose" hide-footer  width="90%" @on-ok="onOk">
    <view-document v-if="modelLoaded" :document-model="documentModel"></view-document>
  </app-modal>
</template>
<script>
import { mapState } from 'vuex'
import AppModal from '@/components/app-modal/index'
import ViewDocument from '@/portal-components/documents/view/view-document'

export default {
  name: 'ViewDocumentModal',
  components: {
    AppModal,
    ViewDocument
  },
  data () {
    return {
      modelLoaded: false,
      title: this.$t('document.createNew'),
      documentModel: null
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {
    onOk () {
    },
    beforeClose () {
    },
    getTitle () {
      return 'Chi tiết văn bản'
    },
    beforeOpen (params) {
      const documentModel = params.model
      this.title = this.getTitle()
      if (documentModel.id) {
        this.documentModel = documentModel
        this.modelLoaded = true
      }
    }
  }
}
</script>

<style scoped>
 .selected-files {
  padding: 0;
  margin: 0;
 }
 .selected-files li {
   cursor: pointer;
  list-style: none;
  padding: .5rem;
  border: 1px solid #ccc;
  margin: 1rem 0;
  border-radius: 3px;
 }
 .selected-files li.active, .selected-files li:hover  {
   background: #DAECF9;
   border: 1px solid #DAECF9;
 }
 .selected-files li.active  {
   font-weight: bold;
   color: #225b87;
 }
 .pdf-viewer-container {
   height: 85vh;
 }

</style>
