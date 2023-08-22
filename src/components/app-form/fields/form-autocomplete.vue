<script>
import AppAutoComplete from '@/components/app-autocomplete/'
import FormFieldMixins from '../form-field-mixin'

export default {
  name: 'FormAutoComplete',
  mixins: [FormFieldMixins],
  components: { AppAutoComplete },
  props: {
    renderItemText: Function,
    fetchSuggestions: Function,
    displayAttribute: {
      type: String,
      default: 'text'
    },
    suggestions: {
      type: Array,
      default () {
        return []
      }
    },
    minSearchTextLength: {
      type: Number,
      default: 1
    },
    maxSuggestionItems: {
      type: Number,
      default: 25
    },
    inputSize: {
      type: String,
      default: 'M'
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
    onSelected ($event, value) {
      this.localValue = value
      this.isDirty = true
      this.isChanged = this.initialValue !== this.localValue
      this.$emit('selected', {}, { name: this.name, value: this.localValue })
    },
    clear () {
      this.$refs.autocomplete.clear()
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

      const autocomplete = h('app-auto-complete', {
        props: {
          ...this.$props
        },
        domProps: { value: this.localValue },
        ref: 'autocomplete',
        attrs: {
          size: 'm',
          placeholder: this.$t(this.placeholder),
          disabled: typeof this.disabled === 'function' ? this.disabled() : this.disabled,
          readonly: this.readonly
        },
        class: {
          'is-invalid': this.isInvalid,
          'form-control-plaintext': this.readonly
        },
        on: {
          selected: this.onSelected
        }
      })

      const hiddenInput = h('input', {
        domProps: { value: this.localValue },
        attrs: {
          type: 'hidden',
          name: this.name
        },
        on: {
          input: this.onInput
        },
        directives
      })

      return h('div', {
        class: {
          'is-invalid': this.isInvalid
        }
      }, [
        autocomplete,
        hiddenInput
      ])
    }
  }
}
</script>
