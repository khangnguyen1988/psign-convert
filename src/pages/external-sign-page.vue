<template>
  <div class="full-screen-container d-flex justify-content-center">
    <div class="card">
      <div class="card-body">
        <app-loading :loading="loading">
          <document-approval-form :external-sign-uuid="uuid_url" ref="form" v-if="model" :model="model"></document-approval-form>
          <div v-if="!loading"  class="row">
            <div class="col-12 text-right">
              <button @click="onClickReject()" class="btn btn-secondary mr-2">Từ chối</button>
              <button @click="onClickSign()" class="btn btn-primary">Ký văn bản</button>
            </div>
          </div>
        </app-loading>
      </div>
    </div>
    <signature-modal></signature-modal>
  </div>

</template>

<script>
import AppLoading from '@/components/app-loading/'
import SignatureModal from '@/portal-components/signature/signature-modal'
import DocumentApprovalForm from '@/portal-components/documents/document-approval-form'
import DocumentProxy from '@/store/proxies/document-proxy'

export default {
  name: 'ExternalSignPage',
  components: {
    AppLoading,
    DocumentApprovalForm,
    SignatureModal
  },
  data () {
    return {
      loading: false,
      model: null,
      uuid_url: null
    }
  },
  mounted () {
    this.$bus.on('sign-document-success', this.onSignDocumentSuccess)
    this.uuid_url = this.$route.query.uuid_url
    this.loading = true
    new DocumentProxy({ uuid_url: this.uuid_url }).getByAnonymous().then((res) => {
      this.model = {
        ...res.document,
        send_email: res.send_email,
        signed_persons: res.signed_persons,
        signed_vendors: res.signed_vendors
      }
      this.loading = false
    })
  },
  beforeDestroy () {
    this.$bus.off('sign-document-success', this.onSignDocumentSuccess)
  },
  methods: {
    onSignDocumentSuccess () {
      this.$router.push({ name: 'external-view', params: { uuid_url: this.uuid_url } })
    },
    onClickSign () {
      this.$refs.form.submit()
    },
    onClickReject () {
      this.$refs.form.reject()
    }
  }
}
</script>
<style scoped>
.card {
  width: 100%;
}
.full-screen-container {
  padding: 3rem 4rem;
}
</style>
