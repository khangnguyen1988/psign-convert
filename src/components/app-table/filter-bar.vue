<template>
  <b-row class="filter-wrapper pb-3">
    <app-search-box
      :id="appSearchBoxId"
      v-model="filterText"
      :placeholder="$t('app.search')"
      @clear="resetFilter"
      @search="doFilter"
    />
    <slot name="filter-slot"></slot>
  </b-row>
</template>

<script>
import AppSearchBox from '@/components/app-search-box/'

export default {
  data () {
    return {
      filterText: '',
      appSearchBoxId: ''
    }
  },
  created () {
    const id = Math.floor(Math.random() * 10000) + 1
    this.appSearchBoxId = `app-search-box-${id}`
  },
  methods: {
    doFilter (filterText) {
      this.$emit('filter-set', filterText)
    },
    resetFilter () {
      this.$emit('filter-reset')
    }
  },
  components: {
    AppSearchBox
  }
}
</script>

<style>
.filter-wrapper{
  justify-content: flex-end;
}
</style>
