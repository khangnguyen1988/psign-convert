<template>
  <div :id="elementId"></div>
</template>

<script>
const clientKey = process.env.ADOBE_CLIENT_KEY

export default {
  name: 'AdobePdfViewer',
  components: {},
  props: {
    elementId: [String, Number],
    src: String,
    comment: String,
    fileName: String,
    loading: Boolean,
    allowComment: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  mounted () {
    this.loadPdf()
  },
  beforeDestroy () {

  },
  computed: {
  },
  methods: {
    parseComments () {
      try {
        return JSON.parse(this.comment)
      } catch (e) {
        return null
      }
    },
    loadPdf () {
      const vm = this
      setTimeout(() => {
        this.$nextTick(() => {
          const adobeDCView = new window.AdobeDC.View({ clientId: clientKey, divId: this.elementId })
          const previewFilePromise = adobeDCView.previewFile({
            content: { location: { url: this.src } },
            metaData: { fileName: this.fileName, id: `adobe-viewer-${this.elementId}` }
          }, {
            enableAnnotationAPIs: true,
            includePDFAnnotations: true
          })
          const comments = vm.parseComments()
          if (comments) {
            previewFilePromise.then(adobeViewer => {
              adobeViewer.getAnnotationManager().then(annotationManager => {
                annotationManager.addAnnotationsInPDF(comments)
              })
            })
          }
          adobeDCView.registerCallback(
            /* eslint-disable no-undef */
            AdobeDC.View.Enum.CallbackType.SAVE_API,
            (metaData, content, options) =>
              /* Add your custom save implementation here...and based on that resolve or reject response in given format */
              new Promise((resolve, reject) => {
                previewFilePromise.then(adobeViewer => {
                  adobeViewer.getAnnotationManager().then(annotationManager => {
                    annotationManager.getAnnotations({})
                      .then(_comments => {
                        vm.$emit('save', {
                          resolve,
                          reject,
                          comments: _comments,
                          metaData,
                          content,
                          options
                        })
                      })
                      .catch(error => console.info(error))
                  })
                })
              }), {
              autoSaveFrequency: 0,
              enableFocusPolling: false,
              showSaveButton: true
            })
        })
      }, 200)
    }
  },
  watch: {
    src () {
      if (this.src) {
        this.loadPdf()
      }
    }
  }
}
</script>
