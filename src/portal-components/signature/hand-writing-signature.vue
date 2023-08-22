<template>
  <div class="hand-writing-container">
    <div class="toolbar">
      <span class="desc">{{$t('signature.userCursorToDrawSignature')}}</span>
      <div class="tools">
        <div class="tool-1">
          <i @click="clear()" class="fal fa-eraser"></i>
        </div>
        <div class="color-tools">
          <i :class="{'is-active': currentColor === '#000000'}" @click="onChangeColor('#000000')" class="color color-black"></i>
          <i :class="{'is-active': currentColor === '#5084C2'}" @click="onChangeColor('#5084C2')" class="color color-blue"></i>
          <i :class="{'is-active': currentColor === '#5226D1'}" @click="onChangeColor('#5226D1')" class="color color-purple"></i>
        </div>
      </div>
    </div>
    <div @touchstart="onMouseDown"  @mousedown="onMouseDown" @touchmove="draw" @mousemove="draw" @mouseup="onMouseUp" @touchend="onMouseUp" class="draw-area">
      <canvas id="signature-canvas"></canvas>
      <div class="sign-placeholder">Ký tại đây</div>
    </div>
  </div>
</template>
<script>
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import AppLoading from '@/components/app-loading/'

export default {
  name: 'HandWritingComponent',
  components: {
    AppForm,
    AppModal,
    AppLoading
  },
  data () {
    return {
      isPainting: false,
      lineWidth: 5,
      currentColor: '#000000',
      canvasContext: null,
      canvasEl: null
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    setTimeout(() => {
      this.$nextTick(() => {
        this.canvasEl = this.$el.querySelector('#signature-canvas')
        this.drawContainerEl = this.$el.querySelector('.draw-area')
        this.canvasEl.width = this.drawContainerEl.clientWidth
        this.canvasEl.height = this.drawContainerEl.clientHeight
        this.canvasContext = this.canvasEl.getContext('2d')
        this.canvasContext.strokeStyle = '#000000'
      })
    }, 500)
  },
  beforeDestroy () {
  },
  methods: {
    getImage (fileName, mimeType) {
      return new Promise((resolve) => {
        this.canvasEl.toBlob((blob) => {
          const file = new File([blob], fileName, {
            type: mimeType
          })
          resolve(file)
        }, mimeType)
      })
    },
    onChangeColor (colorCode) {
      this.currentColor = colorCode
      this.canvasContext.strokeStyle = colorCode
    },
    clear () {
      this.canvasContext.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
    },
    draw (e) {
      e.preventDefault()
      if (!this.isPainting) {
        return
      }
      this.canvasContext.lineWidth = 3
      this.canvasContext.lineCap = 'round'
      const canvasPosition = this.canvasEl.getBoundingClientRect()
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY

      this.canvasContext.lineTo(clientX - canvasPosition.x, clientY - canvasPosition.y)
      this.canvasContext.stroke()
    },
    onMouseDown (e) {
      e.preventDefault()
      this.isPainting = true
      if (e.type === 'touchstart') {
        e.target.closest('.modal-body').style.touchAction = 'none'
        e.target.closest('.modal-body').style.overflow = 'hidden'
        document.querySelector('body').style.overscrollBehaviour = 'contain'
      }
    },
    onMouseUp (e) {
      this.isPainting = false
      this.canvasContext.stroke()
      this.canvasContext.beginPath()
      if (e.type === 'touchend') {
        e.target.closest('.modal-body').style.removeProperty('touch-action')
        e.target.closest('.modal-body').style.removeProperty('overflow')
        document.querySelector('body').style.removeProperty('overscroll-behaviour')
      }
    }
  }
}
</script>
<style lang="scss">
 .hand-writing-container .toolbar{
   display: flex;
   justify-content: space-between;
   align-items: center;
 }
 .draw-area {
   border-radius: 12px;
   background: #E6ECF4;
   height: 317px;
   margin: 2rem 0;
   border: 2px dashed #99B0D1;
   position: relative;
   @media screen and (max-width: 576px) {
     height: 200px;
   }
 }
 .sign-placeholder {
   position: absolute;
   width: 70%;
   text-align: center;
   font-size: 48px;
   color: #cccccc78;
   border-bottom: 2px solid #99c3ff59;
   top: 40%;
   left: 15%;
   user-select: none;
   @media screen and (max-width: 576px) {
     top: 25%;
     font-size: 36px;
   }
 }
 .tools {
   display: flex;
   justify-content: center;
   align-items: center;
 }
 .tool-1 {
   padding: 0 8px;
   border-right: 2px solid #ccc;
   margin: 0 8px;
 }
 .tools i:hover {
   cursor: pointer;
 }

 .toolbar .desc {
   @media screen and (max-width: 576px) {
     display: none;
   }
 }

 .color-tools .color {
   display: inline-block;
   height: 16px;
   width: 16px;
   border-radius: 50%;
 }
 .color-tools .color.is-active {
    border: 1px solid red;
 }
 .color-black {
   background: black;
 }
 .color-blue {
   background: #5084C2;
 }
 .color-purple {
   background: #5226D1;
 }
</style>
