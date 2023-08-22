<template>
  <app-modal name="document-review-modal" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose" hide-footer  width="90%">
    <template v-slot:top-buttons="props">
      <button @click="onClickUpload()" class="btn btn-primary btn-sm">
        <strong v-if="!uploadStatus.uploading">
          <i class="fal fa-upload pr-2"></i>
          {{ $t('document.addFile') }}</strong>
        <strong v-if="uploadStatus.uploading && uploadStatus.percentCompleted < 100">
          <i class="fal fa-spin">
            <i class="fal fa-circle-notch"></i>
          </i>
          {{ $t('app.uploading') }} ({{ uploadStatus.percentCompleted }}%)
        </strong>
        <strong v-if="uploadStatus.uploading && uploadStatus.percentCompleted === 100">
          <i class="fal fa-spin">
            <i class="fal fa-circle-notch"></i>
          </i>
          {{ $t('app.processing') }} ({{ uploadStatus.count }})
        </strong>
      </button>
      <button type="button" class="btn btn-sm btn-outline-primary"  @click="onClickAddNewComment()">
        <i class="fal fa-comment"></i> Thêm nhận xét
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary"  @click="onClickAddCheckListItem()">
        <i class="fal fa-tasks-alt"></i> Thêm đầu việc
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary"  @click="onClickExternalLink()">
        <i class="fal fa-external-link"></i> Liên kết ngoài
      </button>
    </template>

    <document-review ref="documentReview" v-if="modelLoaded" :document-model="documentModel"></document-review>
    <div style="display: none" id="file-input-container"></div>
  </app-modal>
</template>
<script>
import { mapState } from 'vuex'
import AppModal from '@/components/app-modal/index'
import DocumentReview from '@/portal-components/documents/review/document-review'
import DocumentProxy from '@/store/proxies/document-proxy'

export default {
  name: 'DocumentReviewModal',
  components: {
    AppModal,
    DocumentReview
  },
  data () {
    return {
      uploadStatus: {
        count: 0,
        uploading: false,
        percentCompleted: 0
      },
      modelLoaded: false,
      title: this.$t('document.reviewDocument'),
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
    onClickExternalLink () {
      window.open(`${window.location.origin}/#/external-review/${this.documentModel.id}/${this.documentModel.uuid_url}`, '_blank')
    },
    onClickUpload () {
      const inputContainer = document.querySelector('#file-input-container')
      const input = document.createElement('input')
      const type = document.createAttribute('type')
      type.value = 'file'
      const multiple = document.createAttribute('multiple')
      input.setAttributeNode(type)
      input.setAttributeNode(multiple)
      input.onchange = this.onSelectFiles
      inputContainer.appendChild(input)
      input.click()
    },
    onSelectFiles (event) {
      this.files = event.target.files
      if (this.files.length === 0) {
        return
      }
      const countInterval = setInterval(() => {
        this.uploadStatus.count++
      }, 1000)
      new DocumentProxy().uploadFileToDocument({ doc_files: [...this.files], document_id: this.documentModel.id }, this.uploadStatus).then((res) => {
        this.uploadStatus.uploading = false
        clearInterval(countInterval)
        this.uploadStatus.count = 0
        this.documentModel.files_id.push(res.files_id)
        this.$refs.documentReview.setLoading(true)
        this.$refs.documentReview.load(this.documentModel)
      }).catch(() => {
        this.uploadStatus = {
          count: 0,
          uploading: false,
          percentCompleted: 0
        }
        document.querySelector('#file-input-container').innerHTML = ''
      })
    },
    onClickAddNewComment () {
      this.$modal.show('document-comment-modal', { documentId: this.documentModel.id })
    },
    onClickAddCheckListItem () {
      this.$modal.show('document-checklist-modal', { documentId: this.documentModel.id })
    },
    beforeClose () {
    },
    beforeOpen (params) {
      const documentModel = params.model
      if (documentModel.id) {
        this.documentModel = documentModel
        this.modelLoaded = true
      }
    }
  }
}
</script>

<style scoped>

</style>
