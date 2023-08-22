<template>
  <div class="document-list-container w-100 ">
    <div class="card">
      <div class="card-header">
        <h6>Quản lý chữ ký</h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <button class="btn btn-primary" @click="onClickCreate">
              <i class="fal fa-plus"></i>
              Tạo mới chữ ký
            </button>
          </div>
        </div>
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
    // const vm = this;
  },
  computed: {
    ...mapState([
      'appNavbarDisplay'
    ])
  },
  methods: {
    onClickCreate () {
      this.$modal.show('signature-modal', { model: {} })
    }
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
