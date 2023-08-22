<template>
  <app-modal name="document-checklist-modal" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose"  width="30%" @on-ok="onOk">
    <app-form
      v-if="schema"
      ref="form"
      @on-submit="onSubmit"
      :schema="schema"
      :data="formModel"
    />
  </app-modal>
</template>
<script>
import { mapState } from 'vuex'
import AppModal from '@/components/app-modal/index'
import DocumentProxy from '@/store/proxies/document-proxy'
import AppForm from '@/components/app-form/index'

const formSchema = context => ({
  content: {
    label: context.$t('document.task'),
    placeholder: `${context.$t('app.enter')} ${context.$t('document.task')}`,
    type: 'textarea',
    rows: '3',
    validation: 'required'
  },
  due_date: {
    label: 'Ngày',
    placeholder: 'Nhập ngày',
    type: 'datepicker'
  }
})

export default {
  name: 'DocumentChecklistModal',
  components: {
    AppForm,
    AppModal
  },
  data () {
    return {
      schema: null,
      formModel: {},
      modelLoaded: false,
      title: this.$t('document.task'),
      documentId: null
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {
    beforeClose () {
      this.formModel = {}
    },
    beforeOpen (params) {
      this.documentId = params.documentId
      this.schema = formSchema(this)
    },
    onSubmit (formData) {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          new DocumentProxy().createTask({
            content: formData.content,
            document_id: parseInt(this.documentId, 0),
            mark: 'IN_PROGRESS'
          }).then((response) => {
            this.$refs.form.reset()
            this.$modal.hide('document-checklist-modal', { isOk: true })
            this.$bus.emit('document-checklist-success', response)
          })
        }
      })
    },
    onOk () {
      this.$refs.form.submit()
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
.pdf-viewer-container {
  height: 85vh;
}

</style>
