import FormFieldMixins from '../form-field-mixin'

// eslint-disable-next-line no-unused-vars
function formatCurrency (amount) {
  amount = parseInt(amount, 0)
  if (isNaN(amount)) {
    return ''
  }
  return amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1,')
}

export default {
  name: 'FormCurrency',
  mixins: [FormFieldMixins],
  props: {
    className: {
      type: String,
      default: ''
    },
    inputType: {
      type: String,
      default: 'number'
    },
    renderSlot: {
      type: [Array, Boolean],
      default: false
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

      const span = h('span', { class: { 'currency-text-display': true, 'd-none': !this.localValue } }, formatCurrency(this.localValue))
      const input = h('input', {
        domProps: { value: this.localValue },
        attrs: {
          type: 'number',
          name: this.name,
          placeholder: this.$t(this.placeholder),
          disabled: typeof this.disabled === 'function' ? this.disabled() : this.disabled,
          readonly: this.readonly
        },
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

      return h('div', { class: { 'input-currency-wrapper': true } }, [
        input,
        span
      ])
    }
  }
}
