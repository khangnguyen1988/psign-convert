<template>
  <div class="pdf-viewer-container">
    <transition name="opacity">
      <div v-if="loading" class="loading-container center">
        <div class="text-center">
          <h5>{{ $t("app.loading") }}</h5>
          <div class="loading-logo">
            <div class="loading-circle"></div>
          </div>
        </div>
      </div>
    </transition>
    <div v-if="pdfInstance && !loading" class="pdf-toolbar">
      <a @click="prevPage()" href="javascript:">
        <i class="fal fa-arrow-circle-up"></i>
      </a>
      <span>
        <input
          class="pageInput"
          type="text"
          :value="currentPage"
          @input="changePageInput"
        />
        / {{ pdfInstance.numPages }}</span
      >
      <a @click="nextPage()" href="javascript:">
        <i class="fal fa-arrow-circle-down"></i>
      </a>
      <span class="divide"></span>
      <a @click="download()" href="javascript:"
        ><i class="fal fa-download"></i
      ></a>
    </div>
    <div v-show="!loading" class="pdf-viewer-wrapper">
      <canvas class="pdf-viewer"></canvas>
      <!--      <div class="signature-frame"></div>-->
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min'
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.entry'
import { getColorClass } from '@/utils/document'

export default {
  name: 'PdfViewer',
  components: {},
  props: {
    fileId: [String, Number],
    pdfData: [Uint8Array, ArrayBuffer],
    src: String,
    loading: Boolean,
    scale: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      documentIds: [],
      currentDocument: null,
      currentPage: 1,
      pdfInstance: null,
      offsetX: null,
      offsetY: null
    }
  },
  mounted () {
    this.$bus.on('insert-signature', this.onInsertSignature)
    this.$bus.on('remove-user-signatures', this.removeUserSignatures)
    this.render()
  },
  beforeDestroy () {
    this.$bus.off('insert-signature')
    this.$bus.off('remove-user-signatures')
  },
  computed: {
    base64RawContent () {
      return this.src
    }
  },
  methods: {
    reset () {
      this.documentIds = []
      this.currentDocument = null
      this.currentPage = 1
      this.offsetX = null
      this.offsetY = null
      $('.signature-container').remove()
    },
    addSignature (signatureModel) {
      this.onInsertSignature(signatureModel)
    },
    removeUserSignatures (userId) {
      $(`.signature-container.user-id-${userId}`).remove()
    },
    removeEmailUserSignatures (email) {
      $(`.signature-container[data-email="${email}"]`).remove()
    },
    createSignatureEl (options) {
      const top = isNaN(options.top) ? options.top : `${options.top}px`
      const left = isNaN(options.left) ? options.left : `${options.left}px`
      const width = isNaN(options.width) ? options.width : `${options.width}px`
      const height = isNaN(options.height)
        ? options.height
        : `${options.height}px`
      const backgroundClass = getColorClass(options.email || options.name)

      const $el = $(`
            <div class="signature-container user-id-${options.userId} ${backgroundClass}"
                data-doc-id="${options.docId}"
                data-doc-index="${options.docIndex}"
                data-page="${options.page}"
                data-user-id="${options.userId}"
                data-email="${options.email}"
                style="position: absolute; top: ${top}; left: ${left}; width:${width}; height:${height}">
                <div class="signature-body" style=" width: 100%;height: 100%; position: relative">
                   <span class="icon close-icon" style=" position: absolute; top: -16px; right: -8px">
                      <i class="fal fa-times" style="color: red; font-weight: bold; font-size: 10px"></i>
                  </span>
                 <!-- <img width="100%" height="100%" src="https://media.geeksforgeeks.org/wp-content/uploads/20190529122828/bs21.png" />-->
                    <div class="user-signature" style="color: white; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; font-size: .8rem; word-break: break-all" data-user-id="${options.userId}">
                        <span>${options.name}</span>
                    </div>
                  <span class="icon resize-icon" style="position: absolute; bottom: -16px; right: -8px;">
                      <i class="fal fa-expand-alt" style="    font-size: 12px;font-weight: bold;transform: rotateZ(90deg);"></i>
                  </span>
                </div>
            </div>
      `)
      this.registerEvents($el)

      return $el
    },
    registerEvents ($el) {
      const vm = this
      const $signature = $el.find('.user-signature')
      const $resizeIconBtn = $el.find('.resize-icon')
      const $closeIconBtn = $el.find('.close-icon')
      $signature.on('mousedown', e => {
        $el.data('offset', [e.offsetX, e.offsetY])
        $el.data('moveable', true)
      })
      $resizeIconBtn.on('mousedown', () => {
        $el.data('resize', true)
      })
      $closeIconBtn.on('click', () => {
        const data = {
          docId: $el.data('docId'),
          page: $el.data('page'),
          userId: $el.data('userId'),
          email: $el.data('email')
        }
        $el.remove()
        vm.$bus.emit('remove-signature', data)
      })
      $el.on('mousedown', () => {
        $('.signature-container').removeClass('active')
        $el.addClass('active')
      })

      document.addEventListener(
        'mouseup',
        () => {
          $el.data('moveable', false)
          $el.data('resize', false)
        },
        true
      )

      document.addEventListener(
        'mousemove',
        e => {
          e.preventDefault()
          const isMoveable = $el.data('moveable')
          const isResize = $el.data('resize')
          const offset = $el.data('offset')
          if (isMoveable) {
            const { left, top, width, height } = $el
              .closest('.signature-frame')[0]
              .getBoundingClientRect()
            let newTopPosition = e.clientY - top - offset[1]
            let newLeftPosition = e.clientX - left - offset[0]
            const MAX_TOP = height - $el.height()
            const MAX_LEFT = width - $el.width()
            if (newTopPosition > MAX_TOP) {
              newTopPosition = MAX_TOP
            }
            if (newLeftPosition > MAX_LEFT) {
              newLeftPosition = MAX_LEFT
            }
            $el.css({
              top: newTopPosition < 0 ? 0 : newTopPosition,
              left: newLeftPosition < 0 ? 0 : newLeftPosition
            })
          }
          if (isResize) {
            const { left, top } = $el[0].getBoundingClientRect()
            $el.css({
              width: e.clientX - left,
              height: e.clientY - top
            })
          }
        },
        true
      )
    },
    onInsertSignature (signatureModel) {
      const page = signatureModel.page || this.currentPage
      const documentId = signatureModel.documentId || this.currentDocument
      const signatureFrameEl = this.$el.querySelector(
        `.signature-frame.page-${page}.file-${documentId}`
      )
      const $el = this.createSignatureEl({
        ...signatureModel,
        page,
        docId: signatureModel.docId || this.currentDocument,
        docIndex:
          signatureModel.docIndex ||
          this.documentIds.indexOf(this.currentDocument) + 1
      })
      signatureFrameEl.appendChild($el[0])

      document.addEventListener('mousedown', e => {
        if (!$(e.target).closest('.signature-container').length) {
          $('.signature-container').removeClass('active')
        }
      })
    },
    prevPage () {
      if (this.currentPage <= 1) {
        return
      }
      this.currentPage--
      this.displayPage(this.pdfInstance, this.currentPage)
    },
    changePageInput ($event) {
      const page = parseInt($event.target.value, 0)
      if (!isNaN(page)) {
        this.currentPage = page
      }
      if (page < 1) {
        this.currentPage = 1
      }
      if (page > this.pdfInstance.numPages) {
        this.currentPage = this.pdfInstance.numPages
      }
      this.displayPage(this.pdfInstance, this.currentPage)
    },
    nextPage () {
      if (this.currentPage >= this.pdfInstance.numPages) {
        return
      }
      this.currentPage++
      this.displayPage(this.pdfInstance, this.currentPage)
    },
    download () {
      const blob = new Blob([this.pdfData], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `document-${this.fileId}.pdf`
      link.click()
    },
    renderPage (page) {
      const scale = this.pdfScale // render with global pdfScale variable
      const viewport = page.getViewport({ scale })
      const canvas = this.$el.querySelector('.pdf-viewer')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderContext = {
        canvasContext: context,
        viewport
      }
      page.render(renderContext)
    },
    displayPage (pdf, num) {
      return new Promise(resolve => {
        pdf.getPage(num).then(page => {
          this.renderPage(page)
          const numberOfPages = this.pdfInstance.numPages
          for (let i = 1; i < numberOfPages + 1; i++) {
            const currentSignatureFrame = $(
              `.signature-frame.page-${i}.file-${this.currentDocument}`
            )
            if (i !== this.currentPage) {
              currentSignatureFrame.hide()
            } else {
              currentSignatureFrame.show()
            }
          }
          resolve(true)
        })
      })
    },
    calculateSignatureFramePostion () {
      const pdfViewerEl = this.$el.querySelector('.pdf-viewer')
      const $signatureFrameEl = $(
        `.signature-frame.file-${this.currentDocument}`
      )
      const pdfViewerWrapper = this.$el.querySelector('.pdf-viewer-wrapper')
      $signatureFrameEl.css({
        width: `${pdfViewerEl.width}px`,
        height: `${pdfViewerEl.height}px`
      })
      this.currentFrameEl = $signatureFrameEl
      if (pdfViewerEl.clientWidth < pdfViewerWrapper.clientWidth) {
        $signatureFrameEl.css({
          left: `${(pdfViewerWrapper.clientWidth - pdfViewerEl.clientWidth) /
            2}px`
        })
      }
    },
    renderSignatureFrame () {
      const numberOfPages = this.pdfInstance.numPages

      const DOCUMENT_DOES_NOT_RENDER_YET =
        $(`.signature-frame.file-${this.currentDocument}`).length === 0

      const documentIndex = this.documentIds.indexOf(this.currentDocument) + 1
      $('.signature-frame').hide()
      if (DOCUMENT_DOES_NOT_RENDER_YET) {
        for (let i = 0; i < numberOfPages; i++) {
          const $frameEl = $(
            `<div class="signature-frame file-${this.currentDocument} page-${i +
              1}" data-document-index="${documentIndex}" data-page="${i +
              1}"></div>`
          )
          if (i !== this.currentPage - 1) {
            $frameEl.hide()
          }
          $('.pdf-viewer-wrapper').append($frameEl)
        }
      } else {
        $(
          `.signature-frame.file-${this.currentDocument}.page-${this.currentPage}`
        ).show()
      }
      setTimeout(() => {
        this.calculateSignatureFramePostion()
      }, 100)
    },
    render () {
      const vm = this
      if (!vm.pdfData) {
        return
      }
      vm.pdfScale = vm.scale
      vm.currentPage = 1
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker
      // Using DocumentInitParameters object to load binary data.
      const loadingTask = pdfjsLib.getDocument({ data: vm.pdfData })
      loadingTask.promise.then(
        pdf => {
          vm.pdfInstance = pdf
          vm.currentDocument = vm.fileId || pdf.fingerprint
          if (
            vm.documentIds.findIndex(id => id === vm.currentDocument) === -1
          ) {
            vm.documentIds.push(vm.currentDocument)
          }
          vm.displayPage(pdf, vm.currentPage).then(() => {
            vm.renderSignatureFrame()
          })
        },
        () => {
          // PDF loading error
          // console.error(reason);
        }
      )
    },
    getSignaturePositions () {
      const result = []
      const convertPxToInt = numberPx =>
        parseInt(numberPx.replace('px', ''), 0)
      function getSignatureInfo () {
        const pageHeight = $(this)
          .closest('.signature-frame')
          .innerHeight()
        const docId = $(this).data('doc-id')
        const docIndex = $(this).data('doc-index')
        const page = $(this).data('page')
        const userId = $(this).data('user-id')
        const email = $(this).data('email')
        const styles = $(this).attr('style')
        const signatureInfo = { docId, docIndex, page, userId, email }
        styles.split(';').forEach(s => {
          const style = $.trim(s).split(':')
          const key = $.trim(style[0])
          const value = $.trim(style[1])
          if (key) {
            signatureInfo[key] = value
          }
        })
        const top = convertPxToInt(signatureInfo.top)
        const height = convertPxToInt(signatureInfo.height)
        const bottom = pageHeight - (top + height)
        signatureInfo.bottom = `${bottom < 0 ? 0 : bottom}px`
        result.push(signatureInfo)
      }
      $('.signature-container').each(getSignatureInfo)
      return result
    }
  },
  watch: {
    pdfData () {
      if (this.pdfData) {
        this.render()
      }
    }
  }
}
</script>
<style lang="scss">
.pageInput {
  width: 30px;
  height: 26px;
  border-radius: 5px;
  padding-left: 2px;
  text-align: right;
  background-color: rgb(44, 44, 44);
  color: white;
}
.signature-container span.icon {
  font-size: 12px;
  display: none;
  caret-color: transparent;
}
.signature-container {
  border: 2px solid;
  border-radius: 4px;
  font-weight: bold;
}

.signature-container.active {
  border: 3px dashed #0268b7;
}

.signature-container.active span.icon {
  display: inline-block;
}

.signature-container span.icon:hover {
  cursor: pointer;
}

.signature-container:hover span.icon {
  display: inline-block;
}

.divide {
  border-left: 1px solid #fff;
  width: 1px;
  height: 1.25rem;
  margin: 0 0.5rem;
}

.pdf-toolbar {
  background: rgb(44, 44, 44);
  color: #fff;
  border-radius: 4px;
}

.pdf-toolbar,
.pdf-viewer,
.pdf-viewer-container {
  text-align: center;
}

.pdf-toolbar,
.pdf-toolbar a {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pdf-toolbar a {
  margin: 0.75rem;
}

.pdf-toolbar a i {
  font-size: 1.25rem;
  color: #fff;
}

.pdf-viewer-container {
  height: 100%;
  background: #cccccc45;
  border-radius: 6px;
}
.pdf-viewer-wrapper {
  overflow: auto;
  max-height: 70vh;
  position: relative;
}

.signature-frame {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}
</style>
