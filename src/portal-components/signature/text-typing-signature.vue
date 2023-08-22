<template>
  <div class="typing-signature-container">
    <div class="toolbar">
      <span>{{$t('signature.createSignatureByName')}}</span>
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
    <div class="typing-area">
      <input :placeholder="$t('signature.inputYourName')" :class="{
        'font-family-cookie': fontFamily === 'Cookie',
        'font-family-sacramento': fontFamily === 'Sacramento',
        'font-family-squarePeg': fontFamily === 'SquarePeg',
        'font-family-pacifico': fontFamily === 'Pacifico',
        'text-color-black': currentColor === '#000000',
        'text-color-blue': currentColor === '#5084C2',
        'text-color-purple': currentColor === '#5226D1',
      }" type="text" name="typing-input" v-model="typingInputValue" />
    </div>
    <div>
      {{$t('signature.chooseStyle')}}
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div @click="fontFamily = 'Cookie'" :class="{active: fontFamily === 'Cookie'}" class="typing-signature-output style-1">
          <span class="selection-bullet"></span>
          <canvas class="typing-signature-canvas" id="signature-style-Cookie"></canvas>
        </div>
      </div>
      <div class="col-lg-6">
        <div @click="fontFamily = 'Sacramento'" :class="{active: fontFamily === 'Sacramento'}" class="typing-signature-output style-2">
          <span class="selection-bullet"></span>
          <canvas class="typing-signature-canvas" id="signature-style-Sacramento"></canvas>
        </div>
      </div>
      <div class="col-lg-6">
        <div @click="fontFamily = 'SquarePeg'" :class="{active: fontFamily === 'SquarePeg'}" class="typing-signature-output style-3">
          <span class="selection-bullet"></span>
          <canvas class="typing-signature-canvas" id="signature-style-SquarePeg"></canvas>
        </div>
      </div>
      <div class="col-lg-6">
        <div @click="fontFamily = 'Pacifico'" :class="{active: fontFamily === 'Pacifico'}" class="typing-signature-output style-4">
          <span class="selection-bullet"></span>
          <canvas class="typing-signature-canvas" id="signature-style-Pacifico"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'TextTypingComponent',
  components: {},
  data () {
    return {
      typingInputValue: '',
      isPainting: false,
      lineWidth: 5,
      currentColor: '#000000',
      fontFamily: 'Cookie',
      canvasContext: null,
      canvasEl: null
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.drawCanvasInputs(' ')
    })
    setTimeout(() => {
      this.$nextTick(() => {
        this.drawCanvasInputs(this.$t('signature.yourSignature'))
      })
    }, 300)
  },
  beforeDestroy () {
  },
  watch: {
    typingInputValue (value) {
      if (value) {
        this.drawCanvasInputs(value)
      }
    }
  },
  methods: {
    getImage (fileName, mimeType) {
      const canvas = this.$el.querySelector(`#signature-style-${this.fontFamily}`)
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const file = new File([blob], fileName, {
            type: mimeType
          })
          resolve(file)
        }, mimeType)
      })
    },
    drawCanvasInputs (inputText) {
      this.canvasElements = this.$el.querySelectorAll('.typing-signature-canvas')
      this.canvasElements.forEach((el) => {
        const ctx = el.getContext('2d')
        ctx.clearRect(0, 0, 300, 300)
        const fontFamily = el.id.replace('signature-style-', '')
        ctx.textAlign = 'center'
        ctx.font = `2.5rem ${fontFamily}`
        ctx.fillText(inputText, 150, 80)
      })
    },
    onChangeColor (colorCode) {
      this.currentColor = colorCode
    },
    clear () {
      this.canvasContext.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
    },
    draw (e) {
      if (!this.isPainting) {
        return
      }
      this.canvasContext.lineWidth = 3
      this.canvasContext.lineCap = 'round'
      const canvasPosition = this.canvasEl.getBoundingClientRect()
      this.canvasContext.lineTo(e.clientX - canvasPosition.x, e.clientY - canvasPosition.y)
      // console.log(e.clientX - this.canvasEl.offsetLeft, e.clientY - this.canvasEl.offsetTop);
      this.canvasContext.stroke()
    },
    onMouseDown () {
      this.isPainting = true
    },
    onMouseUp () {
      this.isPainting = false
      this.canvasContext.stroke()
      this.canvasContext.beginPath()
    }
  }
}
</script>
<style>
 .typing-signature-container .toolbar{
   display: flex;
   justify-content: space-between;
   align-items: center;
 }
 .typing-signature-output {
   display: flex;
   border-radius: 4px;
   background: #E6ECF4;
   height: 100px;
   margin: 1rem 0;
   border: 1px dashed #99B0D1;
   position: relative;
 }
 .typing-area {
   text-align: center;
   padding: 2rem 3rem 2rem 3rem;
 }
 .typing-area input {
   width: 80%;
   border: none;
   border-bottom: 2px solid #6689BA;
   font-size: 2.5rem;
   text-align: center;
 }
 .typing-area input:focus {
  outline: none;
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

 .selection-bullet {
   width: 16px;
   height: 16px;
   border: 1px solid #555;
   background: transparent;
   display: block;
   border-radius: 50%;
   align-self: center;
   margin: 0 0.5rem;
 }
 .active .selection-bullet {
   background: #555;
 }
 .tools i:hover {
   cursor: pointer;
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
 .text-color-black {
   color: black;
 }
 .text-color-blue {
   color:#5084C2;
 }
 .text-color-purple {
   color: #5226D1;
 }
 .font-family-cookie {
   font-family: 'Cookie';
 }
 .font-family-sacramento {
   font-family: 'Sacramento';
 }
 .font-family-squarePeg {
   font-family: 'SquarePeg';
 }
 .font-family-pacifico {
   font-family: 'Pacifico';
 }
</style>
