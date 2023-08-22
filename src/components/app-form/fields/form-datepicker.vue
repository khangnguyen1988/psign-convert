<script>
import DateTimeUtils from '@/utils/datetime'
import Vue from 'vue'
import FormFieldMixins from '../form-field-mixin'

function renderInput (h, vm) {
  const inputDirectives = []
  if (vm.validation) {
    inputDirectives.push({
      name: 'validate',
      value: vm.validation,
      expression: 'validation'
    })
  }
  return h('input', {
    props: {
      value: vm.inputTextDisplay
    },
    domProps: { value: vm.inputTextDisplay },
    attrs: {
      type: 'text',
      name: vm.name,
      placeholder: vm.$t(vm.placeholder),
      disabled: typeof vm.disabled === 'function' ? vm.disabled() : vm.disabled,
      readonly: vm.readonly
    },
    class: {
      'form-control': !vm.readonly,
      'is-invalid': vm.isInvalid,
      'form-control-plaintext': vm.readonly
    },
    on: {
      input: vm.onTextChanged,
      blur: vm.onTextBlur
    },
    directives: inputDirectives
  })
}

export default {
  name: 'FormDatepicker',
  mixins: [FormFieldMixins],
  components: { },
  props: {
  },
  data () {
    return {
      inputTextDisplay: ''
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
      const vm = this
      const current = new Date()
      this.localValue = value
      this.localValue.setHours(current.getHours())
      this.localValue.setMinutes(current.getMinutes())
      this.inputTextDisplay = DateTimeUtils.formatDate(this.localValue, Vue.$config.format.datePicker)
      this.isDirty = true
      this.isChanged = this.initialValue !== this.localValue
      this.$emit('input', {}, { name: vm.name, value: this.localValue })

      setTimeout(() => {
        if (vm.validation) {
          vm.$validator.validate(vm.name)
        }
      }, 100)
    },
    onTextChanged ($event) {
      this.inputTextDisplay = $event.target.value
    },
    onTextBlur ($event) {
      const beforeChangedValue = this.localValue
      const changedDate = DateTimeUtils.parseDate($event.target.value, Vue.$config.format.datePicker)
      this.localValue = changedDate.isValid() ? changedDate.toDate() : null
      this.inputTextDisplay = DateTimeUtils.formatDate(this.localValue, Vue.$config.format.datePicker)
      this.isDirty = true
      this.isChanged = this.initialValue !== this.localValue
      if (
      // eslint-disable-next-line eqeqeq
        DateTimeUtils.formatDate(beforeChangedValue, Vue.$config.format.datePicker) !=
          DateTimeUtils.formatDate(changedDate.toDate(), Vue.$config.format.datePicker)
      ) {
        this.$emit('input', {}, { name: this.name, value: this.localValue })
      }
    },
    renderField (h) {
      this.inputTextDisplay = DateTimeUtils.formatDate(this.localValue, Vue.$config.format.datePicker)
      if (this.readonly) {
        return renderInput(h, this)
      }
      return h('v-date-picker', {
        props: {
          value: this.localValue,
          popover: { positionFixed: true, visibility: 'click' },
          readonly: this.readonly
        },
        scopedSlots: {
          default: () => renderInput(h, this)
        },
        on: {
          input: this.onInput
        }
      })
    }
  }
}
</script>
