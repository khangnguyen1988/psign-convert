<template>
  <app-modal name="tag-modal" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose"  width="30%" @on-ok="onOk">
    <app-form
      ref="form"
      @on-submit="onSubmit"
      :schema="schema"
      :data="formModel"
    />
  </app-modal>
</template>

<script>
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import { mapActions } from 'vuex'

export default {
  name: 'TagModal',
  components: {
    AppForm,
    AppModal
  },
  data () {
    return {
      title: 'Tạo nhãn',
      schema: [
        {
          name: 'name',
          label: 'tag.name',
          placeholder: 'tag.enterTagName',
          type: 'input',
          validation: 'required'
        }
      ],
      formModel: {
        name: ''
      }
    }
  },
  methods: {
    ...mapActions(['createTag', 'updateTag']),
    onSubmit (formModel) {
      const vm = this
      const action = this.formModel.id ? this.updateTag : this.createTag
      action({
        id: this.formModel.id,
        name: formModel.name
      }).then(() => {
        vm.$bus.emit('close-tag-modal')
        vm.$modal.hide('tag-modal', { isOk: true })
      })
    },
    onOk () {
      this.$refs.form.submit()
    },

    beforeClose () {
      this.formModel = {
        name: null
      }
    },
    beforeOpen (params) {
      this.title = params.model.id ? this.$t('tag.editTag') : this.$t('tag.createTag')
      if (params.model.id) {
        this.formModel = {
          id: params.model.id,
          name: params.model.name
        }
      }
    }
  }
}
</script>
