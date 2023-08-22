<template>
  <app-loading :loading="loading" :loading-progress="loadingProgress" :render-child="true">
    <div class="row">
      <div class="col-lg-8">
        <div class="pdf-viewer-container" style="height: 78vh">
          <adobe-viewer v-if="currentDisplayFile && !loading" @save="onSave" :comment="currentFileComments" element-id="view-doc-page-pdf" :file-name="currentDisplayFile.name" :src="pdfDataSrc"></adobe-viewer>
        </div>
      </div>
      <div class="col-lg-4" style="max-height: 80vh;overflow-y: scroll;">
        <div v-if="reviewAgents.length > 0" class="row mb-3">
          <app-accordion :title="'Danh sách đại lý'" :items="reviewAgents" :selected-index="-1">
            <template v-slot:item-template="slotProps">
              <span>{{slotProps.item.company_id.name}}</span>
            </template>
          </app-accordion>
        </div>
        <div v-if="tasks.length > 0" class="row mb-3">
          <app-accordion :title="'Danh sách đầu việc'" :items="tasks" :selected-index="-1">
            <template v-slot:item-template="slotProps">
              <div class="file-item">
                <span><i :class="{'fa-clipboard-check': slotProps.item.mark === 'DONE' }" class="fal fa-clipboard mr-1"></i>{{slotProps.item.content}}</span>
                <div style="min-width: 4rem; text-align: right">
                  <i @click="onMarkTaskStatus($event, slotProps, slotProps.item.mark ==='DONE' ? 'IN_PROGRESS': 'DONE')" :class="{'fa green': slotProps.item.mark === 'DONE' }" class="mr-2 fal fa-check-circle"></i>
                  <i @click="onDeleteTask($event, slotProps)" class="fal fa-trash"></i>
                </div>
              </div>
            </template>
          </app-accordion>
        </div>
        <div class="row mb-3">
          <app-accordion :title="'Danh sách file'" :items="inMemorySignedFiles" :selected-index="currentDisplayFileIndex">
            <template v-slot:item-template="slotProps">
              <div @click="onChangeFile(slotProps)" class="file-item">
                <span :class="{'line-through': slotProps.item.status === 'DELETED' }"><i class="fal fa-file-pdf mr-1"></i>{{slotProps.item.file.name}}</span>
                <div style="min-width: 4rem; text-align: right">
                  <i v-if="slotProps.item.status !=='DELETED'" @click="onMarkFileStatus($event, slotProps, slotProps.item.status ==='DONE' ? 'IN_PROGRESS': 'DONE')" :class="{'fa green': slotProps.item.status === 'DONE' }" class="mr-2 fal fa-check-circle"></i>
                  <i v-if="slotProps.item.status !=='DELETED' && slotProps.item.status !=='DONE'" @click="onMarkFileStatus($event, slotProps, 'DELETED')" class="mr-2 fal fa-ban"></i>
                  <i @click="onDeleteFile($event, slotProps)" class="fal fa-trash"></i>
                </div>
              </div>
            </template>
          </app-accordion>
        </div>
        <div class="row mt-3 mb-3">
          <h6>Nhận xét chung</h6>
        </div>
        <div class="row">
          <div class="comment-container">
            <div class="comment-item" v-for="(item) in comments">
              <div class="avatar">
                <span :class="getColor(item.name)">{{get1stCharOfName(item.name)}}</span>
              </div>
              <div class="main">
                <strong class="name">{{item.name}}</strong>
                <div class="time">{{item.updated_at | formatDateTime}}</div>
                <div class="content">{{item.comment}}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </app-loading>
</template>

<script>
import AppForm from '@/components/app-form/index'
import AppModal from '@/components/app-modal/index'
import PdfViewer from '@/components/pdf-viewer/index'
import AppLoading from '@/components/app-loading/index'
import AppAccordion from '@/components/app-accordion/index'
import DocumentProxy from '@/store/proxies/document-proxy'
import AdobeViewer from '@/components/pdf-viewer/adobe-viewer'
import DocumentSigningStatus from '@/portal-components/documents/document-signing-status'
import { getColorClass, renderSignaturePlaceHolders } from '@/utils/document'

export default {
  name: 'DocumentReviewComponent',
  components: {
    AppForm,
    AdobeViewer,
    AppAccordion,
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
      tasks: [],
      currentDisplayFileIndex: 0,
      currentDisplayFile: null,
      currentFileId: null,
      pdfLoading: false,
      comments: [],
      fileComments: {},
      allowComment: true
    }
  },
  computed: {
    currentFileComments () {
      return this.fileComments[this.currentFileId]
    },
    reviewAgents () {
      return this.documentModel.signed_vendors.filter(v => v.type === 'REVIEW')
    }
  },
  mounted () {
    this.$bus.on('document-comment-success', this.loadComments)
    this.$bus.on('document-checklist-success', this.loadTasks)
    this.setLoading(true)
    const documentId = this.id || this.$route.params.id
    const uuid = this.uuid
    if (uuid) {
      new DocumentProxy({ uuid_url: this.uuid }).getDraftByAnonymous().then((res) => {
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
      new DocumentProxy({ id: documentId, limit: 1, page: 1 }).getDraftByPartner().then((res) => {
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
    this.loadTasks()
  },
  beforeDestroy () {
    this.$bus.off('document-comment-success', this.loadComments)
    this.$bus.off('document-checklist-success', this.loadTasks)
  },
  methods: {
    onSave ({ resolve, comments, metaData }) {
      const vm = this
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      new DocumentProxy().createComment({
        name: currentUser ? currentUser.name : this.uuid,
        comment: JSON.stringify(comments),
        document_id: this.documentModel.id,
        file_id: vm.currentFileId
      }).then(() => {
        resolve({
          /* eslint-disable no-undef */
          code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
          data: {
            metaData: Object.assign(metaData, {})
          }
        })
      })
    },
    onMarkTaskStatus ($event, { item }, status) {
      this.$modal.show('dialog', {
        title: this.$t(`document.markAs${status}`).replace('%s', 'công việc'),
        text: this.$t(`document.markAs${status}Text`).replace('%s', 'công việc'),
        okText: this.$t('app.confirm'),
        okClass: 'btn-primary',
        onOk: () => {
          new DocumentProxy().updateTask({
            document_id: this.documentModel.id,
            id: item.id,
            mark: status,
            content: item.content
          }).then(() => {
            const changedFile = this.tasks.find(f => f.id === item.id)
            if (changedFile) {
              changedFile.mark = status
            }
          })
        }
      })
    },
    onMarkFileStatus ($event, { item }, status) {
      this.$modal.show('dialog', {
        title: this.$t(`document.markAs${status}`).replace('%s', 'file'),
        text: this.$t(`document.markAs${status}Text`).replace('%s', 'file'),
        okText: this.$t('app.confirm'),
        okClass: 'btn-primary',
        onOk: () => {
          new DocumentProxy().markFile({ document_id: this.documentModel.id, files_id: [item.fileId], mark: status }).then(() => {
            const changedFile = this.inMemorySignedFiles.find(f => f.fileId === item.fileId)
            if (changedFile) {
              changedFile.status = status
            }
          })
        }
      })
    },
    onDeleteTask ($event, { item }) {
      $event.preventDefault()
      $event.stopPropagation()
      this.$modal.show('dialog', {
        title: this.$t('app.delete'),
        text: this.$t('document.deleteConfirm'),
        okText: this.$t('app.delete'),
        okClass: 'btn-danger',
        onOk: () => {
          new DocumentProxy().deleteTask({ document_id: this.documentModel.id, check_list_id: [item.id] }).then(() => {
            this.loadTasks()
          })
        }
      })
    },
    onDeleteFile ($event, { item }) {
      $event.preventDefault()
      $event.stopPropagation()
      this.$modal.show('dialog', {
        title: this.$t('app.delete'),
        text: this.$t('document.deleteConfirm'),
        okText: this.$t('app.delete'),
        okClass: 'btn-danger',
        onOk: () => {
          new DocumentProxy().removeFileFromDocument({ document_id: this.documentModel.id, files_id: [item.fileId] }).then(() => {
            this.load(this.documentModel)
          })
        }
      })
    },
    get1stCharOfName (name) {
      const arr = name.split(' ')
      if (arr.length > 0) {
        return arr[arr.length - 1].charAt(0).toUpperCase()
      }
      return 'NA'
    },
    getColor (text) {
      return getColorClass(text)
    },
    loadTasks () {
      new DocumentProxy({
        document_id: this.documentModel.id,
        limit: 100,
        page: 1,
        sort: 'updated_at',
        sort_direction: 'desc'
      }).getTasks().then(tasks => {
        this.tasks = tasks
      })
    },
    loadComments () {
      new DocumentProxy({
        document_id: this.documentModel.id,
        limit: 100,
        page: 1,
        sort: 'updated_at',
        sort_direction: 'desc'
      }).getComments().then(comments => {
        this.comments = comments.filter(c => !c.file_id)
        const fileComments = comments.filter(c => !!c.file_id)
        fileComments.forEach(c => {
          this.fileComments[c.file_id] = c.comment
        })
      })
    },

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
    onChangeFile ({ item, index }) {
      this.currentDisplayFile = item.file
      this.currentFileId = item.fileId
      this.currentDisplayFileIndex = index
      this.allowComment = item.status !== 'DONE'
      this.loadComments()
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
        this.loadComments()
        renderSignaturePlaceHolders(this.documentModel, (progress) => {
          this.loadingProgress = progress
        }).then((response) => {
          this.inMemorySignedFiles = response
          this.loadPdf(response[0].fileId)
          this.currentDisplayFile = response[0].file
          this.currentFileId = response[0].fileId
          this.setLoading(false)
        }, () => {
          this.setLoading(false)
        })
      }
    }
  }
}
</script>
<style lang="scss">
.comment-container {
  .comment-item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2rem;
    .time {
      font-size: .75rem;
      font-style: italic;
      color: var(--secondary-text-color);
    }
    .content {
      padding: .5rem 0;
    }
  }
  .avatar {
    width: 4rem;
    justify-content: flex-start;
    display: flex;
    padding-right: 1rem;
    span {
      width: 3rem;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid var(--divider-color);
      color: #fff;
      border-radius: 50%;
      font-size: 2rem;
    }
  }
}

.file-item {
  display: flex;
  justify-content: space-between;
}

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
.line-through {
  -webkit-text-decoration-line: line-through; /* Safari */
  text-decoration-line: line-through;
}
</style>
