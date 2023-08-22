<template>
  <app-loading :loading="loading" :loading-progress="loadingProgress" :render-child="true">
    <div class="row">
      <div class="col-lg-8">
        <div class="pdf-viewer-container" style="height: 78vh">
          <adobe-viewer v-if="currentDisplayFile && !loading" element-id="view-doc-page-pdf" :file-name="currentDisplayFile.name" :src="pdfDataSrc"></adobe-viewer>
        </div>
      </div>
      <div class="col-lg-4" style="max-height: 80vh;overflow-y: scroll;">
        <div class="row">
          <div class="col-12">
            <ul class="selected-files" v-if="inMemorySignedFiles && inMemorySignedFiles.length > 1">
              <li @click="onChangeFile(signedFile, index)" v-for="(signedFile, index) in inMemorySignedFiles"
                  :class="{'active': currentDisplayFileIndex === index}"
              >
                {{signedFile.file.name}}
              </li>
            </ul>
          </div>
        </div>

        <document-signing-status v-if="documentModel" :document-model="documentModel"></document-signing-status>
      </div>
    </div>
  </app-loading>
</template>

<script>
import AppModal from '@/components/app-modal/index'
import PdfViewer from '@/components/pdf-viewer/index'
import AppLoading from '@/components/app-loading/index'
import DocumentProxy from '@/store/proxies/document-proxy'
import AdobeViewer from '@/components/pdf-viewer/adobe-viewer'
import DocumentSigningStatus from '@/portal-components/documents/document-signing-status'
import { renderSignaturePlaceHolders } from '@/utils/document'

export default {
  name: 'ViewDocumentComponent',
  components: {
    AdobeViewer,
    AppModal,
    PdfViewer,
    AppLoading,
    DocumentSigningStatus
  },
  props: {
    id: String,
    uuid: String,
    documentModel: Object
  },
  data () {
    return {
      loading: false,
      title: '',
      loadingProgress: null,
      pdfData: null,
      pdfDataSrc: null,
      inMemorySignedFiles: [],
      currentDisplayFileIndex: 0,
      currentDisplayFile: null,
      currentFileId: null,
      pdfLoading: false
    }
  },
  computed: {
  },
  mounted () {
    this.setLoading(true)
    const documentId = this.id || this.$route.params.id
    const uuid = this.uuid || this.$route.params.uuid_url
    if (uuid) {
      new DocumentProxy({ uuid_url: this.uuid }).getByAnonymous().then((res) => {
        this.load({
          ...res.document,
          signed_vendors: res.signed_vendors,
          signed_persons: res.signed_persons,
          externalSignUuid: uuid
        })
      })
      return
    }
    if (documentId) {
      new DocumentProxy({ id: documentId, limit: 1, page: 1 }).getByPartner().then((res) => {
        this.load({
          ...res[0].document,
          signed_vendors: res[0].signed_vendors,
          signed_persons: res[0].signed_persons
        })
      })
      return
    }
    if (this.documentModel) {
      this.load(this.documentModel)
    }
  },
  beforeDestroy () {
  },
  methods: {
    setLoading (value) {
      if (value) {
        this.loading = true
      } else {
        setTimeout(() => {
          this.$nextTick(() => {
            this.loading = false
            this.loadingProgress = null
          })
        }, 100)
      }
    },
    onChangeFile ({ file, fileId }, index) {
      this.currentDisplayFile = file
      this.currentFileId = fileId
      this.currentDisplayFileIndex = index
      this.loadPdf(this.currentFileId)
    },
    loadPdf (fileId) {
      const vm = this
      const signedFile = this.inMemorySignedFiles.filter(r => r.fileId === fileId)
      if (signedFile.length > 0) {
        vm.pdfData = signedFile[0].bytes
        vm.pdfLoading = false
        vm.pdfDataSrc = URL.createObjectURL(new Blob([vm.pdfData], {
          type: 'application/pdf'
        }))
      }
    },
    load (model) {
      if (model.id) {
        this.pdfLoading = true
        this.documentModel = model
        renderSignaturePlaceHolders(this.documentModel, (progress) => {
          this.loadingProgress = progress
        }).then((response) => {
          this.inMemorySignedFiles = response
          this.loadPdf(response[0].fileId)
          this.currentDisplayFile = response[0].file
          this.setLoading(false)
        }, () => {
          this.setLoading(false)
        })
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
</style>
