<template>
  <app-modal name="digital-certificate-detail-modal" :title="title" @before-open="beforeOpen" @before-close="beforeClose"  @on-ok="onOk">
    <app-form
      v-if="schema"
      ref="form"
      @on-submit="onSubmit"
      :schema="schema"
      :data="formModel"
      @on-input="onFormFieldChanged"
    />
  </app-modal>
</template>

<script>
import { mapState } from 'vuex'
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import CaSignProxy from '@/store/proxies/ca-sign-proxy'

const formSchema = context => ({
  ca_type: {
    label: 'Loại chứng thư số',
    placeholder: 'Chọn loại chứng thư số',
    type: 'select',
    options: [
      { value: 'DEVICE_TOKEN', text: 'Usb token' },
      { value: 'HSM', text: 'Hsm' },
      { value: 'HSM_CLOUD', text: 'Hsm Cloud' }
    ],
    validation: 'required'
  },
  cert_file: {
    label: 'Đính kèm chứng thư',
    placeholder: 'Chọn file chứng thư',
    type: 'input',
    inputType: 'file',
    validation: 'required',
    display: context.caType !== 'HSM_CLOUD'
  },
  seri_number: {
    label: 'Số seri',
    placeholder: 'Nhập số seri',
    type: 'input',
    validation: 'required',
    display: context.caType === 'HSM_CLOUD'
  },
  password: {
    label: context.$t('user.password'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.password')}`,
    type: 'input',
    inputType: 'password',
    validation: 'required',
    display: context.caType !== 'DEVICE_TOKEN'
  },
  effective_date: {
    label: 'Ngày hiệu lực',
    placeholder: 'Nhập ngày hiệu lực',
    type: 'datepicker',
    validation: 'required',
    display: context.caType === 'HSM_CLOUD'
  },
  exprired_date: {
    label: 'Ngày hết hạn',
    placeholder: 'Nhập ngày hết hạn',
    type: 'datepicker',
    validation: 'required',
    display: context.caType === 'HSM_CLOUD'
  },
  issuer_type: {
    label: 'Nhà cung câp',
    placeholder: 'Chọn nhà cung cấp',
    type: 'select',
    options: [
      { value: 'VIETTEL', text: 'Viettel' },
      { value: 'VNPT', text: 'Vnpt' },
      { value: 'FPT', text: 'Fpt' },
      { value: 'LCS_CA', text: 'Lcs Ca' },
      { value: 'EASY_CA', text: 'Easy Ca' },
      { value: 'BKAV', text: 'Bkav' }
    ],
    validation: 'required',
    display: context.caType === 'HSM_CLOUD'
  }
})

export default {
  name: 'DigitalCertificateListModal',
  components: {
    AppModal,
    AppForm
  },
  data () {
    return {
      formErrors: '',
      caType: 'DEVICE_TOKEN',
      formModel: {
        ca_type: 'DEVICE_TOKEN',
        cert_file: null,
        seri_number: null,
        password: null,
        effective_date: null,
        exprired_date: null,
        issuer_type: null
      },
      schema: null,
      title: 'Thêm chứng thư số'
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  methods: {
    onOk () {
      this.$refs.form.submit()
    },
    onSubmit (formModel) {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.formErrors = ''
          new CaSignProxy().createSign(formModel, {
            uploading: false,
            percentCompleted: 0
          }).then((res) => {
            this.$modal.hide('digital-certificate-detail-modal', { isOk: true })
            this.$emit('on-ok', res)
          }).catch((e) => {
            this.formErrors = e.detail
          })
        }
      })
    },
    beforeOpen () {
      this.schema = formSchema(this)
    },
    beforeClose () {
      this.formModel = {
        ca_type: null,
        cert_file: null,
        seri_number: null,
        password: null,
        effective_date: null,
        exprired_date: null,
        issuer_type: null
      }
      this.schema = formSchema(this)
    },

    onFormFieldChanged ($event, field) {
      if (field.name === 'ca_type') {
        this.caType = field.value
        this.schema = formSchema(this)
      }
    }
  }
}
</script>
