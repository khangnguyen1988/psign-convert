<template>
  <ul class="pagination">
    <li  class="page-item" :class="{'disabled': isOnFirstPage}">
      <a class="page-link" href="javascript:" @click.prevent="loadPage('prev')">
        <span>&laquo;</span>
      </a>
    </li>

    <template v-if="notEnoughPages">
      <li :key="n" v-for="n in totalPage" class="page-item" :class="{'active': isCurrentPage(n)}">
        <a class="page-link" href="javascript:" @click.prevent="loadPage(n)" v-html="n"></a>
      </li>
    </template>
    <template v-else>
      <li :key="n" v-for="n in windowSize" class="page-item" :class="{'active': isCurrentPage(windowStart+n-1)}">
        <a class="page-link" href="javascript:" @click.prevent="loadPage(windowStart+n-1)" v-html="windowStart+n-1"></a>
      </li>
    </template>

    <li class="page-item" :class="{'disabled': isOnLastPage || !totalPage}">
      <a  class="page-link" href="javascript:" @click.prevent="loadPage('next')">
        <span>&raquo;</span>
      </a>
    </li>
  </ul>
</template>

<script>
import VuetablePaginationMixin from 'vuetable-2/src/components/VuetablePaginationMixin'

export default {
  mixins: [VuetablePaginationMixin]
}
</script>
