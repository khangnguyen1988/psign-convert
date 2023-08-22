<template>
  <app-modal name="user-subscription-modal" :title="title" hide-footer @before-open="beforeOpen" @before-close="beforeClose"  @on-ok="onOk">
    <h4 class="section-header">{{$t('user.subscription.generalInfo')}}</h4>
    <app-form
      ref="formGeneralInfo"
      :schema="schema"
      :layout="layout"
      :data="formModel"
    />
    <h4 class="section-header">{{$t('user.subscription.enrollment')}}</h4>
    <div v-for="(subscription) in subscriptions" class="row subscription">
      <div class="col-md-6">
        <p>Tên gói cước: {{subscription.plan_id.name}}</p>
        <p>Số văn bản: {{subscription.capacity | formatNumber}}</p>
        <p>Ngày bắt đầu: <span v-if="subscription.start">{{subscription.start | formatDate}}</span></p>
      </div>
      <div class="col-md-6">
        <p>Dịch vụ: {{subscription.service}}</p>
        <p>Giá tiền: {{subscription.total | formatNumber}} đồng</p>
        <p>Ngày kết thúc: <span v-if="subscription.end">{{subscription.end | formatDate}}</span></p>
      </div>
    </div>
  </app-modal>
</template>

<script>
import AppLoading from '@/components/app-loading/'
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import LicenseProxy from '@/store/proxies/license-proxy'

export default {
  name: 'UserSubscriptionModal',
  components: {
    AppLoading,
    AppModal,
    AppForm
  },
  data () {
    return {
      title: this.$t('user.subscription.title'),
      formModel: {
        total: null,
        totalUsed: null
      },
      subscriptions: [],
      layout: {
        'div.row': {
          'div.col-md-6': {
            field: 'total'
          },
          'div.col-md-6:2': {
            field: 'totalUsed'
          }
        }
      },
      schema: [
        {
          name: 'total',
          label: this.$t('user.subscription.total'),
          type: 'input',
          inputType: 'number',
          readonly: true
        },
        {
          name: 'totalUsed',
          label: this.$t('user.subscription.totalUsed'),
          type: 'input',
          inputType: 'number',
          readonly: true
        }
      ]
    }
  },
  computed: {
  },
  beforeDestroy () {

  },
  created () {
    // Cal api server
  },
  methods: {
    beforeOpen () {
      let total = 0
      let totalUsed = 0
      new LicenseProxy().getLicense().then(res => {
        this.subscriptions = res.subscriptions
        total = res.subscriptions.reduce((subTotal, subscription) => subTotal + parseInt(subscription.capacity, 0), 0)
        totalUsed = res.total
        this.formModel = {
          total,
          totalUsed
        }
      })
    },
    beforeClose () {

    },
    openModal (modalName) {
      this.$modal.show(modalName, { model: {} })
    }
  }
}
</script>
<style>
.section-header {
  font-size: .875rem;
  color: #38424B;
  background: #E6ECF4;
  padding: .5rem 1.5rem;
  margin-bottom: 1rem;
  margin-left: -1rem;
  margin-right: -1rem;
}
.subscription:not(:last-child) {
  border-bottom: 2px solid #ccc; margin-bottom: 1rem
}
.subscription p{
  margin-bottom: .5rem;
}
</style>
