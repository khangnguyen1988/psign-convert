<template>
  <div>
    <template slot="top-buttons" slot-scope="props">
      <button
        v-if="mode === 'ASSIGN_SIGNED_PERSONS'"
        type="button"
        class="btn btn-sm btn-danger mr-2"
        @click="onClickReject()"
      >
        Từ chối
      </button>
    </template>

    <div class="row">
      <div class="col-lg-6">
        <pdf-viewer
          ref="pdfInstance"
          :loading="pdfLoading"
          :file-id="currentFileId"
          :pdf-data="pdfData"
        ></pdf-viewer>
      </div>
      <div class="col-lg-6 over-flow--custom">
        <ul
          class="selected-files"
          v-if="
            mode === 'UPLOAD_NEW_DOC' &&
              selectedFiles &&
              selectedFiles.length > 1
          "
        >
          <li
            @click="onSelectFileInput(file, index)"
            v-for="(file, index) in selectedFiles"
            :class="{ active: currentDisplayFileIndex === index }"
            :key="index"
          >
            {{ file.name }}
          </li>
        </ul>
        <ul
          class="selected-files"
          v-if="
            mode !== 'UPLOAD_NEW_DOC' &&
              documentFiles &&
              documentFiles.length > 1
          "
        >
          <li
            @click="onChangeFile(file, index)"
            v-for="(file, index) in documentFiles"
            :class="{ active: currentDisplayFileIndex === index }"
            :key="index"
          >
            {{ file.name }}
          </li>
        </ul>
        <app-form
          v-if="schema"
          ref="form"
          @on-submit="onSubmit"
          :schema="schema"
          :data="formModel"
          @on-input="onFormFieldChanged"
        />
        <div class="row">
          <div
            class="assigned-person-col"
            :class="{
              'col-lg-6': mode !== 'ASSIGN_SIGNED_PERSONS',
              'col-12': mode === 'ASSIGN_SIGNED_PERSONS'
            }"
          >
            <h4 class="dialog-title">
              {{ $t("document.signerList") }}
              <button
                @click="onClickAddSignedPerson($event)"
                class="ml-2 btn btn-outline-primary btn-sm"
                v-bind:disabled="addSignedPersonDisabled"
              >
                <i class="fal fa-plus"></i>
              </button>
            </h4>
            <div
              class="person-row"
              v-for="(person, index) in signedPersons"
              :key="person.user.id"
            >
              <person-icon :name="person.user.name"></person-icon>
              <span class="mr-auto">
                {{ index + 1 }}. {{ person.user.name }} - ({{
                  person.signedType | signedType
                }})
              </span>
              <button
                @click="onClickAddSignatureToDocument(person)"
                v-if="
                  person.signedType !== 'SIGNATURE_APP_CONFIRMATION' &&
                    person.signedType !== 'VIEW'
                "
                :class="{
                  'btn-primary': addedSignatures[person.user.id],
                  'btn-outline-primary': !addedSignatures[person.user.id]
                }"
                class="btn btn-sm"
              >
                <i class="fal fa-pen-nib"></i>
              </button>
              <button
                @click="onClickRemoveSignedPerson(person, index)"
                class="ml-2 btn btn-sm btn-outline-secondary btn-outline-trash"
              >
                <i class="fal fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <div
            class="col-lg-6 assigned-vendor-col"
            v-if="mode !== 'ASSIGN_SIGNED_PERSONS'"
          >
            <h4 class="dialog-title">
              {{ $t("document.partnerList") }}
              <button
                @click="onClickAddSignedVendor($event)"
                class="ml-2 btn btn-outline-primary btn-sm"
              >
                <i class="fal fa-plus"></i>
              </button>
            </h4>
            <div>
              <div
                class="person-row"
                v-for="(vendor, index) in signedVendors"
                :key="vendor.id"
              >
                <person-icon :name="vendor.name"></person-icon>
                <span class="text-left mr-auto">
                  {{ index + 1 }}. {{ vendor.name }}
                  <vendor-type
                    @change="onChangeVendorType"
                    :vendor="vendor"
                  ></vendor-type>
                </span>
                <button
                  v-if="currentCompanyId !== vendor.id"
                  @click="onClickRemoveSignedVendor(vendor, index)"
                  class="
                    ml-2
                    btn btn-sm btn-outline-secondary btn-outline-trash
                  "
                >
                  <i class="fal fa-trash-alt"></i>
                </button>
              </div>
              <div
                class="person-row"
                v-for="(email, index) in signedEmails"
                :key="email"
              >
                <person-icon :name="email"></person-icon>
                <span class="text-left mr-auto">{{ email }}</span>
                <button
                  @click="onClickAddSignatureToDocument({ email })"
                  :class="{
                    'btn-primary': addedSignatures[email],
                    'btn-outline-primary': !addedSignatures[email]
                  }"
                  class="btn btn-sm"
                >
                  <i class="fal fa-pen-nib"></i>
                </button>
                <button
                  @click="onClickRemoveSignedEmail(email, index)"
                  class="
                    ml-2
                    btn btn-sm btn-outline-secondary btn-outline-trash
                  "
                >
                  <i class="fal fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
// import AppModal from "@/components/app-modal/";
import AppForm from '@/components/app-form/index'
import PdfViewer from '@/components/pdf-viewer/index'
import DocumentProxy from '@/store/proxies/document-proxy'
import DocumentApprovalUserProxy from '@/store/proxies/document-approval-user-proxy'
import { DOCUMENT_STATUS, FORM_MODE } from '@/app-constant'
import FileProxy from '@/store/proxies/file-proxy'
import AppLoading from '@/components/app-loading/index'
import PersonIcon from '@/portal-components/icons/person-icon'
import ToastUtils from '@/utils/toast'
import { getFile, getFilesInfo } from '@/utils/document'
import VendorType from '@/portal-components/documents/create/document-signed-vendor-type.vue'

const formSchema = context => ({
  name: {
    label: context.$t('document.title'),
    placeholder: `${context.$t('app.enter')} ${context.$t('document.title')}`,
    type: 'input',
    validation: 'required',
    readonly: context.mode === FORM_MODE.ASSIGN_SIGNED_PERSONS
  },
  description: {
    label: context.$t('document.desc'),
    placeholder: `${context.$t('app.enter')} ${context.$t('document.desc')}`,
    type: 'input',
    validation: 'required',
    readonly: context.mode === FORM_MODE.ASSIGN_SIGNED_PERSONS
  },
  type: {
    label: context.$t('document.type'),
    placeholder: `${context.$t('app.enter')} ${context.$t('document.type')}`,
    type: 'input',
    validation: 'required',
    readonly: context.mode === FORM_MODE.ASSIGN_SIGNED_PERSONS
  },
  tag_id: {
    label: context.$t('document.tag'),
    labelAddOn: {
      icon: 'fal fa-plus',
      text: context.$t('tag.createTag'),
      onClick () {
        context.$modal.show('tag-modal', { model: {} })
      }
    },
    type: 'multi-checkbox',
    // type: 'tag',
    // autocompleteItems: context.allTags,
    // addOnlyFromAutocomplete: true,
    options: context.tags,
    placeholder: `${context.$t('app.enter')} ${context.$t('document.tag')}`,

    readonly: context.mode === FORM_MODE.ASSIGN_SIGNED_PERSONS
  },
  group_id: {
    label: context.$t('document.group'),
    labelAddOn: {
      icon: 'fal fa-plus',
      text: context.$t('group.createGroup'),
      onClick () {
        context.$modal.show('group-modal', { model: {} })
      }
    },
    type: 'multi-checkbox',
    options: context.groupOptions,
    placeholder: `${context.$t('app.enter')} ${context.$t('document.group')}`,

    readonly: context.mode === FORM_MODE.ASSIGN_SIGNED_PERSONS
  },
  doc_files: {
    label: context.$t('document.addFile'),
    placeholder: `${context.$t('app.enter')} ${context.$t('document.addFile')}`,
    type: 'input',
    multiple: true,
    inputType: 'file',
    validation: 'required',
    display: context.mode === FORM_MODE.UPLOAD_NEW_DOC
  },
  signedPerson: {
    type: 'input',
    inputType: 'hidden',
    asyncValidation: (value, resolve) => {
      let result = true
      // !context.signedVendors
      //   .map(
      //     v => {
      //       if (v.id === context.currentCompanyId && v.type !== "REVIEW") {
      //         if (!value || value.size === 0) {
      //           ToastUtils.showToast('error', context.$t("document.signedPersonIsRequired"));
      //           result = { msg: context.$t("document.signedPersonIsRequired") };
      //           resolve(result);
      //           return;
      //         }
      //       }
      //     }
      //   )

      if (context.currentSignedVendorType !== 'REVIEW') {
        if (!value || value.size === 0) {
          ToastUtils.showToast(
            'error',
            context.$t('document.signedPersonIsRequired')
          )
          result = { msg: context.$t('document.signedPersonIsRequired') }
          resolve(result)
          return
        }
      }
      // if (!value || value.size === 0) {
      //   ToastUtils.showToast('error', context.$t("document.signedPersonIsRequired"));
      //   result = { msg: context.$t("document.signedPersonIsRequired") };
      //   resolve(result);
      //   return;
      // }
      resolve(result)
    }
  },
  signedPosition: {
    type: 'input',
    inputType: 'hidden',
    asyncValidation: (value, resolve) => {
      let result = true
      // if (!value || value.size === 0) {
      //   ToastUtils.showToast('error', context.$t("document.signedPositionIsRequired"));
      //   result = { msg: context.$t("document.signedPositionIsRequired") };
      //   resolve(result);
      //   return;
      // }
      const signaturePosition = context.$refs.pdfInstance.getSignaturePositions()
      if (
        !context.signedPersons
          .filter(
            s =>
              s.signedType !== 'SIGNATURE_APP_CONFIRMATION' &&
              s.signedType !== 'VIEW'
          )
          .every(
            p => signaturePosition.findIndex(d => d.userId === p.user.id) > -1
          )
      ) {
        console.log('1')
        result = { msg: context.$t('document.signedPositionIsMissing') }
        ToastUtils.showToast('error', result.msg)
      }
      if (
        FORM_MODE.ASSIGN_SIGNED_PERSONS !== context.mode &&
        !context.signedEmails.every(
          emailSignature =>
            signaturePosition.findIndex(d => d.email === emailSignature) > -1
        )
      ) {
        result = { msg: context.$t('document.signedPositionIsMissing') }
        ToastUtils.showToast('error', result.msg)
      }

      resolve(result)
    }
  }
})

export default {
  name: 'DocumentUpload',
  components: {
    VendorType,
    AppForm,
    PdfViewer,
    AppLoading,
    PersonIcon
  },
  props: {
    documentData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      mode: FORM_MODE.UPLOAD_NEW_DOC,
      schema: null,
      pdfData: null,
      selectedFiles: [], // FileInput create mode
      documentFiles: [], // Edit mode
      currentDisplayFileIndex: 0,
      currentDisplayFile: null,
      currentFileId: null,
      pdfLoading: false,
      formModel: {
        tag_id: [],
        group_id: []
      },
      // Id of the vendor_document relationship
      currentSignedVendorId: null,
      currentSignedVendorType: 'ALL',
      addSignedPersonDisabled: false,
      currentCompanyId: null,
      currentUserId: null,
      signedPersons: [],
      signedVendors: [],
      signedEmails: [],
      addedSignatures: {},
      documentModel: null
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState(['tags', 'groups']),
    groupOptions () {
      return this.groups.map(g => ({ value: g.id, text: g.name }))
    }
  },
  created () {
    this.$bus.on('add-signed-person', this.onAddSignedPerson)
    this.$bus.on('add-signed-vendor', this.onAddSignedVendor)
    this.$bus.on('remove-signature', this.onRemoveSignature)
    this.$bus.on('close-tag-modal', this.onCloseTagModal)
    this.$bus.on('close-group-modal', this.onCloseGroupModal)
  },
  beforeDestroy () {
    this.$bus.off('add-signed-person', this.onAddSignedPerson)
    this.$bus.off('add-signed-vendor', this.onAddSignedVendor)
    this.$bus.off('remove-signature', this.onRemoveSignature)
    this.$bus.off('close-tag-modal', this.onCloseTagModal)
    this.$bus.off('close-group-modal', this.onCloseGroupModal)
    this.formModel = {
      tag_id: [],
      group_id: []
    }
    this.pdfData = null
    this.signedPersons = []
    this.signedEmails = []
    this.signedVendors = []
    this.selectedFiles = []
    this.currentDisplayFileIndex = 0
    this.currentDisplayFile = null
    this.currentFileId = null
    this.$refs.pdfInstance.reset()
  },
  mounted () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const CURRENT_COMPANY_ID =
      currentUser.company.company_id || currentUser.company.id
    this.currentCompanyId = CURRENT_COMPANY_ID
    this.currentUserId = currentUser.user_id
    const documentModel = this.documentData.model
    this.documentModel = documentModel
    this.signedVendors = [
      { id: CURRENT_COMPANY_ID, name: currentUser.company.name, type: 'ALL' }
    ]
    if (this.documentData.mode) {
      this.mode = this.documentData.mode
    }
    this.title = this.getTitle(this.mode)
    this.schema = formSchema(this)
    if (this.mode === FORM_MODE.EDIT_DOC) {
      this.okText = 'Cập nhật'
    }
    if (this.mode === FORM_MODE.ASSIGN_SIGNED_PERSONS) {
      this.okText = 'Gửi lời mời'
    }
    const arrTag = []
    if (documentModel.tag_id) {
      documentModel.tag_id.forEach(item => {
        arrTag.push(item.id)
      })
    }
    const arrGroup = []
    if (documentModel.group_id) {
      documentModel.group_id.forEach(item => {
        arrGroup.push(item.id)
      })
    }

    if (documentModel.id) {
      const formModel = {
        id: documentModel.id,
        name: documentModel.name,
        description: documentModel.description,
        type: documentModel.type,
        tag_id: arrTag,
        group_id: arrGroup,
        signedPerson: new Set()
      }
      if (documentModel.signed_vendors) {
        const idx = documentModel.signed_vendors.findIndex(
          v => v.company_id.id === CURRENT_COMPANY_ID
        )
        // This is the ID of the vendor_document where vendorId = Current Company
        this.currentSignedVendorId = documentModel.signed_vendors[idx].id
        this.currentSignedVendorType = documentModel.signed_vendors[idx].type
        this.signedVendors = documentModel.signed_vendors.map(vendor => ({
          ...vendor.company_id,
          type: vendor.type
        }))
      }

      if (documentModel.signed_persons) {
        const signedPersons = []
        documentModel.signed_persons
          .filter(person => person.company_id === CURRENT_COMPANY_ID)
          .forEach(person => {
            signedPersons.push({
              signedType: person.signed_type,
              user: {
                id: person.user_id.user.id,
                name: person.user_id.name,
                phone: person.user_id.phone,
                company: person.user_id.company
              },
              document_signatures: person.document_signatures
            })
            formModel.signedPerson.add(person.user_id.user.id)
          })
        this.signedPersons = [...signedPersons]

        this.signedEmails = documentModel.signed_persons
          .filter(person => person.company_id === 0)
          .map(person => person.email)

        // this.formModel = {...formModel}
        // this.loadFiles(documentModel.files_id);
      }
      this.formModel = { ...formModel }
      this.loadFiles(documentModel.files_id)
    }
  },
  methods: {
    onChangeVendorType (type, vendor) {
      vendor.type = type
      Vue.set(this, 'signedVendors', [...this.signedVendors])
      if (type === 'REVIEW' && vendor.id === this.currentCompanyId) {
        this.removeSignedPerson()
        this.addSignedPersonDisabled = true
        this.currentSignedVendorType = type
      } else if (type !== 'REVIEW' && vendor.id === this.currentCompanyId) {
        this.addSignedPersonDisabled = false
        this.currentSignedVendorType = type
      } else {
        this.addSignedPersonDisabled = false
      }
    },
    onCloseTagModal () {
      Vue.set(this.schema.tag_id, 'options', this.tags)
    },
    onCloseGroupModal () {
      Vue.set(this.schema.group_id, 'options', this.groupOptions)
    },
    onRemoveSignature (signatureInfo) {
      const predicate = !signatureInfo.email
        ? d => d.userId === signatureInfo.userId
        : d => d.email === signatureInfo.email
      const signaturePosition = this.$refs.pdfInstance.getSignaturePositions()

      if (signaturePosition.findIndex(predicate) === -1) {
        this.$set(
          this.addedSignatures,
          `${signatureInfo.email ? signatureInfo.email : signatureInfo.userId}`,
          false
        )
        const signPositionIds = this.$refs.form.getFieldValue('signedPosition')
        if (signPositionIds) {
          signPositionIds.delete(signatureInfo.userId)
        }
        this.$refs.form.setFieldValue('signedPosition', signPositionIds)
      }
    },
    onClickAddSignatureToDocument (model, positionParams) {
      const position = positionParams || {}
      let signatureDefaultValue = {}
      if (
        model.signedType === 'SIGNATURE_APP_CONFIRMATION' ||
        model.signedType === 'VIEW'
      ) {
        return
      }
      let width = 80
      let height = 80

      if (!model.email) {
        if (model.signedType.indexOf('SIGNATURE_DIGITAL') > -1) {
          width = 150
          height = 30
        }
        signatureDefaultValue = {
          name: model.user.name,
          userId: model.user.id,
          email: ''
        }
      } else {
        signatureDefaultValue = {
          name: model.email,
          userId: 0,
          email: model.email
        }
      }
      const signature = Object.assign({}, signatureDefaultValue, {
        docId: position.docId || null,
        docIndex: position.docIndex || null,
        top: position.top || 300,
        left: position.left || 300,
        width: position.width || width,
        height: position.height || height,
        page: position.page
      })
      this.$refs.pdfInstance.addSignature(signature)
      this.setSignedPosition(model)
    },
    setSignedPosition (model) {
      let signPositionIds = this.$refs.form.getFieldValue('signedPosition')
      if (!signPositionIds) {
        signPositionIds = new Set([model.email ? model.email : model.user.id])
      } else {
        signPositionIds.add(model.email ? model.email : model.user.id)
      }
      this.$set(
        this.addedSignatures,
        `${model.email ? model.email : model.user.id}`,
        true
      )
      this.$refs.form.setFieldValue('signedPosition', signPositionIds)
    },
    onClickRemoveSignedPerson (model) {
      this.signedPersons = this.signedPersons.filter(
        p => p.user.id !== model.user.id
      )
      this.$refs.pdfInstance.removeUserSignatures(model.user.id)
      const signPositionIds = this.$refs.form.getFieldValue('signedPosition')
      const signPersonIds = this.$refs.form.getFieldValue('signedPerson')
      if (signPositionIds) {
        signPositionIds.delete(model.user.id)
      }
      if (signPersonIds) {
        signPersonIds.delete(model.user.id)
      }
      this.$refs.form.setFieldValue('signedPosition', signPositionIds)
      this.$refs.form.setFieldValue('signedPerson', signPersonIds)
    },
    removeSignedPerson () {
      this.signedPersons = this.signedPersons.filter(p => this.$refs.pdfInstance.removeUserSignatures(p.user.id))
      this.signedPersons = []
      this.$refs.form.setFieldValue('signedPosition', new Set([]))
      this.$refs.form.setFieldValue('signedPerson', new Set([]))
    },
    onAddSignedPerson (signedPersons) {
      signedPersons.forEach((newAddedSignedPerson, index) => {
        if (
          this.signedPersons.length === 0 ||
          this.signedPersons.findIndex(
            p => p.user.id === newAddedSignedPerson.user.id
          ) === -1
        ) {
          this.signedPersons = [...this.signedPersons, newAddedSignedPerson]

          if (this.$refs.pdfInstance && this.$refs.pdfInstance.currentFrameEl) {
            const width = this.$refs.pdfInstance.currentFrameEl.width()
            const height = this.$refs.pdfInstance.currentFrameEl.height()
            this.onClickAddSignatureToDocument(newAddedSignedPerson, {
              page: this.$refs.pdfInstance.pdfInstance.numPages,
              top: height - (200 + index * 50),
              left: width - (200 + index * 50)
            })
          }

          let signPersonIds = this.$refs.form.getFieldValue('signedPerson')
          if (!signPersonIds) {
            signPersonIds = new Set([newAddedSignedPerson.user.id])
          } else {
            signPersonIds.add(newAddedSignedPerson.user.id)
          }
          this.$refs.form.setFieldValue('signedPerson', signPersonIds)
        }
      })
    },
    onAddSignedVendor ({ vendors, emails }) {
      this.signedVendors = [...vendors]
      this.signedEmails = [...emails]
    },
    onClickRemoveSignedVendor (model) {
      this.signedVendors = this.signedVendors.filter(p => p.id !== model.id)
    },
    onClickRemoveSignedEmail (email) {
      this.signedEmails = this.signedEmails.filter(e => e !== email)
      this.$refs.pdfInstance.removeEmailUserSignatures(email)
      const signPositionIds = this.$refs.form.getFieldValue('signedPosition')
      if (signPositionIds) {
        signPositionIds.delete(email)
      }
      this.$refs.form.setFieldValue('signedPosition', signPositionIds)
    },

    onClickAddSignedPerson () {
      this.$modal.show('add-signed-person-modal', { model: {} })
    },
    onClickAddSignedVendor () {
      this.$modal.show('add-signed-vendor-modal', {
        vendors: [...this.signedVendors],
        emails: [...this.signedEmails]
      })
    },

    onSelectFileInput (file, index) {
      this.currentDisplayFile = file
      this.currentDisplayFileIndex = index
      this.loadPdfData(this.currentDisplayFile).then(pdfData => {
        this.pdfData = pdfData
        this.pdfLoading = false
      })
    },
    onChangeFile (file, index) {
      const vm = this
      this.currentDisplayFile = file
      this.currentFileId = vm.currentDisplayFile.id
      this.currentDisplayFileIndex = index
      this.loadPdf(this.currentFileId)
    },
    onFormFieldChanged ($event, field) {
      const formVm = this.$refs.form
      if (!field) {
        return
      }
      if (field.name === 'doc_files') {
        const fileInput = formVm
          .getField('doc_files')
          .$el.querySelector('input[type="file"]')
        this.selectedFiles = fileInput.files
        this.currentDisplayFile = this.selectedFiles[0]
        this.loadPdfData(this.currentDisplayFile).then(pdfData => {
          this.pdfData = pdfData
          this.pdfLoading = false
        })
      }
    },
    loadPdfData (fileInput) {
      return new Promise((resolve, reject) => {
        const file = fileInput
        if (file.type !== 'application/pdf') {
          reject(true)
          return
        }
        const fileReader = new FileReader()
        function fileReaderOnLoad () {
          const pdfData = new Uint8Array(this.result)
          resolve(pdfData)
        }
        fileReader.onload = fileReaderOnLoad
        fileReader.readAsArrayBuffer(file)
      })
    },
    onSubmit (formModel) {
      this.$refs.form.validate().then(isValid => {
        if (isValid) {
          if (this.mode === FORM_MODE.ASSIGN_SIGNED_PERSONS) {
            this.assignPersons(formModel)
          }
          if (this.mode === FORM_MODE.UPLOAD_NEW_DOC) {
            this.uploadDocument(formModel)
          }
          if (this.mode === FORM_MODE.EDIT_DOC) {
            this.editDocument(formModel)
          }
        }
      })
    },
    submit () {
      this.$refs.form.submit()
    },
    preparePayloadForPostingToServer (formModel, isUploadNew) {
      const options = isUploadNew
        ? null
        : {
            document_id: this.documentModel.id,
            company_id: this.documentModel.company_id
          }
      let signedPersonsPayload = this.parsePayloadSignedPersons(
        this.signedPersons,
        options
      )
      signedPersonsPayload = signedPersonsPayload.concat(
        this.convertSignedEmailToPersons(this.signedEmails, options)
      )
      let payload
      if (isUploadNew) {
        formModel.status = DOCUMENT_STATUS.NEW
        payload = {
          ...formModel,
          signed_persons: JSON.stringify(signedPersonsPayload),
          signed_vendors: JSON.stringify(
            this.parsePayloadSignedVendors(this.signedVendors)
          ),
          signedPosition: null
        }
        delete payload.signedPosition
      } else {
        payload = {
          document: {
            ...formModel,
            signedPosition: null
          },
          signed_persons: signedPersonsPayload,
          signed_vendors: this.parsePayloadSignedVendors(this.signedVendors)
        }
        delete payload.document.signedPosition
      }

      return payload
    },
    onUploadResponse (response) {
      this.$modal.hide('document-upload-modal', { isOk: true })
      this.$bus.emit('document-upload-success', response)
      this.$router.push({ name: 'draft-documents' })
    },
    uploadDocument (formModel) {
      const payload = this.preparePayloadForPostingToServer(formModel, true)
      new DocumentProxy().createDocument(payload, {}).then(response => {
        this.onUploadResponse(response)
      })
    },
    editDocument (formModel) {
      const payload = this.preparePayloadForPostingToServer(formModel, false)
      new DocumentProxy().changeDocument(payload).then(response => {
        this.onUploadResponse(response)
      })
    },

    assignPersons (formModel) {
      const signedPersons = this.parsePayloadSignedPersons(this.signedPersons, {
        document_id: this.documentModel.id,
        company_id: this.documentModel.company_id
      })
      if (formModel.id) {
        new DocumentApprovalUserProxy()
          .addPersons(signedPersons, this.currentSignedVendorId)
          .then(response => {
            this.$modal.hide('document-upload-modal', { isOk: true })
            this.$bus.emit('document-upload-success', response)
          })
      }
    },
    parsePayloadSignedVendors (signedVendors) {
      // const vendors = signedVendors.map((vendor, index) => ({
      //   id: vendor.id,
      //   type: vendor.type,
      //   sequence: index + 2,
      // }));
      let sequence = 0
      const vendors = signedVendors.map(vendor => {
        if (vendor.type !== 'REVIEW') {
          sequence += 1
          return {
            id: vendor.id,
            type: vendor.type,
            sequence
          }
        }
        return {
          id: vendor.id,
          type: vendor.type,
          sequence: 0
        }
      })
      // const lastSequence = vendors[vendors.length - 1].sequence;
      if (this.signedEmails.length > 0) {
        vendors.push({
          id: 0,
          type: 'SIGN',
          sequence: sequence + 1
        })
      }
      console.log(vendors)
      return vendors
    },
    convertSignedEmailToPersons (emails, options) {
      const documentSignatures = this.$refs.pdfInstance.getSignaturePositions()
      return emails.map((email, index) => {
        const signatures = documentSignatures
          .filter(doc => doc.email === email)
          .map(doc => {
            const result = {
              file_upload_index: doc.docIndex,
              page: doc.page,
              width: doc.width,
              height: doc.height,
              left: doc.left,
              top: doc.top,
              bottom: doc.bottom
            }
            if (options && options.document_id) {
              result.file_id = doc.docId
              result.document_id = doc.document_id
              delete result.file_upload_index
            }
            return result
          })
        return {
          company_id: 0,
          user_id: 0,
          email,
          signed_type: 'SIGNATURE_IMAGE',
          sequence: index + 1,
          document_signatures: signatures
        }
      })
    },
    parsePayloadSignedPersons (persons, options) {
      const documentSignatures = this.$refs.pdfInstance.getSignaturePositions()
      let numberOfViewer = 0
      return persons.map((p, index) => {
        const signatures = documentSignatures
          .filter(doc => doc.userId === p.user.id)
          .map(doc => {
            const result = {
              file_upload_index: doc.docIndex,
              page: doc.page,
              width: doc.width,
              height: doc.height,
              left: doc.left,
              top: doc.top,
              bottom: doc.bottom
            }
            if (options && options.document_id) {
              result.file_id = doc.docId
              result.document_id = options.document_id
              delete result.file_upload_index
            }
            return result
          })
        numberOfViewer += p.signedType === 'VIEW' ? 1 : 0
        const result = {
          user_id: p.user.id,
          email: '',
          signed_type: p.signedType,
          sequence: p.signedType === 'VIEW' ? 0 : index - numberOfViewer + 1,
          document_signatures: p.signedType === 'VIEW' ? [] : signatures
        }
        if (options && options.company_id) {
          result.company_id = options.company_id
        }
        return result
      })
    },
    onClickReject () {
      new DocumentProxy()
        .rejectDocumentByVendor(this.currentSignedVendorId)
        .then(response => {
          this.$modal.hide('document-upload-modal', { isOk: true })
          this.$bus.emit('document-upload-success', response)
        })
    },
    getTitle (mode) {
      const TITLES = {
        [FORM_MODE.ASSIGN_SIGNED_PERSONS]: this.$t('document.assignPerson'),
        [FORM_MODE.UPLOAD_NEW_DOC]: this.$t('document.createNew'),
        [FORM_MODE.EDIT_DOC]: this.$t('document.edit')
      }
      return TITLES[mode]
    },
    loadPdfAndPersonSignatures (fileMetaData) {
      const vm = this
      return new Promise(resolve => {
        getFile({
          fileId: fileMetaData.id
        }).then(pdfBytes => {
          pdfBytes.arrayBuffer().then(buffer => {
            vm.pdfData = buffer
            vm.pdfLoading = false
            if (vm.signedPersons.length === 0) {
              resolve()
              return
            }
            setTimeout(() => {
              const emailPersons = vm.documentModel.signed_persons
                .filter(person => person.company_id === 0)
                .map(person => ({
                  signedType: person.signed_type,
                  user: null,
                  email: person.email,
                  document_signatures: person.document_signatures
                }))

              const allPersons = [...vm.signedPersons, ...emailPersons]
              allPersons.forEach(person => {
                person.document_signatures.forEach(s => {
                  if (s.file_id === fileMetaData.id) {
                    const docSignature = {
                      docId: s.file_id,
                      docIndex: s.file_upload_index,
                      page: s.page,
                      email: person.email || '',
                      userId: person.email ? 0 : s.user_id,
                      name: person.email ? person.email : person.user.name,
                      height: s.height,
                      width: s.width,
                      top: s.top,
                      left: s.left,
                      bottom: s.bottom
                    }
                    vm.$refs.pdfInstance.addSignature(docSignature)
                    vm.setSignedPosition(person)
                  }
                })
              })
              resolve()
            }, 500)
          })
        })
      })
    },
    loadPdf (fileId) {
      const vm = this
      return new Promise(resolve => {
        const fileProxy = new FileProxy()
        fileProxy.getFile(fileId).then(pdfBytes => {
          pdfBytes.arrayBuffer().then(buffer => {
            vm.pdfData = buffer
            vm.pdfLoading = false
            resolve()
          })
        })
      })
    },
    // Load file tuan tu
    loadFiles (listFileId) {
      const vm = this
      vm.pdfLoading = true
      return new Promise(resolve => {
        getFilesInfo(listFileId).then(res => {
          vm.documentFiles = res
          // let loadPdfPromises = [];
          let chain = Promise.resolve()
          for (let i = vm.documentFiles.length - 1; i >= 0; i--) {
            const fileId = vm.documentFiles[i].id
            chain = chain.then(() => {
              vm.currentDisplayFile = vm.documentFiles[i]
              vm.currentFileId = fileId
              return vm.loadPdfAndPersonSignatures(vm.documentFiles[i])
            })
          }
          chain.then(() => {
            vm.pdfLoading = false
            resolve()
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.selected-files {
  padding: 0;
  margin: 0;
}
.selected-files li {
  cursor: pointer;
  list-style: none;
  padding: 0.5rem;
  border: 1px solid #ccc;
  margin: 1rem 0;
  border-radius: 3px;
}
.selected-files li.active,
.selected-files li:hover {
  background: #daecf9;
  border: 1px solid #daecf9;
}
.selected-files li.active {
  font-weight: bold;
  color: #225b87;
}
.assigned-vendor-col {
  text-align: right;
  border-left: 1px solid #ccc;
  @media screen and (max-width: 576px) {
    margin-top: 2rem;
    text-align: left;
    border-left: none;
  }
}
.assigned-vendor-col {
  @media screen and (max-width: 576px) {
    margin-top: 2rem;
  }
}
.over-flow--custom {
  overflow: scroll;
  max-height: 85vh;
}
</style>
