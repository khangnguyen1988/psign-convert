<script>
import FormFieldMixins from '../form-field-mixin'

export default {
  name: 'FormSelect',
  mixins: [FormFieldMixins],
  props: {
    options: {
      type: Array,
      default: []
    }
  },
  render (h) {
    if (!this.isDisplay) {
      return h()
    }
    return this.renderFormGroup(h)
  },
  methods: {
    onInput (value) {
      this.localValue = value
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
      return h('b-form-select', {
        props: {
          value: this.localValue,
          options: this.options
        },
        domProps: { value: this.localValue },
        attrs: {
          name: this.name,
          placeholder: this.$t(this.placeholder),
          disabled: this.readonly || (typeof this.disabled === 'function' ? this.disabled() : this.disabled)
        },
        class: {
          'is-invalid': this.isInvalid
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
