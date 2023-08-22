<template>
  <div class="document-list-container w-100 ">
    <div class="card">
      <div class="card-header">
        <h6>Danh sách đối tác</h6>
      </div>
      <div class="card-body">
        <app-table
          v-if="data"
          :api-mode="false"
          :data="data"
          :fields="fields"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppTable from '@/components/app-table/'

export default {
  name: 'DocumentList',
  data () {
    return {
      fields: [
        {
          name: 'id',
          sortField: 'id',
          title: 'STT'
        },
        {
          name: 'name',
          title: 'Nội dung văn bản'
        },
        {
          name: 'docNumber',
          title: 'Loại văn bản'
        },
        {
          name: 'createdBy',
          title: 'Người lập'
        },
        {
          name: 'signedBy',
          title: 'Người ký'
        },
        {
          name: 'signedBy',
          title: 'Trạng thái'
        }
      ],
      data: [
        {
          id: 1,
          name: 'Hợp đồng thiết bị ABC',
          docNumber: '001',
          createdBy: 'Linh Đan',
          signedBy: 'Dũng Chinh'
        },
        {
          id: 1,
          name: 'Hợp đồng thiết bị ABC',
          docNumber: '001',
          createdBy: 'Linh Đan',
          signedBy: 'Dũng Chinh'
        },
        {
          id: 1,
          name: 'Hợp đồng thiết bị ABC',
          docNumber: '001',
          createdBy: 'Linh Đan',
          signedBy: 'Dũng Chinh'
        },
        {
          id: 1,
          name: 'Hợp đồng thiết bị ABC',
          docNumber: '001',
          createdBy: 'Linh Đan',
          signedBy: 'Dũng Chinh'
        },
        {
          id: 1,
          name: 'Hợp đồng thiết bị ABC',
          docNumber: '001',
          createdBy: 'Linh Đan',
          signedBy: 'Dũng Chinh'
        },
        {
          id: 1,
          name: 'Hợp đồng thiết bị ABC',
          docNumber: '001',
          createdBy: 'Linh Đan',
          signedBy: 'Dũng Chinh'
        }
      ]
    }
  },
  beforeDestroy () {
    // this.$bus.off('update-invoice-success', this.onUpdateInvoiceSuccess);
  },
  created () {
    // this.$bus.on('update-invoice-success', this.onUpdateInvoiceSuccess);
  },

  mounted () {
  },
  computed: {
    ...mapState([
      'appNavbarDisplay'
    ])
  },
  methods: {
  },
  watch: {
  },
  components: {
    AppTable
  }
}
</script>
<style>
</style>
