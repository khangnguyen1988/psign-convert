<template>
  <multiselect
    ref="originalMultiselect"
    v-bind="$attrs"
    v-on="listeners"
    class="position-relative"/>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'AppMultiselect',
  inheritAttrs: false,
  props: {
    reposition: {
      type: Boolean,
      default: false
    },
    scrollableContainerSelector: {
      type: [Boolean, String],
      default: false
    }
  },
  components: {
    Multiselect
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        open: () => this.onOpen()
      }
    }
  },
  data () {
    return {
      scrollableContainer: null
    }
  },
  methods: {
    onOpen () {
      this.repositionDropDown()
    },
    repositionDropDown () {
      const { top, height } = this.$el.getBoundingClientRect()
      const ref = this.$refs.originalMultiselect
      if (ref) {
        ref.$refs.list.style.width = `${this.$el.clientWidth}px`
        ref.$refs.list.style.position = 'fixed'
        ref.$refs.list.style.bottom = 'auto'
        ref.$refs.list.style.top = `${top + height}px`
      }
    }
  },
  mounted () {
    this.scrollableContainer =
      this.scrollableContainerSelector
        ? document.querySelector(this.scrollableContainerSelector) || window
        : window

    this.scrollableContainer.addEventListener('scroll', this.repositionDropDown, { passive: true })
  },
  destroyed () {
    this.scrollableContainer.removeEventListener('scroll', this.repositionDropDown)
  }
}
</script>
