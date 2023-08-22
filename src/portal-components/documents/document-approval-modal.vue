<template>
  <app-modal name="document-approval-modal" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose" hideFooter  width="80%">
    <template v-slot:top-buttons>
      <button type="button" style="background: #C2C2C2" class="btn btn-sm btn-secondary mr-2" @click="onClickReject()">{{$t('signature.refuse')}}</button>
      <button type="button" :class="{'disabled': formSubmitting }" class="btn btn-sm btn-primary"  @click="onOk()">
        <span v-if="!formSubmitting">
          {{$t('signature.accept')}}
        </span>
        <i v-if="formSubmitting" class="fal fa-spin">
          <i class="fal fa-circle-notch"></i>
        </i>
        <span v-if="formSubmitting">
          Đang xử lý
        </span>
      </button>
    </template>
    <document-approval-form
      ref="form"
      v-if="documentModel"
      :model="documentModel"
      @on-form-submitting="onFormSubmitting"
    ></document-approval-form>
  </app-modal>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppModal from '@/components/app-modal/'
import DocumentApprovalForm from './document-approval-form'

export default {
  name: 'DocumentApprovalModal',
  components: {
    AppModal,
    DocumentApprovalForm
  },
  data () {
    return {
      formSubmitting: false,
      title: this.$t('document.approveTitle'),
      documentModel: null
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  mounted () {
    this.$bus.on('sign-document-success', this.onSignDocumentSuccess)
  },
  beforeDestroy () {
    this.$bus.off('sign-document-success', this.onSignDocumentSuccess)
  },
  methods: {
    ...mapActions(['countDocument']),
    onOk () {
      if (!this.formSubmitting) {
        this.$refs.form.submit()
      }
    },
    onClickReject () {
      this.$refs.form.reject()
    },
    beforeClose () {
      this.formSubmitting = false
    },
    onSignDocumentSuccess (documentId) {
      this.countDocument()
      this.$router.push({ name: 'view-document', params: { id: documentId } })
    },
    beforeOpen (params) {
      this.documentModel = params.model
    },
    onFormSubmitting (val) {
      this.formSubmitting = val
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
