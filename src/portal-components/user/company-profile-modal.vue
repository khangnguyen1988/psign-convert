<template>
  <app-modal name="company-profile-modal" :title="title" @before-open="beforeOpen"  @on-ok="onOk">
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
import { mapActions } from 'vuex'
import AppForm from '@/components/app-form/'

export default {
  name: 'CompanyProfileModal',
  components: {
    AppModal,
    AppForm
  },
  data () {
    return {
      title: this.$t('user.updateUserInfo'),
      formModel: {
        name: null,
        full_name: null,
        tax_code: null,
        company_address: null
      },
      schema: [
        {
          name: 'name',
          label: this.$t('user.name'),
          placeholder: `${this.$t('app.enter')} ${this.$t('user.name')}`,
          type: 'input',
          validation: 'required'
        },
        {
          name: 'full_name',
          label: this.$t('user.companyFullName'),
          placeholder: `${this.$t('app.enter')} ${this.$t('user.companyFullName')}`,
          type: 'input',
          validation: 'required'
        },
        {
          name: 'tax_code',
          label: this.$t('user.taxCode'),
          placeholder: `${this.$t('app.enter')} ${this.$t('user.taxCode')}`,
          inputType: 'number',
          type: 'input',
          readonly: true,
          validation: 'required'
        },
        {
          name: 'company_address',
          label: this.$t('user.companyAddress'),
          placeholder: `${this.$t('app.enter')} ${this.$t('user.companyAddress')}`,
          type: 'input',
          validation: 'required'
        }
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['updateCompanyInfo']),
    onSubmit (formModel) {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          if (!formModel.name) {
            formModel.name = formModel.full_name
          }
          this.updateCompanyInfo(formModel)
          this.$modal.hide('company-profile-modal', { isOk: true })
        }
      })
    },
    onOk () {
      this.$refs.form.submit()
    },
    beforeOpen () {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      this.formModel = {
        ...currentUser.company
      }
    }
  }
}
</script>
