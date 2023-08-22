<template>
  <div v-if="isDisplay" class="custom-control custom-checkbox custom-control-inline" :class="{'nullable': allowNull}">
    <input :disabled="readonly" :id="name" type="checkbox" autocomplete="off" @change="onChange" :value="localValue" :checked="localValue" class="custom-control-input">
    <label :for="name" class="custom-control-label">
      {{label}}
    </label>
  </div>
</template>

<script>
import FormFieldMixins from '../form-field-mixin'

const no = { value: false }
const yes = { value: true }
const empty = { value: null }

yes.next = no
no.next = empty
empty.next = yes

function findCurrentNode (value) {
  if (value === true) {
    return yes
  }
  if (value === false) {
    return no
  }
  return empty
}

export default {
  name: 'FormCheckbox',
  props: {
    allowNull: {
      type: Boolean,
      default: false
    }
  },
  mixins: [FormFieldMixins],
  methods: {
    onChange ($event) {
      this.localValue = this.allowNull
        ? findCurrentNode(this.localValue).next.value
        : $event.target.checked
      this.isDirty = true
      this.isChanged = this.initialValue !== this.localValue
      this.$emit('input', $event, { name: this.name, value: this.localValue })
    }
  }
}
</script>
