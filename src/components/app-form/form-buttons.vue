<template>
  <div>
    <a href="javascript:" class="btn btn-sm btn-primary"
       v-if="readonly" @click="$emit('on-readonly-change', false)">
      <i class="fal fa-pencil-alt px-1"></i> {{ $t('app.edit') }}
    </a>
    <a href="javascript:" class="btn btn-sm btn-primary" :class="{'disabled': submitting}"
       v-if="!readonly" @click="$emit('on-save')">
      <i class="fa px-1" :class="{'fa-floppy-o': !submitting,  'fa-spinner': submitting  }" aria-hidden="true"></i> {{ $t('app.save') }}
    </a>
    <a href="javascript:" class="btn btn-sm btn-warning"
       v-if="!readonly" @click="$emit('on-reset')">
      <i class="fal fa-sync px-1" aria-hidden="true"></i> {{ $t('app.reset') }}
    </a>
    <a href="javascript:" class="btn btn-sm btn-outline-danger"
       v-if="!readonly" @click="$emit('on-readonly-change', true)">
      <i class="fal fa-reply px-1" aria-hidden="true"></i> {{ $t('app.cancel') }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'AppFormButtons',
  props: {
    readonly: {
      type: Boolean,
      required: true
    },
    submitting: {
      type: Boolean,
      required: true
    }
  }
}
</script>
