<template>
  <app-modal name="signature-modal" :esc-to-close="false" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose"  width="30%" @on-ok="onOk">
    <app-loading :loading="loading">

      <tabs @changed="tabChanged" :options="{  defaultTabHash: selectedTab, useUrlFragment: false }">
        <tab id="signature-hand-writing" container-fluid :name="$t('user.signatureHandWriting')">
          <hand-writing-component  ref="handWritingVm" v-if="selectedTab === 'signature-hand-writing'"></hand-writing-component>
        </tab>
        <tab id="signature-image" :name="$t('user.signatureImage')">
          <app-form
            v-if="schema && selectedTab === 'signature-image'"
            ref="form"
            @on-submit="onSubmit"
            :schema="schema"
            :data="formModel"
          />
        </tab>
        <tab id="signature-text" :name="$t('user.signatureModel')">
          <text-typing-component ref="textTypingVm" v-if="selectedTab === 'signature-text'"></text-typing-component>
        </tab>
      </tabs>
    </app-loading>
  </app-modal>
</template>
<script>
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import AppLoading from '@/components/app-loading/'
import SignatureProxy from '@/store/proxies/signature-proxy'
import HandWritingComponent from '@/portal-components/signature/hand-writing-signature'
import TextTypingComponent from '@/portal-components/signature/text-typing-signature'
import FileProxy from '@/store/proxies/file-proxy'

const formSchema = context => ({
  signature_file: {
    label: context.$t('user.signatureFile'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.signatureFile')}`,
    type: 'input',
    inputType: 'file',
    asyncValidation: (value, resolve) => {
      if (!value) {
        resolve({ msg: 'File là bắt buộc' })
        return
      }
      const allowTypes = ['image/jpeg', 'image/png']
      const result = allowTypes.indexOf(value.type) > -1
      if (!result) {
        resolve({ msg: 'Vui lòng chỉ upload file hình ảnh png hoặc jpeg' })
        return
      }
      resolve(true)
    }
  }
})

export default {
  name: 'SignatureModal',
  components: {
    HandWritingComponent,
    TextTypingComponent,
    AppForm,
    AppModal,
    AppLoading
  },
  data () {
    return {
      title: this.$t('user.signatureImage'),
      selectedTab: 'signature-hand-writing',
      loading: false,
      signatureModel: null,
      schema: null,
      formModel: {
        name: null,
        status: 'ACTIVE',
        type: 'SIGNATURE_IMAGE',
        signature_file: null
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
    tabChanged (selectedTab) {
      this.selectedTab = selectedTab.tab.id
    },
    onSubmit (formModel) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.$modal.hide('signature-modal', { isOk: true })
          this.$bus.emit('close-image-signature-modal', {
            name: currentUser.name,
            ...formModel
          })
        }
      })
    },
    onOk () {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (this.selectedTab === 'signature-hand-writing') {
        const name = `${currentUser ? currentUser.name : 'anonymous'}-hand-writing`
        this.$refs.handWritingVm.getImage(name, 'image/png').then((file) => {
          this.$modal.hide('signature-modal', { isOk: true })
          this.$bus.emit('close-image-signature-modal', {
            name,
            status: 'ACTIVE',
            type: 'SIGNATURE_IMAGE',
            signature_file: file
          })
        })
        return
      }

      if (this.selectedTab === 'signature-text') {
        const name = `${currentUser.name}-text-typing`
        this.$refs.textTypingVm.getImage(name, 'image/png').then((file) => {
          this.$modal.hide('signature-modal', { isOk: true })
          this.$bus.emit('close-image-signature-modal', {
            name,
            status: 'ACTIVE',
            type: 'SIGNATURE_IMAGE',
            signature_file: file
          })
        })
        return
      }

      if (this.selectedTab === 'signature-image') {
        this.$refs.form.submit()
      }
    },
    beforeClose () {
      this.formModel = {
        name: null,
        status: 'ACTIVE',
        type: 'SIGNATURE_IMAGE',
        signature_file: null
      }
    },
    loadCurrentSignature (cb) {
      this.loading = true
      new SignatureProxy({ limit: 1, page: 1 }).getSignature().then((res) => {
        if (res && res.length > 0) {
          this.signatureModel = res[0]
          const fileId = this.signatureModel.file_id
          new FileProxy().getFile(fileId).then((file) => {
            cb(file)
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
        } else {
          cb(null)
        }
      })
    },
    beforeOpen () {
      this.schema = formSchema(this)
    }
  }
}
</script>
