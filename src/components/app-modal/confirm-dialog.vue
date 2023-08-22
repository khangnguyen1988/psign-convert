<template>
  <app-modal name="dialog" :title="params.title" width="450px" @before-open="beforeOpen" @before-close="beforeClose" :ok-text="params.okText" :ok-class="params.okClass" @on-ok="onOk" @on-cancel="onCancel" @on-close="onClose">
    <p>{{params.text}}</p>
  </app-modal>
</template>

<script>
import AppModal from '@/components/app-modal/'

export default {
  name: 'AppDialog',
  components: {
    AppModal
  },
  data () {
    return {
      params: {
        title: '',
        okText: '',
        text: ''
      }
    }
  },
  methods: {
    beforeOpen (params) {
      this.params = params
    },
    beforeClose (event) {
      if (!this.params.beforeClose) {
        return
      }
      this.params.beforeClose(event)
    },
    onOk (model) {
      if (this.params.onOk) {
        this.params.onOk(model)
      }
      this.$modal.hide('dialog', { isOk: true })
    },
    onCancel (model) {
      if (this.params.onCancel) {
        this.params.onCancel(model)
      }
    },
    onClose (model) {
      if (this.params.onHide) {
        this.params.onClose(model)
      }
    }
  }
}
</script>
