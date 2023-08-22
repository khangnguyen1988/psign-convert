function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

export default {
  name: 'FormFieldMixin',
  props: {
    name: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    labelSlot: {
      type: [Function],
      default: null
    },
    value: {
      type: [String, Array, Number, Boolean, Date, Object],
      default: ''
    },
    validation: {
      type: String
    },
    asyncValidation: {
      type: Function
    },
    disabled: {
      type: [Function, Boolean],
      default: false
    },
    display: {
      type: [Function, Boolean],
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    errorMsg () {
      return this.errors.first(this.name)
    },
    isInvalid () {
      return this.errors.has(this.name)
    },
    isDisplay () {
      if (isFunction(this.display)) {
        return this.display().bind(this)
      }
      return this.display
    }
  },
  data () {
    return {
      isDirty: false,
      isChanged: false,
      initialValue: null,
      localValue: null
    }
  },
  mounted () {
    this.initialValue = this.value
    this.localValue = this.value
  },
  methods: {
    validateAsync (formData) {
      return new Promise((resolve) => {
        this.asyncValidation(this.localValue, resolve, formData)
      })
    },
    setValue (value) {
      this.localValue = value
    },
    setPristine () {
      this.isDirty = false
      this.isChanged = false
      this.initialValue = this.localValue
    },
    reset () {
      this.localValue = this.initialValue
      this.setPristine()
      this.$emit('input', this.localValue)
    },
    renderLabel (h) {
      const childrenComponents = []
      if (this.labelSlot) {
        childrenComponents.push(this.labelSlot(h))
        return h('div', {}, [
          h('label', {
            attrs: { for: this.name },
            domProps: { innerText: this.$t(this.label) }
          }),
          ...childrenComponents
        ])
      }
      return h('label', {
        attrs: { for: this.name },
        domProps: { innerText: this.$t(this.label) }
      })
    },
    renderErrorText (h) {
      return h('span', {
        class: {
          'invalid-feedback': true,
          'is-invalid': this.isInvalid
        },
        domProps: { innerText: this.errorMsg },
        directives: [
          { name: 'show', rawName: 'v-show', value: this.isInvalid, expression: 'isInvalid' }
        ]
      })
    },
    renderShowPasswordIcon (h) {
      return h('span', {
        class: {
          'far fa-eye': true
        },
        on: {
          click: (e) => {
            const isHiddenText = e.target.classList.value.indexOf('fa-eye') > 0
            const disclosureText = e.target.classList.value.indexOf('fa-eye-slash') > 0
            if (isHiddenText) {
              e.target.classList.remove('fa-eye')
              e.target.classList.add('fa-eye-slash')
              e.target.parentElement.querySelector('input').setAttribute('type', 'text')
            }
            if (disclosureText) {
              e.target.classList.remove('fa-eye-slash')
              e.target.classList.add('fa-eye')
              e.target.parentElement.querySelector('input').setAttribute('type', 'password')
            }
          }
        }
      })
    },
    renderFormGroup (h) {
      const childrenComponents = [
        this.renderLabel(h),
        this.renderField(h)
      ]
      if (this.validation || this.asyncValidation) {
        childrenComponents.push(this.renderErrorText(h))
      }
      if (this.renderSlot) {
        this.renderSlot.forEach((vnode) => {
          childrenComponents.push(vnode)
        })
      }
      if (this.inputType === 'password') {
        childrenComponents.push(this.renderShowPasswordIcon(h))
      }

      return h(
        'div', { class: { 'form-group': true, 'input-password': this.inputType === 'password' } },
        childrenComponents
      )
    }
  },
  watch: {
    isChanged (newVal) {
      this.$emit('input-modified', {
        isChanged: newVal,
        field: this.name,
        value: {
          oldVal: this.initialValue,
          newVal: this.localValue
        }
      })
    },
    isDirty (newVal) {
      this.$emit('input-dirty-changed', {
        isDirty: newVal,
        field: this.name
      })
    }
  }
}
