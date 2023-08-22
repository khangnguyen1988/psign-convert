<template>
  <form @submit.prevent="submit()" class="form-inline app-search-box">
    <input :id="id"
           :readonly="readonly"
           :disabled="disabled"
           :placeholder="placeholder"
           autocomplete="off"
           type="text"
           :value="value"
           ref="searchText"
           @keyup="keyUpHandler($event)"
           @keydown="keyDownHandler($event)"
           @input="changeValue($event.target.value)"
           @focusin="onFocusIn($event)"
           @focusout="onFocusOut($event)"
           class="form-control search-content"
          :class="formSize">
      <span class="search-icon">
        <i v-if="value.length === 0" aria-hidden="true" class="fal fa-search"></i>
        <i v-if="value.length !== 0" @click="clear()" aria-hidden="true" class="fal fa-times-circle"></i>
      </span>
  </form>
</template>

<script>

export default {
  name: 'AppSearchBox',
  props: {
    value: {
      type: [Object, String, Number],
      default: '',
      required: true
    },
    id: {
      type: String,
      default: 'app-search-box'
    },
    placeholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 500
    },
    size: {
      type: String,
      default: 'S'
    }
  },
  data () {
    return {
      searchTimeout: null
    }
  },
  created () {
  },
  computed: {
    formSize () {
      return {
        'form-control-sm': /s/i.test(this.size),
        'form-control-lg': /l/i.test(this.size)
      }
    }
  },
  methods: {
    changeValue (value) {
      clearTimeout(this.searchTimeout)
      this.$emit('input', value)
      this.searchTimeout = setTimeout(() => {
        this.$emit('search', value)
      }, this.debounce)
    },
    onFocusIn ($event) {
      this.$emit('focusin', $event)
    },
    onFocusOut ($event) {
      this.$emit('focusout', $event)
    },
    clear () {
      this.$emit('input', '')
      this.$emit('clear')
    },
    submit () {
      this.$emit('submit')
    },
    keyUpHandler ($event) {
      if ($event.key === 'Escape') {
        this.clear()
      }
      this.$emit('keyup', $event)
    },
    keyDownHandler ($event) {
      this.$emit('keydown', $event)
    }
  }
}
</script>
