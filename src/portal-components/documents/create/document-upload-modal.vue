<template>
  <app-modal
    name="document-upload-modal"
    :submit-on-enter="false"
    :title="title"
    :ok-text="okText"
    @before-open="beforeOpen"
    @before-close="beforeClose"
    width="90%"
    @on-ok="onOk"
    :overflowHidden="true"
  >
    <document-upload
     :document-data="documentData"
     ref="documentUpload"
    >
    </document-upload>
  </app-modal>
</template>
<script>
import AppModal from '@/components/app-modal/index'
import DocumentUpload from '@/portal-components/documents/create/document-upload'
import { FORM_MODE } from '@/app-constant'

export default {
  name: 'DocumentUploadModal',
  components: {
    AppModal,
    DocumentUpload

  },
  data () {
    return {
      title: this.$t('document.createNew'),
      okText: 'Thêm mới',
      documentData: null
    }
  },
  computed: {

  },
  created () {

  },
  beforeDestroy () {

  },
  methods: {
    onOk () {
      this.$refs.documentUpload.submit()
    },
    beforeClose () {

    },
    beforeOpen (params) {
      if (params.mode === FORM_MODE.UPLOAD_NEW_DOC) {
        this.okText = this.$t('app.ok')
        this.title = this.$t('document.createNew')
      } else if (params.mode === FORM_MODE.EDIT_DOC) {
        this.okText = this.$t('app.update')
        this.title = this.$t('document.edit')
      }
      this.documentData = params
    }
  }
}
</script>

<style lang="scss">

</style>
