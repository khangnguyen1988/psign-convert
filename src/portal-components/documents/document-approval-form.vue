<template>
  <app-loading :loading="loading" :loading-progress="loadingProgress" :render-child="true">
    <div class="row">
      <div class="col-lg-8">
        <div style="height: 75vh">
          <adobe-viewer v-if="pdfDataSrc" element-id="doc-approval-pdf" :file-name="currentDisplayFile.name" :src="pdfDataSrc"></adobe-viewer>
        </div>
      </div>
      <div class="col-lg-4" style="max-height: 80vh;overflow-y: scroll;">
        <ul class="selected-files" v-if="documentFiles && documentFiles.length > 1">
          <li @click="onChangeFile(file, index)" v-for="(file, index) in documentFiles"
              :class="{'active': currentDisplayFileIndex === index}" :key="index"
          >
            {{file.name}}
          </li>
        </ul>
        <document-signing-status v-if="documentModel" :document-model="documentModel">
          <div :slot="slotName" slot-scope="props">
            <div class="row pt-2">
              <div class="col-12">
                <app-form
                  v-if="schema"
                  ref="form"
                  @on-submit="onSubmit"
                  :schema="schema"
                  :data="formModel"
                />
              </div>
            </div>
            <div class="row">
              <div v-if="!isConfirmationSign()" class="col-12">
                <a v-if="defaultImageSignatureModel" @click="onClickDefaultImageSignature()" :class="{'btn-primary' : useDefaultImageSignature, 'btn-outline-secondary': !useDefaultImageSignature   }" class="btn btn-sm">
                  {{$t('signature.defaultSignature')}}
                  <i class="fal fa-pen-nib"></i>
                </a>
                <a @click="openModal('signature-modal')" :class="{'btn-primary' : !useDefaultImageSignature, 'btn-outline-secondary': useDefaultImageSignature   }" class="btn btn-sm">
                  <span v-if="defaultImageSignatureModel">
                     {{$t('signature.changeSignature')}}
                  </span>
                  <span v-if="!defaultImageSignatureModel">
                     {{$t('signature.selectSignature')}}
                  </span>
                  <i class="fal fa-pen"></i>
                </a>
                <!--                <div v-if="signWithImage && imageSignatureUrl" class="form-group">
                                  <div style="display: flex; justify-content: space-between; width: 150px">
                                    <label>Chữ ký</label>
                                    <a class="pl-4" @click="openModal('signature-modal')"  href="javascript:"><i class="fal fa-pen"></i></a>
                                  </div>

                                  <img style="display:block; border-radius: 5px; border: 1px solid #ccc" width="150px" height="150px"  :src="imageSignatureUrl"  alt="Signature Image"/>
                                </div>
                                <div v-if="signWithImage && !(imageSignatureUrl)">
                                  <a @click="openModal('signature-modal')"  href="javascript:" >Bạn chưa cấu hình chữ ký ảnh. Bấm vào đây để tạo và ký</a>
                                </div>-->
              </div>
            </div>
          </div>
        </document-signing-status>

      </div>
    </div>
  </app-loading>
</template>
<script>
import { mapState } from 'vuex'
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import PdfViewer from '@/components/pdf-viewer'
import SignatureProxy from '@/store/proxies/signature-proxy'
import CaSignProxy from '@/store/proxies/ca-sign-proxy'
import DocumentProxy from '@/store/proxies/document-proxy'
import AppLoading from '@/components/app-loading/'
import { PDFDocument } from 'pdf-lib'
import AdobeViewer from '@/components/pdf-viewer/adobe-viewer'
import ToastUtils from '@/utils/toast'
import DocumentSigningStatus from '@/portal-components/documents/document-signing-status'
import { getFile, getFilesInfo } from '@/utils/document'

const formSchema = context => ({
  note: {
    label: context.$t('user.comment'),
    placeholder: `${context.$t('app.enter')} ${context.$t('user.comment')}`,
    type: 'textarea',
    rows: '1'
  }
})

const initComponentData = () => ({
  formSubmitting: false,
  loading: false,
  loadingCurrentImageSignature: false,
  schema: null,
  pdfData: null,
  pdfDataSrc: null,
  pdfLoading: true,
  inMemorySignedFiles: null,
  imageSignatureUrl: null,
  currentImageSignatureModel: null,
  formModel: {},
  documentFiles: [],
  currentDisplayFile: null,
  currentDisplayFileIndex: 0,
  currentCompanyId: null,
  currentUserId: null,
  currentFileId: null,
  documentModel: null,
  hasSigned: false,
  signWithImage: false
})

const resetComponentData = (vm) => {
  const data = initComponentData()
  Object.keys(data).forEach((key, val) => {
    vm.key = val
  })
}

export default {
  name: 'DocumentApprovalForm',
  components: {
    AdobeViewer,
    AppForm,
    AppModal,
    PdfViewer,
    AppLoading,
    DocumentSigningStatus
  },
  data () {
    return {
      formSubmitting: false,
      loading: false,
      loadingProgress: null,
      loadingCurrentImageSignature: false,
      schema: null,
      pdfData: null,
      pdfDataSrc: null,
      pdfLoading: true,
      inMemorySignedFiles: null,
      imageSignatureUrl: null,
      currentImageSignatureModel: null,
      defaultImageSignatureModel: null,
      useDefaultImageSignature: true,
      formModel: {},
      documentFiles: [],
      currentDisplayFile: null,
      currentDisplayFileIndex: 0,
      currentCompanyId: null,
      currentUserId: null,
      currentFileId: null,
      documentModel: null,
      hasSigned: false,
      signWithImage: false,
      slotName: null
    }
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    externalSignUuid: {
      type: [String],
      default: ''
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  beforeDestroy () {
    resetComponentData(this)
    this.$bus.off('close-image-signature-modal', this.onSelectImageSignature)
  },
  mounted () {
    this.$bus.on('close-image-signature-modal', this.onSelectImageSignature)
    const documentModel = this.model
    this.documentModel = documentModel
    this.schema = formSchema(this)
    this.setLoading(true)
    if (this.externalSignUuid) {
      this.currentCompanyId = 0
      this.currentUserId = 0
      if (this.documentHasSignedByCurrentUser()) {
        this.onSignSuccess()
        return
      }
    } else {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      this.currentCompanyId = currentUser.company.company_id || currentUser.company.id
      this.currentUserId = currentUser.user_id
    }

    this.currentSignPerson = this.getPersonInTurn()
    this.slotName = `slot-approval-id:${this.currentSignPerson ? this.currentSignPerson.id : 0}`

    this.signWithImage = this.isImageSign()
    if (this.signWithImage && !this.externalSignUuid) {
      this.showProfileImageSignature()
    }
    this.loadFiles(documentModel.files_id).then(() => {
      if (!this.isConfirmationSign()) {
        this.loadSignatureMarkup().then((markupImage) => {
          this.signImageOnFiles(markupImage).then((response) => {
            const fileIds = response.map(r => r.fileId)
            this.inMemorySignedFiles = response
            this.loadSignedPdf(fileIds[0])
            this.setLoading(false)
          }, (msg) => {
            ToastUtils.showToast('error', msg)
          })
        })
      } else {
        this.loadPdf(this.currentDisplayFile).then(() => {
          this.setLoading(false)
        })
      }
    })
  },
  methods: {
    setLoading (value) {
      if (value) {
        this.loading = true
      } else {
        setTimeout(() => {
          this.$nextTick(() => {
            this.loading = false
            this.loadingProgress = null
          })
        }, 100)
      }
    },
    getVendorInTurn () {
      const currentVendorIndex = this.documentModel.current_index
      const result = this.documentModel.signed_vendors.filter(v => v.sequence === currentVendorIndex)
      return result && result.length > 0 ? result[0] : null
    },
    getPersonInTurn () {
      const vendorInTurn = this.getVendorInTurn()
      if (!vendorInTurn) {
        return null
      }
      const result = this.documentModel.signed_persons
        ? this.documentModel.signed_persons.filter(p =>
          vendorInTurn.company_id &&
        p.company_id === vendorInTurn.company_id.id &&
        p.sequence === vendorInTurn.current_index + 1
        )
        : []
      return result && result.length > 0 ? result[0] : null
    },
    documentHasSignedByCurrentUser () {
      if (this.externalSignUuid) {
        const idx = this.documentModel.signed_persons ? this.documentModel.signed_persons.findIndex(p => p.uuid_url === this.externalSignUuid) : -1
        return idx > -1 && !!this.documentModel.signed_persons[idx].signed_at
      }
      return false
    },
    signByImageProxy (payload) {
      if (!this.externalSignUuid) {
        return new SignatureProxy().signByImage(payload, {})
      }
      return new SignatureProxy().signImageByAnonymous({
        ...payload,
        uuid_url: this.externalSignUuid
      }, {})
    },
    rejectDocumentProxy (id, note) {
      if (!this.externalSignUuid) {
        return new DocumentProxy().rejectDocument(id, note)
      }
      return new DocumentProxy().rejectDocumentByAnonymous(this.externalSignUuid, note)
    },
    getDocumentSignatures () {
      const index = this.documentModel.signed_persons
        ? this.documentModel.signed_persons.findIndex((x) => {
          if (this.externalSignUuid) {
            return x.uuid_url === this.externalSignUuid
          }
          return !x.email && x.user_id.user.id === this.currentUserId
        })
        : -1
      if (index > -1 && this.documentModel.signed_persons[index].document_signatures) {
        return this.documentModel.signed_persons[index].document_signatures
      }
      return []
    },
    getSignType () {
      if (this.currentUserId === 0) {
        return 'SIGNATURE_IMAGE'
      }
      const idx = this.documentModel.signed_persons ? this.documentModel.signed_persons.findIndex(x => !x.email && x.user_id.user.id === this.currentUserId) : -1
      if (idx > -1) {
        return this.documentModel.signed_persons[idx].signed_type
      }
      return null
    },
    isDigitalSign () {
      const signType = this.getSignType()
      return (signType && (signType === 'SIGNATURE_DIGITAL' || signType === 'SIGNATURE_DIGITAL_HSM'))
    },
    isHsmSign () {
      const signType = this.getSignType()
      return (signType && signType === 'SIGNATURE_DIGITAL_HSM')
    },
    isImageSign () {
      const signType = this.getSignType()
      return (signType && signType === 'SIGNATURE_IMAGE')
    },
    isConfirmationSign () {
      const signType = this.getSignType()
      return (signType && signType === 'SIGNATURE_APP_CONFIRMATION')
    },
    getApprovalUserId () {
      const index = this.documentModel.signed_persons
        ? this.documentModel.signed_persons.findIndex((x) => {
          if (this.externalSignUuid) {
            return x.uuid_url === this.externalSignUuid
          }
          return !x.email && x.user_id.user.id === this.currentUserId
        })
        : -1
      if (index > -1) {
        return this.documentModel.signed_persons[index].id
      }
      return null
    },
    getApprovalVendorId () {
      const index = this.documentModel.signed_vendors.findIndex((x) => {
        if (this.externalSignUuid) {
          return x.company_id.id === 0
        }
        return x.company_id.id === this.currentCompanyId
      })
      if (index > -1) {
        return this.documentModel.signed_vendors[index].id
      }
      return null
    },
    loadCurrentSignatureFileAsBlob () {
      return new Promise((resolve) => {
        new SignatureProxy({ limit: 1, page: 1 }).getSignature().then((signatures) => {
          if (!signatures || signatures.length === 0) {
            resolve()
          } else {
            this.signatureModel = signatures[0]
            const fileId = this.signatureModel.file_id
            getFile({
              fileId,
              externalSignUuid:
              this.externalSignUuid
            }).then((blob) => {
              blob.arrayBuffer().then((res) => {
                resolve({ type: blob.type, arrayBuffer: res, blob })
              })
            })
          }
        })
      })
    },
    signDigitalOnFiles () {
      const vm = this
      return new Promise((resolve, reject) => {
        if (!vm.documentFiles || vm.documentFiles.length === 0) {
          resolve([])
          return
        }
        this.loadCurrentDeviceTokenSerialNumber().then((serialNumber) => {
          if (!serialNumber) {
            reject('User has not setup digital signature!')
            return
          }

          const actions = vm.getFormattedFileWithSignatures().filter(r => r.signatures).map(({ file, signatures }) => vm.digitalSignDocumentAsync(file, serialNumber, signatures))

          Promise.all(actions).then((res) => {
            resolve(res)
          }, (err) => {
            reject(err)
          })
        })
      })
    },
    loadCurrentDeviceTokenSerialNumber () {
      return new Promise((resolve) => {
        new CaSignProxy().getActiveCertificate('DEVICE_TOKEN').then((res) => {
          if (!res || res.length === 0) {
            resolve()
          } else {
            resolve(res[0].seri_number)
          }
        })
      })
    },
    loadSignatureMarkup () {
      const vm = this
      return new Promise((resolve) => {
        const width = !vm.isImageSign() ? 500 : 300
        const height = !vm.isImageSign() ? 100 : 300
        const x = !vm.isImageSign() ? 250 : 150
        const y = !vm.isImageSign() ? 60 : 150

        const canvas = document.createElement('canvas')
        canvas.setAttribute('width', `${width}px`)
        canvas.setAttribute('height', `${height}px`)
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, 300, 300)
        ctx.textAlign = 'center'
        ctx.font = '2.5rem Google Sans'
        ctx.fillStyle = '#009fe3'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#fff'
        ctx.fillText('Chữ ký của bạn', x, y)
        canvas.toBlob((blob) => {
          blob.arrayBuffer().then((res) => {
            resolve({ type: blob.type, arrayBuffer: res })
          })
        }, 'image/png')
      })
    },
    getFormattedFileWithSignatures () {
      const userSignaturePositions = this.getDocumentSignatures()
      return this.documentFiles.map((file) => {
        const signatures = userSignaturePositions.filter(s => s.file_id === file.id).map((s) => {
          const convertPxToInt = numberPx => parseInt(numberPx.replace('px', ''), 0)
          return {
            page: s.page,
            top: convertPxToInt(s.top),
            bottom: convertPxToInt(s.bottom),
            left: convertPxToInt(s.left),
            width: convertPxToInt(s.width),
            height: convertPxToInt(s.height)
          }
        })
        return {
          file,
          signatures
        }
      })
    },
    onClickDefaultImageSignature () {
      this.currentImageSignatureModel = this.defaultImageSignatureModel
      this.useDefaultImageSignature = true
    },
    signImageOnFiles (imageSignature) {
      const vm = this
      return new Promise((resolve, reject) => {
        if (!vm.documentFiles || vm.documentFiles.length === 0) {
          resolve([])
          return
        }
        if (!imageSignature) {
          reject('User has not setup image signature!')
          return
        }

        const actions = vm.getFormattedFileWithSignatures().filter(r => r.signatures && r.signatures.length > 0).map(({ file, signatures }) => vm.signDocumentAsync(file, imageSignature, signatures))

        Promise.all(actions).then((res) => {
          resolve(res)
        }, error => reject(error))
      })
    },
    digitalSignDocumentAsync (file, serialNumber, signaturePositionItems) {
      const vm = this
      return new Promise((resolve, reject) => {
        getFile({
          fileId: file.id,
          externalSignUuid: this.externalSignUuid
        }).then((pdfBytes) => {
          pdfBytes.arrayBuffer().then((buffer) => {
            const pdfFile = new File([buffer], file.name, {
              type: 'application/pdf'
            })
            let promise = new Promise((_resolve) => {
              _resolve({ file: pdfFile, fileId: file.id, bytes: buffer })
            })
            signaturePositionItems.forEach((sp) => {
              promise = promise.then(res => vm.digitalSignForSingleSignature(serialNumber, sp, res))
            })
            promise.then((res) => {
              resolve(res)
            },
            error => reject(error)
            )
          })
        })
      })
    },
    digitalSignForSingleSignature (serialNumber, signaturePosition, pdf) {
      return new Promise((resolve, reject) => {
        const payload = {
          serial_number: serialNumber,
          sign_pos: `${signaturePosition.left}x${signaturePosition.bottom}`,
          page_number: signaturePosition.page,
          reason: 'Digital sign',
          pdf_url: pdf.file
        }
        const uploadStatus = {}
        new CaSignProxy().sign(payload, uploadStatus).then((bytes) => {
          const newPdfFile = new File([bytes], pdf.file.name, {
            type: 'application/pdf'
          })
          resolve({ file: newPdfFile, fileId: pdf.fileId, bytes })
        }, () => {
          reject('Ký điện tử thất bại hãy kiểm tra kết nối USB-Token và mở phần mềm P-Invoice')
        })
      })
    },
    signDocumentAsync (file, imageSignature, signaturePositionItems) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.loadPdf(file).then((buffer) => {
          if (!signaturePositionItems) {
            const pdfFile = new File([buffer], file.name)
            resolve(pdfFile)
            return
          }
          PDFDocument.load(buffer).then((pdfDoc) => {
            const pages = pdfDoc.getPages()
            let embeddedImagePromise
            if (imageSignature.type === 'image/png') {
              embeddedImagePromise = pdfDoc.embedPng(imageSignature.arrayBuffer)
            } else {
              embeddedImagePromise = pdfDoc.embedJpg(imageSignature.arrayBuffer)
            }
            embeddedImagePromise.then((jpgImage) => {
              signaturePositionItems.forEach((s) => {
                const page = pages[s.page - 1]
                page.drawImage(jpgImage, {
                  x: s.left,
                  y: page.getHeight() - (s.top + s.height),
                  width: s.width,
                  height: s.height
                })
              })
              pdfDoc.save().then((pdfBytes) => {
                const newPdfFile = new File([pdfBytes], file.name, {
                  type: 'application/pdf'
                })
                resolve({ file: newPdfFile, fileId: file.id, bytes: pdfBytes })
              })
            })
          })
        }, error => reject(error))
      })
    },
    onSubmit (formModel) {
      const vm = this

      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          vm.formSubmitting = true
          if (this.isDigitalSign()) {
            vm.signDigital(formModel)
            return
          }

          // if (this.isHsmSign()) {
          //   vm.signHsm(formModel);
          //   return;
          // }

          if (this.isConfirmationSign()) {
            vm.signConfirmation(formModel)
            return
          }

          vm.signImage(formModel)
        }
      })
    },
    onSignSuccess () {
      this.formSubmitting = false
      this.$bus.emit('sign-document-success', this.documentModel.id)
      this.$modal.hide('document-approval-modal', { isOk: true })
    },
    submit () {
      this.$refs.form.submit()
    },
    reject () {
      const vm = this
      const formVm = this.$refs.form
      formVm.validate().then((isValid) => {
        if (isValid) {
          vm.rejectDocumentProxy(vm.getApprovalUserId(), formVm.getFieldValue('note')).then(() => {
            this.onSignSuccess()
          })
        }
      })
    },
    loadSignedPdf (fileId) {
      const vm = this
      const signedFile = this.inMemorySignedFiles.filter(r => r.fileId === fileId)
      if (signedFile.length > 0) {
        vm.pdfData = signedFile[0].bytes
        vm.pdfLoading = false
        vm.pdfDataSrc = URL.createObjectURL(new Blob([vm.pdfData], {
          type: 'application/pdf'
        }))
      }
    },
    loadFiles (listFileId) {
      const vm = this
      return new Promise((resolve) => {
        getFilesInfo(listFileId, vm.externalSignUuid).then((res) => {
          vm.documentFiles = res
          if (vm.documentFiles && vm.documentFiles.length > 0) {
            const fileId = vm.documentFiles[0].id
            vm.currentDisplayFile = vm.documentFiles[0]
            vm.currentFileId = fileId
            resolve(res)
            // vm.loadPdf(vm.currentDisplayFile).then((buffer) => { resolve(buffer); });
          }
        })
      })
    },
    loadPdf (fileInfo) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.pdfDataSrc = null
        getFile({
          fileId: fileInfo.id,
          externalSignUuid: this.externalSignUuid,
          onDownloadProgress: (progress) => {
            vm.loadingProgress = progress
          }
        }).then((pdfBytes) => {
          pdfBytes.arrayBuffer().then((buffer) => {
            vm.pdfData = buffer
            vm.pdfLoading = false
            vm.pdfDataSrc = URL.createObjectURL(new Blob([vm.pdfData], {
              type: 'application/pdf'
            }))
            resolve(buffer)
          })
        }, error => reject(error))
      })
    },
    onChangeFile (file, index) {
      const vm = this
      this.currentDisplayFile = file
      this.currentDisplayFileIndex = index
      this.currentFileId = vm.currentDisplayFile.id
      if (this.inMemorySignedFiles) {
        this.loadSignedPdf(this.currentFileId)
      } else {
        this.loadPdf(vm.currentDisplayFile)
      }
    },
    showProfileImageSignature () {
      this.loadingCurrentImageSignature = true
      this.loadCurrentSignatureFileAsBlob().then((res) => {
        if (res) {
          const urlCreator = window.URL || window.webkitURL
          this.imageSignatureUrl = urlCreator.createObjectURL(res.blob)
          this.loadingCurrentImageSignature = false
          this.currentImageSignatureModel = res
          this.defaultImageSignatureModel = res
        }
      })
    },
    onSelectImageSignature (selectedModel) {
      const file = selectedModel.signature_file
      const urlCreator = window.URL || window.webkitURL
      this.imageSignatureUrl = urlCreator.createObjectURL(file)
      this.readFileAsArrayBuffer(file).then((arrayBuffer) => {
        this.currentImageSignatureModel = { type: 'image/png', arrayBuffer }
      })
      this.useDefaultImageSignature = false
    },
    readFileAsArrayBuffer (fileInput) {
      return new Promise((resolve) => {
        const file = fileInput
        const fileReader = new FileReader()
        function fileReaderOnLoad () {
          const data = new Uint8Array(this.result)
          resolve(data)
        }
        fileReader.onload = fileReaderOnLoad
        fileReader.readAsArrayBuffer(file)
      })
    },
    openModal (modalName) {
      this.$modal.show(modalName, { model: {} })
    },
    signImage (formModel) {
      const vm = this
      if (!vm.currentImageSignatureModel) {
        ToastUtils.showToast('error', 'Chưa cấu hình chữ ký ảnh')
        vm.formSubmitting = false
        return
      }
      vm.signImageOnFiles(this.currentImageSignatureModel).then((response) => {
        const docFiles = response.map(r => r.file)
        const fileIds = JSON.stringify(response.map(r => r.fileId))
        vm.signByImageProxy({
          document_id: vm.documentModel.id,
          doc_approval_user_id: vm.getApprovalUserId(),
          doc_approval_partner_id: vm.getApprovalVendorId(),
          note: formModel.note,
          doc_files: docFiles,
          files_id_array: fileIds
        }).then(() => {
          this.onSignSuccess()
        }, () => {
          vm.formSubmitting = false
        })
      }, (msg) => {
        vm.formSubmitting = false
        ToastUtils.showToast('error', msg)
      })
    },

    getFileAndSignaturePostionForHsmSigning () {
      const vm = this
      return vm.getFormattedFileWithSignatures().map(({ file, signatures }) => ({
        file_id: file.id,
        signatures: signatures
          ? signatures.map(s => ({
            sign_pos: `${s.left}x${s.bottom}`,
            page_number: parseInt(s.page, 0) - 1
          }))
          : []
      }))
    },
    signHsm (formModel, signatureId) {
      const vm = this
      const fileInfos = vm.getFileAndSignaturePostionForHsmSigning()

      new SignatureProxy().signHsm(signatureId, {
        document_id: vm.documentModel.id,
        document_approval_user_id: vm.getApprovalUserId(),
        document_approval_partner_id: vm.getApprovalVendorId(),
        note: formModel.note,
        reason: formModel.note,
        files_id_array: fileInfos
      }, {}).then(() => {
        this.onSignSuccess()
      }, (msg) => {
        vm.formSubmitting = false
        ToastUtils.showToast('error', msg)
      })
      // new CaSignProxy().getActiveCertificate('HSM').then((response) => {
      //   if (!response || response.length === 0) {
      //     ToastUtils.showToast('error', 'Chứng thư Hsm chưa tồn tại hoặc chưa được kích hoạt');
      //     return;
      //   }
      //   const certificate = response[0];
      //   const fileInfos = vm.getFileAndSignaturePostionForHsmSigning();

      //   new SignatureProxy().signHsm(certificate.id, {
      //     document_id: vm.documentModel.id,
      //     document_approval_user_id: vm.getApprovalUserId(),
      //     document_approval_partner_id: vm.getApprovalVendorId(),
      //     note: formModel.note,
      //     reason: formModel.note,
      //     files_id_array: fileInfos,
      //   }, {}).then(() => {
      //     this.onSignSuccess();
      //   }, (msg) => {
      //     vm.formSubmitting = false;
      //     ToastUtils.showToast('error', msg);
      //   });
      // });
    },
    signUSBToken (formModel) {
      const vm = this
      this.$modal.show('dialog', {
        title: 'Kiểm tra kết nối USB-Token',
        text: 'Hãy chắc chắn rằng bạn đã kết nối USB-Token và mở phần mềm P-Invoice để thực hiện ký điện tử',
        onOk: () => {
          vm.signDigitalOnFiles().then((response) => {
            const docFiles = response.map(r => r.file)
            const fileIds = JSON.stringify(response.map(r => r.fileId))
            new SignatureProxy().signByImage({
              document_id: vm.documentModel.id,
              doc_approval_user_id: vm.getApprovalUserId(),
              doc_approval_partner_id: vm.getApprovalVendorId(),
              note: formModel.note,
              doc_files: docFiles,
              files_id_array: fileIds
            }, {}).then(() => {
              this.onSignSuccess()
            }, () => {
              vm.formSubmitting = false
            })
          }, (msg) => {
            vm.formSubmitting = false
            ToastUtils.showToast('error', msg)
          })
        }
      })
    },
    signDigital (formModel) {
      new CaSignProxy().getActiveCertificate().then((response) => {
        if (!response || response.length === 0) {
          ToastUtils.showToast('error', 'Chứng thư số chưa tồn tại hoặc chưa được kích hoạt')
          return
        }
        const certificate = response[0]
        if (certificate.ca_type === 'HSM') {
          this.signHsm(formModel, certificate.id)
        } else if (certificate.ca_type === 'DEVICE_TOKEN') {
          this.signUSBToken(formModel)
        }
      })
    },
    signConfirmation (formModel) {
      const vm = this
      new SignatureProxy().signConfirmation({
        document_id: vm.documentModel.id,
        doc_approval_user_id: vm.getApprovalUserId(),
        doc_approval_partner_id: vm.getApprovalVendorId(),
        note: formModel.note
      }, {}).then(() => {
        this.onSignSuccess()
      }, (msg) => {
        vm.formSubmitting = false
        ToastUtils.showToast('error', msg)
      })
    }
  },
  watch: {
    formSubmitting (value) {
      this.$emit('on-form-submitting', value)
    }
  }
}
</script>

<style scoped>
.selected-files {
  padding: 0;
  margin: 0;
}
.selected-files li {
  cursor: pointer;
  list-style: none;
  padding: .5rem;
  border: 1px solid #ccc;
  margin: 1rem 0;
  border-radius: 3px;
}
.selected-files li.active, .selected-files li:hover  {
  background: #DAECF9;
  border: 1px solid #DAECF9;
}
.selected-files li.active  {
  font-weight: bold;
  color: #225b87;
}

</style>
