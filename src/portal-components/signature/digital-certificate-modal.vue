<template>
  <app-modal name="digital-certificate-modal"
             @before-open="beforeOpen"
             :title="title"
             width="70%"
             hide-footer>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 mb-4 text-right">
          <button class="btn btn-primary" @click="create()">{{$t('app.add')}}</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <app-table
            :filter="false"
            :pagination="false"
            ref="table"
            :api-mode="false"
            :data="certificates"
            :fields="fields"
          >
            <div slot="action" slot-scope="props">
              <button v-if="!props.rowData.is_active" class="btn btn-outline-success btn-sm pb-0 pt-0 mr-1"
                      :title="'Active'"
                      @click="onClickActive(props.rowData)">
                {{$t('signature.active')}}
              </button>
              <button v-if="!props.rowData.is_active" class="btn btn-danger btn-sm pb-0 pt-0 mr-1"
                      :title="'Delete'"
                      @click="onClickDelete(props.rowData)">
                <i class="fal fa-fw fa-trash" aria-hidden="true"></i>
              </button>
              <button v-if="props.rowData.is_active" class="btn btn-outline-danger btn-sm pb-0 pt-0"
                      :title="'Block'"
                      @click="onClickBlock(props.rowData)">
                {{$t('signature.deactivate')}}
              </button>
            </div>
          </app-table>
          <digital-certificate-detail-modal  @on-ok="onOk"></digital-certificate-detail-modal>
        </div>
      </div>
    </div>

  </app-modal>
</template>

<script>
import { mapState } from 'vuex'
import DateTimeUtils from '@/utils/datetime'
import AppModal from '@/components/app-modal/'
import AppTable from '@/components/app-table/'
import CaSignProxy from '@/store/proxies/ca-sign-proxy'
import DigitalCertificateDetailModal from '@/portal-components/signature/digital-certificate-detail-modal'

const fields = context => ([
  {
    name: 'issuer',
    title: context.$t('signature.provider'),
    callback: value => (value ? value.split(',')[0].replace('CN=', '') : '')
  },
  {
    name: 'ca_type',
    title: context.$t('signature.caType')
  },
  {
    name: 'owner_name',
    title: context.$t('signature.ownerName')
  },
  {
    name: 'effective_date',
    title: context.$t('signature.effectiveDate'),
    callback: value => DateTimeUtils.formatDate(value)
  },
  {
    name: 'expired_at',
    title: context.$t('signature.expiredAt'),
    callback: value => DateTimeUtils.formatDate(value)
  },
  {
    name: 'is_active',
    title: context.$t('signature.status'),
    callback: value => (value ? context.$t('signature.active') : context.$t('signature.deactivate'))
  },
  {
    name: '__slot:action',
    titleClass: 'text-sm-right',
    dataClass: 'text-sm-right',
    title: 'app.action'
  }
])

export default {
  name: 'DigitalCertificateListModal',
  components: {
    AppModal,
    AppTable,
    DigitalCertificateDetailModal
  },
  data () {
    return {
      certificates: [],
      title: null,
      fields: []
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  methods: {
    beforeOpen () {
      this.fields = fields(this)
      this.title = this.$t('signature.ca')
      new CaSignProxy().listAll().then((response) => {
        this.certificates = response
      })
    },
    create () {
      this.$modal.show('digital-certificate-detail-modal', {
        model: {}
      })
    },
    onClickEdit (user) {
      this.$modal.show('digital-certificate-detail-modal', {
        model: user
      })
    },
    onClickDelete (model) {
      const vm = this
      this.$modal.show('dialog', {
        title: this.$t('app.delete'),
        text: this.$t('app.areyousure'),
        okText: this.$t('app.delete'),
        okClass: 'btn-danger',
        onOk: () => {
          new CaSignProxy().deleteSignature(model.id).then(() => {
            vm.certificates = vm.certificates.filter(u => u.id !== model.id)
          })
        }
      })
    },
    onClickActive (model) {
      this.$modal.show('dialog', {
        title: this.$t('signature.activeCA'),
        text: this.$t('app.areyousure'),
        okText: this.$t('signature.active'),
        okClass: 'btn-success',
        onOk: () => {
          new CaSignProxy().activeSignature(model.id).then(() => {
            new CaSignProxy().listAll().then((response) => {
              this.certificates = response
            })
          })
        }
      })
    },
    onClickBlock (model) {
      this.$modal.show('dialog', {
        title: this.$t('signature.deactivateCA'),
        text: this.$t('app.areyousure'),
        okText: this.$t('signature.deactivate'),
        okClass: 'btn-danger',
        onOk: () => {
          new CaSignProxy().blockSignature(model.id).then(() => {
            new CaSignProxy().listAll().then((response) => {
              this.certificates = response
            })
          })
        }
      })
    },
    onOk () {
      new CaSignProxy().listAll().then((response) => {
        this.certificates = response
      })
    }
  }
}
</script>
