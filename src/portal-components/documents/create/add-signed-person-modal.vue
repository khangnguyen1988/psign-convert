<template>
  <app-modal name="add-signed-person-modal" :esc-to-close="false" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose" :ok-text="$t('app.ok')"  width="519px" @on-ok="onOk">
    <app-form
      v-if="schema"
      ref="form"
      @on-submit="onSubmit"
      :schema="schema"
      :data="formModel"

    />
    <div class="text-right mb-4">
      <a @click="addSignedPerson" class="link-add-person" href="javascript:"><span>{{$t('app.add')}}</span><i class="fal fa-plus-circle"></i></a>
    </div>
    <div class="person-row" v-for="(person, index) in addedPersons" :key="person.user.id">
      <person-icon :name="person.user.name"></person-icon>
      <span> {{index + 1}}. {{person.user.name}} - ({{person.signedType | signedType}}) </span>
      <button @click="onClickRemoveSignedPerson(person)" class="ml-auto btn btn-sm btn-outline-secondary btn-outline-trash">
        <i class="fal fa-trash-alt"></i>
      </button>
    </div>
  </app-modal>
</template>
<script>
import AppModal from '@/components/app-modal/index'
import AppForm from '@/components/app-form/index'
import ESignUserProxy from '@/store/proxies/e-sign-user-proxy'
import PersonIcon from '@/portal-components/icons/person-icon'

const formSchema = context => ({
  user: {
    label: context.$t('user.signer'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.signer')}`,
    type: 'autocomplete',
    // type: 'select',
    // options: [],
    fetchSuggestions (searchText) {
      return new ESignUserProxy().getUsers(searchText)
    },
    renderItemText: item => `${item.name} - ${item.user.email}`,
    disabled: false,
    validation: 'required'
  },
  signedType: {
    label: context.$t('user.signeType'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.signeType')}`,
    type: 'select',
    options: [
      { value: null, text: `${context.$t('signature.selectType')}...` },
      { value: 'SIGNATURE_DIGITAL', text: `${context.$t('user.signatureDigitalType')}` },
      // { value: 'SIGNATURE_DIGITAL_HSM', text: 'Ký HSM' },
      { value: 'SIGNATURE_IMAGE', text: `${context.$t('user.signatureImageType')}` },
      { value: 'SIGNATURE_APP_CONFIRMATION', text: `${context.$t('user.signatureAppConfirmationType')}` },
      { value: 'VIEW', text: `${context.$t('user.viewType')}` }
    ],
    validation: 'required'
  }
})

export default {
  name: 'AddSignedPersonModal',
  components: {
    AppForm,
    AppModal,
    PersonIcon
  },
  data () {
    return {
      title: this.$t('document.addSignature'),
      schema: null,
      formModel: {
        user: null,
        signedType: 'SIGNATURE_IMAGE'
      },
      signedPersons: [],
      addedPersons: []
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
          this.$modal.hide('add-signed-person-modal', { isOk: true })
          const signedPerson = this.signedPersons.filter(p => p.id === formModel.user)
          this.$bus.emit('add-signed-person', [{
            user: signedPerson[0],
            signedType: formModel.signedType
          }])
        }
      })
    },
    onOk () {
      if (this.addedPersons.length === 0) {
        this.$refs.form.submit()
      } else {
        this.$modal.hide('add-signed-person-modal', { isOk: true })
        this.$bus.emit('add-signed-person', this.addedPersons)
      }
    },
    beforeClose () {
      this.formModel = {
        user: null,
        signedType: 'SIGNATURE_IMAGE'
      }
      this.schema = null
    },
    beforeOpen () {
      this.addedPersons = []
      this.schema = formSchema(this)
      // new ESignUserProxy().getUsers().then((response) => {
      //   this.signedPersons = response.map(item => ({
      //     id: item.user.id,
      //     name: item.name,
      //   }));
      //   const userOptions = this.signedPersons.map(p => ({ value: p.id, text: p.name }));
      //   userOptions.unshift({ value: null, text: 'Chọn người ký...' });
      //   Vue.set(this.schema.user, 'options', userOptions);
      // });
    },
    onClickRemoveSignedPerson (model) {
      this.addedPersons = this.addedPersons.filter(p => p.user.id !== model.user.id)
    },
    addSignedPerson () {
      const selectedUser = this.$refs.form.getFieldValue('user')
      const signType = this.$refs.form.getFieldValue('signedType')
      const userFieldVm = this.$refs.form.getField('user')
      if (selectedUser) {
        const isExisted = this.addedPersons.findIndex(p => p.user.id === selectedUser.user.id) > -1
        if (!isExisted) {
          this.addedPersons.push({
            user: {
              id: selectedUser.user.id,
              name: selectedUser.name
            },
            signedType: signType
          })
          setTimeout(() => {
            userFieldVm.clear()
            userFieldVm.$validator.errors.clear()
          })
        } else {
          userFieldVm.$validator.errors.add({
            field: userFieldVm.name,
            msg: this.$t('error.duplicateAddPerson')
          })
        }
      }
    }
    // onSelectedSignedPerson(selectedUser) {
    //   // const selectedUser = this.$refs.form.getFieldValue('user');
    //   console.log(selectedUser);
    //   const signType = this.$refs.form.getFieldValue('signedType');
    //   if (selectedUser) {
    //     const isExisted = this.addedPersons.findIndex(p => p.user.id === selectedUser.id) > -1;
    //     if (!isExisted) {
    //       this.addedPersons.push({
    //         user: selectedUser,
    //         signedType: signType,
    //       });
    //       const userFieldVm = this.$refs.form.getField('user');
    //       userFieldVm.clear();
    //     }
    //   }
    // },
  }
}
</script>
<style lang="scss">
.fal.fa-plus-circle {
  font-size: 1.5rem;
}
.link-add-person {
  span {
    margin-top: 2px;
    margin-right: 4px;
  }
  &:hover {
    text-decoration: none;
  }
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.person-row {
  display: flex;
  align-items: center;
  padding: .25rem 0;
}
.btn-outline-trash {
  color: #A3A3A3;
  border-color: #A3A3A3;
  &:hover {
    color: #fff;
    background: #D41717;
    border-color: #D41717;
  }
}
</style>
