<template>
  <div class="w-100">
    <div class="table-header-toolbox table-header-have-tabs">
      <h6 class="mr-4">{{$t('document.inbox')}}</h6>
      <a :class="{'active': activeTab === 'wait-for-sign'}" @click="onClickTab('wait-for-sign')" href="javascript:" class="document-status-tab">{{$t('document.documentWaitingForSigning')}} ({{documentCount.total_itsturn}})</a>
      <a :class="{'active': activeTab === 'assign-person'}" @click="onClickTab('assign-person')" href="javascript:" class="document-status-tab">{{$t('document.documentWaitingForAssigning')}}  ({{documentCount.total_not_added_persons}})</a>
      <a :class="{'active': activeTab === 'partner-documents-review'}" @click="onClickTab('partner-documents-review')" href="javascript:" class="document-status-tab">{{$t('document.documentWaitingForReview')}}   ({{documentCount.total_review}})</a>
      <a :class="{'active': activeTab === 'partner-documents'}" @click="onClickTab('partner-documents')" href="javascript:" class="document-status-tab">{{$t('document.partnerDocument')}} </a>
    </div>
    <div v-if="activeTab === 'wait-for-sign'">
      <document-table
                      ref="table"
                      :status="'SUBMIT,IN_PROGRESS'"
                      :wait-for-sign="'ITSTURN'"
                      :api="'/esign-api/api/document/get_by_user'"
                      @on-click-row-item="openApprovalModal"
      >
        <template v-slot:buttons="slotProps">
          <div class="buttons">
            <button @click="openApprovalModal(slotProps.rowItem)"  class="btn btn-sm btn-primary">{{$t('document.confirmToSign')}}</button>
          </div>
        </template>
      </document-table>
    </div>
    <div v-if="activeTab === 'assign-person'">
      <document-table
                      ref="assignPersonTable"
                      :status="'SUBMIT,IN_PROGRESS'"
                      :added-persons="'NO'"

      >
        <template v-slot:buttons="slotProps">
          <div class="buttons">
            <button @click="onAssignClick(slotProps.rowItem)"  class="btn btn-sm btn-primary">{{$t('document.assignPerson')}}</button>
          </div>
        </template>
      </document-table>
    </div>
    <div v-if="activeTab === 'partner-documents-review'">
      <document-table
        ref="partnerDocumentReviewTable"
        :api="'/esign-api/api/document/get_draft_by_partner'"
        :status="'NEW'"
        @on-click-row-item="onReviewClick"
      >
        <template v-slot:buttons="slotProps">
          <div class="buttons">
            <button @click="onReviewClick(slotProps.rowItem)"  class="btn btn-sm btn-primary">{{$t('document.review')}}</button>
          </div>
        </template>
      </document-table>
    </div>
    <div v-if="activeTab === 'partner-documents'">
      <document-table
        ref="partnerDocumentTable"
        :status="'SUBMIT,IN_PROGRESS,DONE'"
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
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DocumentTable from '@/portal-components/documents/table/document-table'
import { FORM_MODE } from '@/app-constant'

export default {
  name: 'IncomingDocumentPage',
  data () {
    return {
      activeTab: ''
    }
  },
  beforeDestroy () {
    this.$bus.off('document-upload-success', this.reload)
  },
  created () {
    this.$bus.on('document-upload-success', this.reload)
  },
  mounted () {
    this.activeTab = this.$route.params.tab || 'wait-for-sign'
  },
  computed: mapState(['documentCount']),
  methods: {
    ...mapActions(['countDocument']),
    onAssignClick (rowData) {
      this.$modal.show('document-upload-modal', { model: rowData, mode: FORM_MODE.ASSIGN_SIGNED_PERSONS })
    },
    openApprovalModal (model) {
      this.$modal.show('document-approval-modal', { model })
    },
    reload () {
      this.$nextTick(() => {
        if (this.activeTab === 'wait-for-sign') {
          this.$refs.table.reload()
        }
        if (this.activeTab === 'assign-person') {
          this.$refs.assignPersonTable.reload()
        }
        if (this.activeTab === 'partner-documents') {
          this.$refs.partnerDocumentTable.reload()
        }
        this.countDocument()
      })
    },
    onClickRowItem (model) {
      this.$modal.show('view-document-modal', { model })
    },
    onReviewClick (model) {
      this.$modal.show('document-review-modal', { model })
    },
    onClickTab (tabName) {
      this.$router.push({ name: 'incoming-documents', params: { tab: tabName } }).catch(() => {})
    }
  },
  watch: {
    $route () {
      this.activeTab = this.$route.params.tab
    }
  },
  components: {
    DocumentTable
  }
}
</script>
<style lang="scss">
.document-status-tab {
  font-size: 16px;
  padding: .25rem;
  margin: .125rem 1.5rem;
  color: #003A8C;
  &:hover, &.active {
    text-decoration: none;
    border-bottom: 1px solid #003A8C;
  }
}
.table-header-have-tabs {
  @media screen and (max-width: 576px) {
    h6 {
      width: 90%;
    }
    flex-direction: column;
    height: auto !important;
    margin-bottom: 2rem;
  }
}

</style>
