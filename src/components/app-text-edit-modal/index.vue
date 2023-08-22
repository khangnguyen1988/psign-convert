<template>
  <app-modal :name="name"
             :title="title"
             :submit-on-enter="false"
             @before-open="beforeOpen"
             @opened="opened"
             @before-close="beforeClose"
             @on-ok="onOk">
    <form slot-scope="props">
      <b-form-textarea
        v-model="model"
        :placeholder="placeholder"
        :rows="3"
        :max-rows="6">
      </b-form-textarea>
    </form>
  </app-modal>
</template>

<script>
import AppModal from '@/components/app-modal/'

export default {
  name: 'AppTextEditModal',
  components: {
    AppModal
  },
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    name: {
      type: String,
      default: '',
      required: true
    },
    placeholder: {
      type: String,
      default () {
        return this.$t('client.comment')
      }
    }
  },
  data () {
    return {
      model: ''
    }
  },
  methods: {
    beforeOpen (params) {
      this.model = params.model
    },
    opened (appModalInstance) {
      appModalInstance.$el.querySelector('textarea').focus()
    },
    beforeClose (event) {
      if (event.params && event.params.isOk) {
        return
      }
      this.$emit('on-cancel', this.model)
    },
    onOk () {
      this.$emit('on-ok', this.model)
      this.$modal.hide(this.name, { isOk: true })
    }
  }
}
</script>
