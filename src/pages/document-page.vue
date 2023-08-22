<template>
  <document-table ref="table"
                  :title="title"
                  :status="status"
                  :tag="tag"
                  :api="api"
                  @on-click-row-item="onClickRowItem"
  >
    <template v-slot:buttons="slotProps">
      <div class="buttons">
        <button  @click="onClickRowItem(slotProps.rowItem)"  class="btn btn-sm btn-outline-secondary">
          {{$t('document.detail')}}
        </button>
      </div>
    </template>
  </document-table>
</template>

<script>
import DocumentTable from '@/portal-components/documents/table/document-table'

export default {
  name: 'DocumentPage',
  props: {
    title: {
      type: String,
      default: ''
    },
    api: {
      type: String,
      default: '/esign-api/api/document/get_by_partner'
    },
    status: {
      type: String,
      default: ''
    },
    tag: {
      type: [String, Number],
      default: ''
    }
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
