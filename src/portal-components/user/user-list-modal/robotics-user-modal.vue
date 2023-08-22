<template>
  <app-modal name="robotics-user-modal" :title="title" @before-open="beforeOpen"  @before-close="beforeClose" @on-ok="onOk" :max-height-modal-body="80">
    <b-alert :show="!!formErrors" variant="danger">
      <ul>
        <li> {{formErrors}}</li>
      </ul>
    </b-alert>
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
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import { mapActions } from 'vuex'
import EsignUserProxy from '@/store/proxies/e-sign-user-proxy'

const formSchema = context => ({
  name: {
    label: context.$t('user.name'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.name')}`,
    type: 'input',
    validation: 'required'
  },
  phone: {
    label: context.$t('user.phone'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.phone')}`,
    type: 'input',
    validation: 'required'
  },
  user_name: {
    label: context.$t('user.username'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.username')}`,
    type: 'input',
    validation: 'required'
  },
  email: {
    label: context.$t('user.email'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.email')}`,
    type: 'input',
    validation: 'required|email'
  },
  password: {
    label: context.$t('user.password'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.password')}`,
    type: 'input',
    inputType: 'password',
    validation: 'required'
  },
  role: {
    label: context.$t('user.role'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.role')}`,
    type: 'select',
    readonly: !context.allowUpdateRole,
    options: [
      { value: 'ESIGN_ROLE_ADMIN', text: 'Quản trị viên' },
      { value: 'ESIGN_ROLE_GENERAL', text: 'Nhân viên' }
    ]
  },
  description: {
    label: context.$t('user.description'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.description')}`,
    type: 'input'
  }
})

export default {
  name: 'RoboticsUserModal',
  components: {
    AppModal,
    AppForm
  },
  data () {
    return {
      title: 'Create E-Sign User',
      formErrors: '',
      formModel: {
        name: null,
        phone: null,
        password: null,
        user_name: null,
        email: null,
        role: 'ESIGN_ROLE_GENERAL',
        description: ''
      },
      allowUpdateRole: true,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      schema: null
    }
  },
  computed: {},
  methods: {
    ...mapActions('auth', ['updateUserProfile']),
    onSubmit (formModel) {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.formErrors = ''
          if (formModel.id) {
            new EsignUserProxy().updateUserRole(formModel).then((res) => {
              this.$modal.hide('robotics-user-modal', { isOk: true })
              this.$emit('on-ok', res)
            }).catch((e) => {
              this.formErrors = e.detail
            })
          } else {
            new EsignUserProxy().createUser(formModel).then((res) => {
              this.$modal.hide('robotics-user-modal', { isOk: true })
              this.$emit('on-ok', res)
            }).catch((e) => {
              this.formErrors = e.detail
            })
          }
        }
      })
    },
    onOk () {
      this.$refs.form.submit()
    },
    beforeClose () {
      this.formModel = {
        id: null,
        name: null,
        phone: null,
        password: null,
        email: null,
        role: 'ESIGN_ROLE_GENERAL'
      }
      this.schema = formSchema(this)
    },
    beforeOpen (params) {
      this.allowUpdateRole = params.model.user && params.model.user.id !== this.currentUser.user_id
      const schema = formSchema(this)
      this.title = params.model.user ? `${this.$t('user.updateRole')} - ${params.model.name}` : this.$t('user.createUser')
      if (params.model.user) {
        this.formModel = {
          id: params.model.user.id,
          role: params.model.esignrole.role,
          description: params.model.esignrole.description
        }
        this.schema = { role: schema.role, description: schema.description }
      } else {
        this.schema = schema
      }
    }
  }
}
</script>
