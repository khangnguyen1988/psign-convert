<template>
  <button @click="onClick" class="btn btn-sm btn-outline-secondary">{{$t(`document.${current.value === 'ALL' ? 'signAndReview' : current.value.toLowerCase()}`)}}</button>
</template>
<script>
import AppModal from '@/components/app-modal/index'
import AppForm from '@/components/app-form/index'
import PersonIcon from '@/portal-components/icons/person-icon'

const SIGN_REVIEW = {
  value: 'ALL',
  next: null
}

const REVIEW = {
  value: 'REVIEW',
  next: null
}

const SIGN = {
  value: 'SIGN',
  next: null
}

SIGN.next = REVIEW
REVIEW.next = SIGN_REVIEW
SIGN_REVIEW.next = SIGN

export default {
  name: 'VendorType',
  components: {
    AppForm,
    AppModal,
    PersonIcon
  },
  data () {
    return {
      current: null
    }
  },
  props: {
    vendor: {
      type: Object,
      default: {
        type: 'ALL'
      },
      required: true
    }
  },
  computed: {
  },
  mounted () {
    if (this.vendor.type.toUpperCase() === 'ALL') {
      this.current = SIGN_REVIEW
    }
    if (this.vendor.type.toUpperCase() === 'REVIEW') {
      this.current = REVIEW
    }
    if (this.vendor.type.toUpperCase() === 'SIGN') {
      this.current = SIGN
    }
  },
  beforeDestroy () {
  },
  methods: {
    onClick () {
      this.current = this.current.next
      this.$emit('change', this.current.value, this.vendor)
    }
  }
}
</script>
<style scoped>
 .btn-sm {
   padding: 0 16px;
   margin: 0 8px;
 }
</style>
