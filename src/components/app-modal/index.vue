<template>
  <modal :name="name"
         @before-open="beforeOpen"
         @opened="opened"
         @before-close="beforeClose"
         :height="height"
         :delay="200"
         :width="width"
         :scrollable="scrollable"
         :min-height="600"
         :click-to-close="clickToClose"
         :pivot-y="0.2">
    <div class="modal-content" :class="{'hide-footer': hideFooter}">
      <header class="modal-header">
        <h5 v-if="!hideTitle" class="modal-title">{{title}}</h5>
        <div>
          <slot name="top-buttons"></slot>
          <button v-if="!hideCloseButton" type="button" aria-label="Close" class="close" @click="onClose">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.0001 23.8334C18.9832 23.8334 23.8334 18.9832 23.8334 13.0001C23.8334 7.01699 18.9832 2.16675 13.0001 2.16675C7.01699 2.16675 2.16675 7.01699 2.16675 13.0001C2.16675 18.9832 7.01699 23.8334 13.0001 23.8334Z" stroke="#575A5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.25 9.75L9.75 16.25" stroke="#575A5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.75 9.75L16.25 16.25" stroke="#575A5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </header>
      <div class="modal-body" :class="{'modal-body--overflow-hidden':overflowHidden}" :style="{maxHeight:maxHeightModalBody ? maxHeightModalBody+'vh' : '90vh'}">
        <slot v-if="params" :model="model"></slot>
      </div>
      <footer v-if="!hideFooter" class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="onCancel()">{{cancelText}}</button>
        <button v-if="!hideOkButton" type="button" class="btn" :class="okClass" @click="onOk()">{{okText}}</button>
      </footer>
    </div>
  </modal>
</template>

<script>

function isVisible (elem) {
  const clientRect = elem.getClientRects && elem.getClientRects().length
  return !!(elem.offsetWidth || elem.offsetHeight || clientRect)
}

export default {
  name: 'AppModal',
  props: {
    title: {
      type: String,
      default () {
        return this.name
      }
    },
    name: {
      type: String
    },
    okText: {
      type: String,
      default () {
        return this.$t('app.ok')
      }
    },
    okClass: {
      type: String,
      default: 'btn-primary'
    },
    cancelText: {
      type: String,
      default () {
        return this.$t('app.cancel')
      }
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    hideOkButton: {
      type: Boolean,
      default: false
    },
    hideTitle: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    overflowHidden: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    },
    width: {
      type: [String, Number],
      default: '600px'
    },
    height: {
      type: [String, Number],
      default: 'auto'
    },
    minHeight: {
      type: [Number],
      default: 0
    },
    maxHeightModalBody: {
      type: [String, Number],
      default: 0
    },
    submitOnEnter: {
      type: Boolean,
      default: true
    },
    clickToClose: {
      type: Boolean,
      default: false
    },
    escToClose: {
      type: Boolean,
      default: true
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      model: null,
      params: null,
      isLoaded: false,
      beforeCloseCb: null
    }
  },
  methods: {
    onKeyup (event) {
      if (event.key === 'Escape' && this.escToClose && document.activeElement.type !== 'file') {
        this.onCancel()
        return
      }
      const ENTER = 13
      if (!this.submitOnEnter || event.keyCode !== ENTER ||
            !this.params || !this.$options.isVisible(this.$el)) {
        return
      }
      const params = this.model || null
      this.$emit('on-ok', params)
    },
    beforeOpen (event) {
      if (!event.params) {
        return
      }
      this.model = event.params.model
      this.params = event.params
      window.addEventListener('keyup', this.onKeyup)
      this.$emit('before-open', this.params)
    },
    opened () {
      this.$emit('opened', this)
    },
    beforeClose (event) {
      this.$emit('before-close', event)
      window.removeEventListener('keyup', this.onKeyup)
    },
    onOk () {
      this.$emit('on-ok', this.model)
    },
    onCancel () {
      this.$modal.hide(this.name, { isCancel: true })
      this.$emit('on-cancel', this.model)
    },
    onClose () {
      this.$modal.hide(this.name)
      this.$emit('on-close', this.model)
    }
  },
  isVisible
}
</script>
