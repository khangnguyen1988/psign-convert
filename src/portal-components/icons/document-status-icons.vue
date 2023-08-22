<template>
  <span>
    <svg v-if="type === 'done'" width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1.21875L4.4375 8.78125L1 5.34375" stroke="#49BF7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg v-if="type === 'in'" width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.47697 10.4722L5.61159 0.954326L7.77174 5.30262L11.897 7.11195L1.47697 10.4722Z" stroke="#F98579" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg v-if="type === 'out'" width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.523 1.52783L7.38841 11.0457L5.22826 6.69738L1.10303 4.88805L11.523 1.52783Z" stroke="#063F8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <i style="width: 13px; height: 12px; color: #d7681e" v-if="type === 'view'" class="far fa-eye"></i>
  </span>
</template>
<script>

export default {
  name: 'DocumentStatusIcon',
  props: {
    type: {
      type: String,
      default: 'done'
    }
  }
}
</script>
