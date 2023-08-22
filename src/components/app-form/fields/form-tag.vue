<script>
import VueTagsInput from '@johmun/vue-tags-input'
import FormFieldMixins from '../form-field-mixin'

const isEqual = (tagList1, tagList2) => {
  if (tagList1.length !== tagList2.length) { return false }
  for (let i = 0; i < tagList1.length; i++) {
    if (tagList1[i].text !== tagList2[i].text) { return false }
  }
  return true
}

export default {
  name: 'FormTag',
  mixins: [FormFieldMixins],
  components: { VueTagsInput },
  props: {
    autocompleteItems: {
      type: Array,
      default () {
        return []
      }
    },
    addOnlyFromAutocomplete: {
      type: Boolean,
      default () {
        return false
      }
    },
    onTypingTag: Function
  },
  data () {
    return {
      initialValue: [],
      localValue: [],
      tag: ''
    }
  },

  mounted () {
    const emptyArray = []
    this.initialValue = this.value || emptyArray
    this.localValue = this.value || emptyArray
  },
  watch: {
    value (val) {
      this.localValue = val
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
      this.tag = value
      if (this.onTypingTag && typeof this.onTypingTag === 'function') {
        this.onTypingTag(value)
      }
      this.$emit('on-typing-tag', {}, { name: this.name, value: this.tag })
    },
    onTagsChanged (newTags) {
      this.localValue = newTags
      this.isDirty = true
      this.isChanged = !isEqual(this.initialValue, this.localValue)
      this.$emit('input', {}, { name: this.name, value: this.localValue })
    },
    renderField (h) {
      return h('vue-tags-input', {
        props: {
          tags: this.localValue,
          autocompleteItems: this.autocompleteItems,
          addOnlyFromAutocomplete: this.addOnlyFromAutocomplete,
          value: this.tag
        },
        domProps: { value: this.tag },
        attrs: {
          name: this.name,
          placeholder: this.$t(this.placeholder),
          disabled: typeof this.disabled === 'function' ? this.disabled() : this.disabled,
          readonly: this.readonly
        },
        class: {
          'is-invalid': this.isInvalid,
          'form-control-plaintext': this.readonly
        },
        on: {
          input: this.onInput,
          'tags-changed': this.onTagsChanged
        }
      })
    }
  }
}
</script>
