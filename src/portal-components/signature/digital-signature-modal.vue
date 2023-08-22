<template>
  <app-modal name="digital-signature-modal" :esc-to-close="false" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose"  width="30%" @on-ok="onOk">
    <app-loading :loading="loading">
      <app-form
        v-if="schema"
        ref="form"
        @on-submit="onSubmit"
        :schema="schema"
        :data="formModel"
      />
    </app-loading>
  </app-modal>
</template>
<script>
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import AppLoading from '@/components/app-loading/'
import CaSignProxy from '@/store/proxies/ca-sign-proxy'

const formSchema = context => ({
  cert_file: {
    label: context.$t('user.digitalSignatureFile'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.digitalSignatureFile')}`,
    type: 'input',
    inputType: 'file',
    asyncValidation: (value, resolve) => {
      if (!value) {
        resolve({ msg: 'File là bắt buộc' })
        return
      }
      resolve(true)
    }
  }
})

export default {
  name: 'DigitalSignatureModal',
  components: {
    AppForm,
    AppModal,
    AppLoading
  },
  data () {
    return {
      title: this.$t('user.signatureDigital'),
      loading: false,
      signatureModel: null,
      schema: null,
      formModel: {
        password: null,
        ca_type: 'DEVICE_TOKEN',
        cert_file: null
      }
    }
  },
  computed: {
  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {
    onSubmit (formModel) {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          new CaSignProxy().createSign({
            password: '123456789',
            ca_type: 'DEVICE_TOKEN',
            cert_file: formModel.cert_file
          }, {
            uploading: false,
            percentCompleted: 0
          }).then(() => {
            this.$modal.hide('digital-signature-modal', { isOk: true })
            this.$bus.emit('close-digital-signature-modal', this.signatureModel)
          })
        }
      })
    },
    onOk () {
      this.$refs.form.submit()
    },
    beforeClose () {
      this.formModel = {
        password: null,
        ca_type: 'DEVICE_TOKEN',
        cert_file: null
      }
    },
    beforeOpen () {
      this.schema = formSchema(this)
    }
  }
}
</script>
