<template>
  <div class="full-screen-container d-flex justify-content-center">
    <div class="card">
      <div class="card-body">
          <div class="row">
            <div class="col-12 text-right mb-3">
              <button type="button" class="btn btn-sm btn-outline-primary"  @click="onClickAddNewComment()">
                <i class="fal fa-comment"></i> Thêm bình luận
              </button>
            </div>
          </div>
        <document-review ref="documentReview" v-if="modelLoaded" :document-model="documentModel"></document-review>
      </div>
    </div>
    <document-comment-modal></document-comment-modal>
  </div>
</template>

<script>
import DocumentReview from '@/portal-components/documents/review/document-review'
import DocumentCommentModal from '@/portal-components/documents/review/document-comment-modal'
import AppLoading from '@/components/app-loading/index'
import DocumentProxy from '@/store/proxies/document-proxy'

export default {
  name: 'ExternalReviewPage',
  components: {
    AppLoading,
    DocumentCommentModal,
    DocumentReview
  },
  props: {
    uuid_url: String,
    documentId: String
  },
  data () {
    return {
      documentModel: null,
      modelLoaded: false
    }
  },
  mounted () {
    new DocumentProxy({ uuid_url: this.uuid_url }).getDraftByAnonymous().then(res => {
      this.documentModel = {
        ...res.document,
        signed_persons: res.signed_persons,
        signed_vendors: res.signed_vendors,
        externalSignUuid: this.uuid_url
      }
      this.modelLoaded = true
    })
  },
  beforeDestroy () {
  },
  methods: {
    onClickAddNewComment () {
      this.$modal.show('document-comment-modal', { documentId: this.documentId })
    }
  }
}
</script>
<style scoped>
.card {
  width: 100%;
}
.full-screen-container {
  padding: 1rem 4rem 2rem 4rem;
}
</style>
