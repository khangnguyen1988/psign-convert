<template>
  <document-table ref="table"
                  :wait-for-sign="'SIGNED'"
                  :status="'SUBMIT,IN_PROGRESS,DONE'"
                  :api="'/esign-api/api/document/get_by_user'"
                  :title="$t('document.signed')"
                  @on-click-row-item="onClickRowItem"
  >
    <template v-slot:buttons="slotProps">
      <div class="buttons">
        <button @click="onClickRowItem(slotProps.rowItem)"  class="btn btn-sm btn-outline-secondary">
          {{$t('document.detail')}}
        </button>
      </div>
    </template>
  </document-table>
</template>

<script>
import DocumentTable from '@/portal-components/documents/table/document-table'

export default {
  name: 'SignedDocumentPage',
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
    }
  },
  watch: {
  },
  components: {
    DocumentTable
  }
}
</script>
