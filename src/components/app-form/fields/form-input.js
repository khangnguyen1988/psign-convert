import FormFieldMixins from '../form-field-mixin'

export default {
  name: 'FormInput',
  mixins: [FormFieldMixins],
  props: {
    inputType: {
      type: String,
      default: 'text'
    },
    renderSlot: {
      type: [Array, Boolean],
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localFilePath: ''
    }
  },
  render (h) {
    if (!this.isDisplay) {
      return h()
    }
    if (this.inputType === 'hidden') {
      return h(
        'div', {},
        [this.renderField(h), (this.validation || this.asyncValidation) ? this.renderErrorText(h) : null]
      )
    }
    return this.renderFormGroup(h)
  },
  methods: {
    onInput ($event) {
      if (this.inputType === 'file') {
        this.localFilePath = $event.target.value
        if ($event.target.files.length > 0) {
          this.localValue = this.multiple ? $event.target.files : $event.target.files[0]
        } else {
          this.localValue = null
        }
      } else {
        this.localValue = $event.target.value
      }
      this.isDirty = true
      this.isChanged = this.initialValue !== this.localValue
      this.$emit('input', $event, { name: this.name, value: this.localValue })
    },
    renderField (h) {
      const inputDirectives = []
      if (this.validation) {
        inputDirectives.push({
          name: 'validate',
          value: this.validation,
          expression: 'validation'
        })
      }
      const valueProps = this.inputType === 'file' ? this.localFilePath : this.localValue
      const attrs = {
        type: this.inputType,
        name: this.name,
        placeholder: this.$t(this.placeholder),
        disabled: typeof this.disabled === 'function' ? this.disabled() : this.disabled,
        readonly: this.readonly
      }
      if (this.inputType === 'file' && this.multiple) {
        attrs.multiple = true
      }

      return h('input', {
        domProps: { value: valueProps },
        attrs,
        class: {
          'form-control': !this.readonly,
          'is-invalid': this.isInvalid,
          'form-control-plaintext': this.readonly
        },
        on: {
          input: this.onInput
        },
        directives: inputDirectives
      })
    }
  }
}
