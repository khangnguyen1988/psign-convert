<script>
import FormInput from './fields/form-input'
import FormCurrency from './fields/form-currency'
import FormCheckbox from './fields/form-checkbox'
import FormSelect from './fields/form-select'
import FormTag from './fields/form-tag'
import FormAutocomplete from './fields/form-autocomplete'
import FormMultiCheckbox from './fields/form-multi-checkbox'
import FormDatepicker from './fields/form-datepicker'
import FormTextarea from './fields/form-textarea'
import { createField, renderLayout, REF_FIELD_PREFIX } from './form-helper'

const IS_FORM_FIELD = key => key.indexOf(REF_FIELD_PREFIX) > -1

export default {
  name: 'AppForm',
  components: { FormInput, FormCurrency, FormCheckbox, FormSelect, FormTag, FormAutocomplete, FormMultiCheckbox, FormDatepicker, FormTextarea },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    schema: {
      type: [Array, Object],
      required: true
    },
    data: {
      type: Object
    },
    layout: {
      type: Object
    }
  },
  data () {
    return {
      submitting: false,
      submitFailed: false,
      submitSucceeded: false,
      changedFields: {},
      dirtyFields: {}
    }
  },
  computed: {
    values () {
      return this.getValues()
    },
    isChanged () {
      return Object.keys(this.changedFields).length > 0
    },
    isDirty () {
      return Object.keys(this.dirtyFields).some(k => this.dirtyFields[k])
    }
  },
  render (h) {
    const t = this
    const attrs = {
      autocomplete: 'off',
      ...t.$attrs
    }
    const children = []
    if (!this.layout) {
      if (Array.isArray(this.schema)) {
        for (let i = 0; i < this.schema.length; i++) {
          children.push(createField(h, this, this.schema[i], i))
        }
      } else {
        Object.keys(this.schema).forEach((name, index) => {
          children.push(createField(h, this, {
            name,
            ...this.schema[name]
          }, index))
        })
      }
    } else {
      children.push(renderLayout(h, this))
    }

    return h(
      'form', {
        class: { 'form-group': true },
        attrs,
        on: {
          submit: this.onSubmit
        }
      },
      children
    )
  },
  created () {},

  methods: {
    initialize (data) {
      this.setData(data)
      this.setPristine()
    },
    getFieldList () {
      return this.schema.map(f => f.name)
    },
    getValues () {
      const result = {}
      this.forEachFieldInstance((vm) => { result[vm.name] = vm.localValue })
      return result
    },
    onSubmit ($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.submit()
    },
    submit () {
      this.submitSucceeded = false
      this.submitFailed = false
      this.submitting = true
      this.$emit('on-submitting', true)
      const submitValue = Object.assign(this.data, this.getValues())
      const submitPromise = new Promise((resolve, reject) => this.$emit('on-submit', submitValue, this.validate, { resolve, reject }))

      submitPromise.then((response) => {
        this.initialize(response)
        this.submitSucceeded = true
        this.$emit('on-submit-success', response)
      })
        .catch((errors) => {
          this.$emit('on-submit-errors', errors)
          this.submitFailed = true
        })
        .finally(() => {
          this.submitting = false
          this.$emit('on-submitting', false)
        })
      return submitPromise
    },
    isValid () {
      return Object.keys(this.$refs)
        .filter(IS_FORM_FIELD)
        .every((key) => {
          const fieldVm = this.$refs[key]
          return fieldVm.validation ? fieldVm.formFields[fieldVm.name].valid : true
        })
    },
    validate () {
      const validateList = []
      this.forEachFieldInstance((vm) => {
        if (vm.validation && vm.isDisplay) {
          validateList.push(vm.$validator.validate(vm.name, vm.localValue))
        }
        if (vm.asyncValidation && vm.isDisplay) {
          const validateAsyncPromise = vm.validateAsync(this.values)
          vm.$validator.errors.remove(vm.name)
          validateAsyncPromise.then((res) => {
            if (typeof res === 'object') {
              vm.$validator.errors.add({
                field: vm.name,
                msg: res.msg
              })
            }
          })
          validateList.push(validateAsyncPromise)
        }
      })
      return new Promise((resolve) => {
        Promise.all(validateList).then((values) => {
          resolve(values.every(val => val && typeof val !== 'object'))
        })
      })
    },
    setPristine () {
      this.forEachFieldInstance(vm => vm.setPristine())
    },
    setFieldValue (fieldName, value) {
      try {
        const fieldVm = this.$refs[REF_FIELD_PREFIX + fieldName]
        fieldVm.setValue(value)
        fieldVm.$validator.validate(fieldName).then(() => {

        }).catch(e => {

        })
      } catch (e) {

      }
    },
    getFieldValue (fieldName) {
      const fieldVm = this.$refs[REF_FIELD_PREFIX + fieldName]
      return fieldVm.localValue
    },
    getField (fieldName) {
      const fieldVm = this.$refs[REF_FIELD_PREFIX + fieldName]
      return fieldVm
    },
    setData (data) {
      this.forEachFieldInstance(vm => vm.setValue(data[vm.name]))
    },
    reset () {
      this.forEachFieldInstance(vm => vm.reset())
    },
    onInput ($event, value) {
      this.$emit('on-input', $event, value)
    },
    onInputModified (modifiedInput) {
      if (modifiedInput.isChanged) {
        this.$set(this.changedFields, modifiedInput.field, modifiedInput.value)
      } else {
        this.$delete(this.changedFields, modifiedInput.field)
      }
    },
    onInputDirtyChanged (input) {
      this.$set(this.dirtyFields, input.field, input.isDirty)
    },
    forEachFieldInstance (callback) {
      Object.keys(this.$refs)
        .filter(IS_FORM_FIELD)
        .forEach(key => callback(this.$refs[key]))
    }
  }
}
</script>
