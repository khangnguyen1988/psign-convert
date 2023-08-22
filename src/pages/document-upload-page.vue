<template>
  <div class="full-screen-container d-flex justify-content-center">
    <div class="card">
      <div class="card-body">
        <app-loading :loading="loading">
          <document-upload :document-data="documentData" ref="documentUpload"> </document-upload>
          <div v-if="!loading" class="row">
            <div class="col-12 text-right">
              <button @click="onClickCancel()" class="btn btn-secondary mr-2">
                Hủy
              </button>
              <button @click="onClickSubmit()" class="btn btn-primary">
                Cập nhật
              </button>
            </div>
          </div>
        </app-loading>
      </div>
    </div>
  </div>
</template>

<script>
import AppLoading from '@/components/app-loading/'
import DocumentUpload from '@/portal-components/documents/create/document-upload'
import DocumentProxy from '@/store/proxies/document-proxy'
import { FORM_MODE } from '@/app-constant'

export default {
  name: 'DocumentUploadPage',
  components: {
    AppLoading,
    DocumentUpload
  },
  data () {
    return {
      documentData: null,
      loading: false
    }
  },
  mounted () {
    this.$bus.on('document-upload-success', this.onDocumentUploadSuccess)
    this.loading = true
    new DocumentProxy({ uuid_url: this.$route.params.uuid_url, limit: 5, page: 1 }).get().then((res) => {
      if (res.length > 0) {
        this.documentData = {
          model: {
            ...res[0].document,
            send_email: res[0].send_email,
            signed_persons: res[0].signed_persons,
            signed_vendors: res[0].signed_vendors
          },
          mode: FORM_MODE.EDIT_DOC
        }
        this.loading = false
      }
    })
  },
  methods: {
    onDocumentUploadSuccess () {
      this.$router.push({ name: 'draft-documents' }).catch(() => {})
    },
    onClickSubmit () {
      this.$refs.documentUpload.submit()
    },
    onClickCancel () {
      this.$router.push({ name: 'draft-documents' }).catch(() => {})
    },
    beforeDestroy () {
      this.$bus.off('document-upload-success', this.onDocumentUploadSuccess)
    }
  }
}
</script>
