<template>
  <div class="document-list-container w-100 ">
    <div class="card">
      <div class="card-header">
        <h6>Văn bản đi</h6>
      </div>
      <div class="card-body">
        <app-table
          v-if="appendParams"
          ref="table"
          :append-params="appendParams"
          :data-transform="dataTransform"
          :api-url="apiUrl"
          :pagination="true"
          :fields="fields"
        >
          <div slot="creator" slot-scope="props">
            <span>
              {{props.rowData.user_id.name}} -  {{props.rowData.user_id.company.name}}
            </span>
          </div>
          <div slot="actions" slot-scope="props">
            <button  class="btn btn-secondary btn-sm pb-0 pt-0"
                     :title="$t('app.sign')"
                     @click="openApprovalModal(props.rowData)"
            >
              <i class="fas fa-signature"></i>
            </button>
          </div>
        </app-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AppTable from '@/components/app-table/'

const baseUrl = process.env.VUE_APP_API_URL

export default {
  name: 'DocumentList',
  props: {
    status: String
  },
  data () {
    return {
      currentUser: null,
      checkList: {},
      appendParams: null,
      dataTransform: src => ({
        data: src.data.map(item => ({
          ...item.document,
          signed_persons: item.signed_persons,
          signed_vendors: item.signed_vendors
        })),
        page_info: src.page_info
      }),
      fields: [
        {
          name: 'id',
          title: 'STT'
        },
        {
          name: 'name',
          title: 'Nội dung văn bản'
        },
        {
          name: 'description',
          title: 'Loại văn bản'
        },
        {
          name: '__slot:creator',
          title: 'Người lập'
        },
        {
          name: 'signedBy',
          title: 'Người ký'
        },
        {
          name: 'status',
          title: 'Trạng thái'
        },
        {
          name: '__slot:actions',
          titleClass: 'text-sm-right',
          dataClass: 'text-sm-right',
          title: ''
        }
      ],
      data: []
    }
  },
  beforeDestroy () {
    // this.$bus.off('update-invoice-success', this.onUpdateInvoiceSuccess);
    this.$bus.off('sign-document-success', this.reload)
    this.countDocument()
  },
  created () {
    // this.$bus.on('update-invoice-success', this.onUpdateInvoiceSuccess);
    this.$bus.on('sign-document-success', this.reload)
  },

  mounted () {
    const status = this.status || this.$route.params.status
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser) {
      this.appendParams = {
        user_id: currentUser.user_id,
        status_doc_array: status,
        user_filter_doc: 'ITSTURN'
      }
    }
  },
  computed: {
    apiUrl () {
      return `${baseUrl}/esign-api/api/document/get_by_user`
    },
    ...mapState([
      'appNavbarDisplay'
    ])
  },
  methods: {
    ...mapActions(['countDocument']),
    openApprovalModal (model) {
      this.$modal.show('document-approval-modal', { model })
    },
    reload () {
      this.$nextTick(() => {
        this.$refs.table.refresh()
      })
    }
  },
  components: {
    AppTable
  }
}
</script>
<style>
</style>
