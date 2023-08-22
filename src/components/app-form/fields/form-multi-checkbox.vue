<template>
  <div style="height: auto" :class="className" class="form-group">
    <div>
      <label :for="name">{{label}}</label>
      <a v-if="labelAddOn" @click="labelAddOn.onClick()" href="javascript:" class="link-btn"><i :class="labelAddOn.icon"></i><span>{{labelAddOn.text}}</span></a>
    </div>
    <b-form-checkbox-group
      :id="name"
      v-model="localValue"
      :disabled="readonly"
      :options="options"
      :class="{'is-invalid': errors.has(`${name}`), 'item-display-block': itemDisplayBlock}"
      class="form-control multi-checkbox"
      @input="onInput"
    ></b-form-checkbox-group>
    <input v-if="validation" type="hidden"  :name="name" v-model="localValue" v-validate="'required'" />
    <div  v-if="validation" class="invalid-feedback text-right"> {{ errors.first(`${name}`) }} </div>
  </div>
</template>

<script>
import FormFieldMixins from '../form-field-mixin'

function isDifferent (listItem1, listItem2) {
  if (listItem1.length !== listItem2.length) {
    return true
  }
  for (let i = 0; i < listItem1.length; i++) {
    if (listItem1[i].toString() !== listItem2[i].toString()) {
      return true
    }
  }
  return false
}

export default {
  name: 'FormMultiCheckbox',
  props: {
    options: {
      type: Array,
      default: []
    },
    labelAddOn: {
      type: Object,
      default: null
    },
    itemDisplayBlock: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      initialValue: [],
      localValue: null
    }
  },
  render (h) {
    if (!this.isDisplay) {
      return h()
    }
    return this.renderFormGroup(h)
  },
  mixins: [FormFieldMixins],
  methods: {
    onInput (value) {
      this.localValue = value
      this.isDirty = true
      this.isChanged = isDifferent(this.initialValue, this.localValue)
      this.$emit('input', {}, { name: this.name, value: this.localValue })
    }
  }
}
</script>
