<template>
  <div>
    <div v-if="loading" class="loading-container center">
      <div class="text-center">
        <h5>
          {{ loadingProgress ? (`${title} ${loadingProgress}%`) : title  }}
        </h5>
        <div class="loading-logo">
          <div class="loading-circle">
          </div>
        </div>
      </div>
    </div>
    <div v-if="renderChild">
      <div v-show="!loading">
        <slot>
        </slot>
      </div>
    </div>
    <div v-if="!renderChild">
      <slot v-if="!loading">
      </slot>
    </div>
  </div>
</template>
<script>

export default {
  name: 'AppLoading',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    loadingProgress: {
      type: [String, Number],
      default: ''
    },
    title: {
      type: String,
      default () {
        return this.$t('app.loading')
      }
    },
    renderChild: {
      type: Boolean,
      default: false
    }
  }
}
</script>
