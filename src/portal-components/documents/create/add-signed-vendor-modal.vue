<template>
  <app-modal name="add-signed-vendor-modal"  :esc-to-close="false" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose"  width="30%" @on-ok="onOk" @opened="opened">
    <app-form
      v-if="schema"
      ref="form"
      :schema="schema"
      :data="formModel"
    />
    <div class="text-right mb-4">
      <a @click="addVendor" class="link-add-person" href="javascript:"><span>{{$t('document.addVendorSignature')}}</span><i class="fal fa-plus-circle"></i></a>
    </div>
    <div class="person-row" v-for="(vendor, index) in vendors" :key="vendor.id">
      <person-icon :name="vendor.name"></person-icon>
      <span> {{index + 1}}. {{vendor.name}} - {{$t(`document.${vendor.type === 'ALL' ? 'signAndReview' : vendor.type.toLowerCase()}`)}}</span>
      <button @click="removeVendor(vendor.id)" class="ml-auto btn btn-sm btn-outline-secondary btn-outline-trash">
        <i class="fal fa-trash-alt"></i>
      </button>
    </div>

    <div class="text-center my-5"></div>
    <app-form
      v-if="schema"
      ref="formEmail"
      :schema="schemaEmailForm"
      :data="formEmailModal"
    />
    <div class="text-right mb-4">
      <a @click="addEmail()" class="link-add-person" href="javascript:"><span>{{$t('document.addEmailSignature')}}</span><i class="fal fa-plus-circle"></i></a>
    </div>
    <div class="person-row" v-for="(e, index) in emails" :key="e">
      <person-icon :name="e"></person-icon>
      <span> {{index + 1}}. {{e}}</span>
      <button @click="removeEmail(e)" class="ml-auto btn btn-sm btn-outline-secondary btn-outline-trash">
        <i class="fal fa-trash-alt"></i>
      </button>
    </div>
  </app-modal>
</template>
<script>
import AppModal from '@/components/app-modal/index'
import AppForm from '@/components/app-form/index'
import UserProxy from '@/store/proxies/user-proxy'
import PersonIcon from '@/portal-components/icons/person-icon'

const formSchema = context => ({
  vendor: {
    label: context.$t('tag.member'),
    placeholder: `${context.$t('app.enter')} ${context.$t('tag.member')}`,
    type: 'autocomplete',
    fetchSuggestions (searchText) {
      return new UserProxy().searchCompanyInfo(searchText)
    },
    renderItemText: item => item.full_name,
    validation: 'required'
  },
  type: {
    label: '',
    placeholder: '',
    type: 'select',
    options: [
      { value: 'SIGN', text: `${context.$t('document.sign')}` },
      { value: 'REVIEW', text: `${context.$t('document.review')}` },
      { value: 'ALL', text: `${context.$t('document.signAndReview')}` }
    ],
    validation: 'required'
  }
})

const formEmailSchema = context => ({
  email: {
    // label: context.$t('user.email'),
    label: `${context.$t('document.signByEmailNotification')}`,
    placeholder: `${context.$t('app.enter')} ${context.$t('user.email')}`,
    type: 'input',
    validation: 'email'
  }
})

export default {
  name: 'AddSignedVendorModal',
  components: {
    AppForm,
    AppModal,
    PersonIcon
  },
  data () {
    return {
      title: this.$t('document.addVendorSignature'),
      schema: null,
      schemaEmailForm: null,
      formModel: {},
      formEmailModal: {},
      vendors: [],
      emails: []

    }
  },
  computed: {
  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {
    addEmail () {
      this.$refs.formEmail.validate().then((isValid) => {
        const email = this.$refs.formEmail.getFieldValue('email')
        if (isValid && email) {
          this.emails.push(email)
          this.$refs.formEmail.setFieldValue('email', null)
          this.$refs.form.getField('vendor').$el.querySelector('input').disabled = true
        }
      })
    },
    removeVendor (id) {
      this.vendors = this.vendors.filter(v => v.id !== id)
      if (this.vendors.length === 0) {
        this.$refs.formEmail.getField('email').$el.querySelector('input').disabled = false
      }
    },
    removeEmail (email) {
      this.emails = this.emails.filter(e => e !== email)
      if (this.emails.length === 0) {
        this.$refs.form.getField('vendor').$el.querySelector('input').disabled = false
      }
    },
    addVendor () {
      this.$refs.form.validate().then((isValid) => {
        const selectedVendor = this.$refs.form.getFieldValue('vendor')
        if (isValid && selectedVendor) {
          const isExisted = this.vendors.findIndex(v => v.id === selectedVendor.id) > -1
          if (!isExisted) {
            selectedVendor.type = this.$refs.form.getFieldValue('type')
            this.vendors.push(selectedVendor)
            const vendorFieldVm = this.$refs.form.getField('vendor')
            vendorFieldVm.clear()
            this.$refs.formEmail.getField('email').$el.querySelector('input').disabled = true
          }
        }
      })
    },
    onOk () {
      this.$modal.hide('add-signed-vendor-modal', { isOk: true })
      this.$bus.emit('add-signed-vendor', { vendors: this.vendors, emails: this.emails })
    },
    beforeClose () {
      this.formModel = {
        type: 'SIGN'
      }
      this.formEmailModal = {}
    },
    beforeOpen (params) {
      this.formModel = {
        type: 'SIGN'
      }
      this.vendors = []
      this.emails = []

      if (params.vendors.length > 0) {
        this.vendors = params.vendors
      }
      if (params.emails.length > 0) {
        this.emails = params.emails
      }

      this.schema = formSchema(this)
      this.schemaEmailForm = formEmailSchema(this)
    },
    opened () {
      if (this.vendors.length > 0) {
        this.$refs.formEmail.getField('email').$el.querySelector('input').disabled = true
      }
      if (this.emails.length > 0) {
        this.$refs.form.getField('vendor').$el.querySelector('input').disabled = true
      }
      // this.$emit('opened', this);
    }
  }
}
</script>
