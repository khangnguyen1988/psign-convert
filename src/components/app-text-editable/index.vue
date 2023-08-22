<template>
  <div>
    <p class="dotted-box font-italic" v-if="!isEdit" @click="onEdit()" v-html="displayText">
    </p>
    <div class="text-right" v-if="footerText && !isEdit">
      <small class="text-muted">
        <cite :title="footerText">{{footerText}}</cite>
      </small>
    </div>
    <div  v-if="isEdit">
      <b-form-textarea class="text-editable form-control"
                       v-model="value"
                       :placeholder="textDescription"
                       :rows="3"
                       :max-rows="6">
      </b-form-textarea>
      <div class="editable-buttons">
        <button @click="onSave()" class="btn btn-sm btn-primary" type="button"
        >
          <i class="fal fa-check"></i>
        </button>
        <button @click="onCancel()" class="btn btn-sm btn-secondary" type="button">
          <i class="fal fa-times-circle"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppModal from '@/components/app-modal/'

export default {
  name: 'AppTextEditModal',
  components: {
    AppModal
  },
  props: {
    text: {
      type: String,
      default: '',
      required: true
    },
    footerText: {
      type: String,
      default: ''
    },
    textDescription: {
      type: String,
      default: 'Click here to edit content'
    }
  },
  computed: {
    displayText () {
      return this.value || this.textDescription
    }
  },
  data () {
    return {
      value: '',
      isEdit: false
    }
  },
  created () {
    this.value = this.text
  },
  methods: {
    onEdit () {
      this.isEdit = true
      this.value = this.value.replace(/<br>/g, '\r\n')
      this.$nextTick(() => {
        this.$el.querySelector('.text-editable').focus()
      })
    },
    onCancel () {
      this.value = this.text
      this.isEdit = false
    },
    onSave () {
      this.isEdit = false
      this.value = this.value.replace(/(?:\r\n|\r|\n)/g, '<br>')
      this.$emit('on-save', this.value)
    }
  }
}
</script>
<style scoped>
  .dotted-box {
    border: 1px dotted #ccc;
    padding: 0.5rem;
    white-space: pre-line;
    margin: 0;
  }
  .editable-buttons {
    text-align: right;
    padding: 0.5rem 0;
  }
</style>
