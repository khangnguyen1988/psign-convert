<template>
  <label class="pr-3">
    <b-form-select v-model="currentPageSize" :options="options" class="mx-1">
    </b-form-select>
  </label>
</template>

<script>
export default {
  name: 'PageSize',
  props: {
    pageSize: {
      type: Number,
      default: 25
    }
  },
  data () {
    return {
      eventPrefix: 'vuetable-pagination:',
      currentPageSize: 10,
      options: [
        { value: 10, text: 'Show: 10' },
        { value: 25, text: 'Show: 25' },
        { value: 50, text: 'Show: 50' },
        { value: 100, text: 'Show: 100' }
      ]
    }
  },
  created () {
    this.currentPageSize = this.pageSize
  },
  watch: {
    currentPageSize (page) {
      this.$emit(`${this.eventPrefix}change-page-size`, page)
    }
  }
}
</script>
