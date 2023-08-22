<script>
import FormFieldMixins from '../form-field-mixin'

export default {
  name: 'FormTextarea',
  mixins: [FormFieldMixins],
  props: {
    rows: {
      type: [Number, String],
      default () {
        return 3
      }
    }
  },
  render (h) {
    if (!this.isDisplay) {
      return h()
    }
    return this.renderFormGroup(h)
  },
  methods: {
    onInput ($event) {
      this.localValue = $event.target.value
      this.isDirty = true
      this.isChanged = this.initialValue !== this.localValue
      this.$emit('input', {}, { name: this.name, value: this.localValue })
    },
    renderField (h) {
      const directives = []
      if (this.validation) {
        directives.push({
          name: 'validate',
          value: this.validation,
          expression: 'validation'
        })
      }
      return h('textarea', {
        domProps: { value: this.localValue },
        attrs: {
          name: this.name,
          placeholder: this.$t(this.placeholder),
          disabled: typeof this.disabled === 'function' ? this.disabled() : this.disabled,
          readonly: this.readonly,
          rows: this.rows
        },
        class: {
          'form-control': !this.readonly,
          'is-invalid': this.isInvalid,
          'form-control-plaintext': this.readonly
        },
        on: {
          input: this.onInput
        },
        directives
      })
    }
  }
}
</script>
