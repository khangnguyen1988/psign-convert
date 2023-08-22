<template>
  <div class="person-icon-wrapper" :class="color">
    <i class="fal fa-user"></i>
  </div>
</template>
<script>

import { getColorClass } from '@/utils/document'

export default {
  name: 'PersonIcon',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    color () {
      return getColorClass(this.name)
    }
  }
}
</script>
<style lang="scss">
.person-icon-wrapper {
  background: #99B0D1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  color: #ffffff;
  margin-right: .5rem;
}
</style>
