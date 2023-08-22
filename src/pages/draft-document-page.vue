<template>
  <document-table ref="table"
                  :api="'/esign-api/api/document/get'"
                  :status="'NEW'"
                  :title="$t('document.draft') "
                  @on-click-row-item="onClickEdit"
  >
    <template v-slot:buttons="slotProps">
      <div class="buttons">
        <button @click="onClickSend(slotProps.rowItem)"  class="btn btn-sm btn-primary">{{$t('document.sentToSign')}}</button>
        <button @click="onClickReview(slotProps.rowItem)"  class="btn btn-sm btn-secondary">{{$t('document.review')}}</button>
        <button @click="onClickEdit(slotProps.rowItem)"  class="btn btn-sm btn-outline-secondary">
          {{$t('document.edit')}}
        </button>
        <button @click="onClickDelete(slotProps.rowItem)" class="btn btn-sm btn-outline-danger">{{$t('document.delete')}}</button>
      </div>
    </template>
  </document-table>
</template>

<script>
import DocumentTable from '@/portal-components/documents/table/document-table'
import DocumentProxy from '@/store/proxies/document-proxy'
import { FORM_MODE } from '@/app-constant'

export default {
  name: 'DraftDocumentPage',
  props: {
    status: String
  },
  data () {
    return {}
  },
  beforeDestroy () {
  },
  created () {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    reload () {
      this.$refs.table.reload()
    },
    onClickRowItem (model) {
      this.$modal.show('view-document-modal', { model })
    },
    onClickDelete (model) {
      this.$modal.show('dialog', {
        title: 'Xoá văn bản',
        text: 'Bạn có chắc chắn muốn xoá văn bản?',
        onOk: () => {
          new DocumentProxy().deleteDocument(model.id).then(() => {
            this.reload()
          })
        }
      })
    },
    onClickSend (model) {
      this.$modal.show('dialog', {
        title: 'Trình ký văn bản',
        text: 'Văn bản đã sẵn sàng trình ký? Lưu ý sau khi trình ký thì nội dung văn bản sẽ không thể thay đổi.',
        onOk: () => {
          new DocumentProxy().updateDocument({
            document: {
              id: model.id,
              name: model.name,
              description: model.description,
              type: model.type,
              status: 'SUBMIT'
            }
          }).then(() => {
            this.reload()
          })
        }
      })
    },
    onClickEdit (model) {
      this.$modal.show('document-upload-modal', { model, mode: FORM_MODE.EDIT_DOC })
    },
    onClickReview (model) {
      this.$modal.show('document-review-modal', { model })
    }
  },
  watch: {
  },
  components: {
    DocumentTable
  }
}
</script>
