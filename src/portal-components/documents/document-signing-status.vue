<template>
  <div class="row">
    <div class="col-12">
      <ul class="vendors">
        <li v-for="(vendor, index) in signedVendors" :key="index" class="vendor-item">
          <div class="title">
            <h5>
              {{vendor.company.id !== 0 ? vendor.company.full_name: $t('user.anonymousPartner')}}
            </h5>
            <div>
              <span class="badge badge-pill badge-primary">{{vendor.completed}}</span>
            </div>
          </div>
          <p v-if="vendor.company.id !== 0"><strong>{{$t('user.taxCode')}}:</strong> {{vendor.company.tax_code}}</p>
          <p v-if="vendor.company.id !== 0"><strong>{{$t('user.companyAddress')}}:</strong> {{vendor.company.company_address}}</p>
          <ul class="signatures">
            <template  v-for="(person) in vendor.persons">
              <div v-if="person.signed_type !== 'VIEW'">
                <p v-if="vendor.company.id !== 0" style="padding: .25rem 0">
                  <strong v-if="person.esignrole && person.esignrole.description">
                    {{$t('user.description')}}: {{person.esignrole.description}}
                  </strong>
                  <span v-if="vendor.company.id !== 0 && person.description" style="padding: .25rem 0">({{person.description}})</span>
                </p>
                <li class="signature-item" :class="{
                'in-active': !person.signed_at,
                'cancelled': documentModel.status === 'CANCELLED' && currentSignPerson && currentSignPerson.id === person.approvalId
              }" >
                  <h5>
                    <person-icon :name="person.name"></person-icon>
                    <span>
                    {{person.sequence !== 0 ? `#${person.sequence}`: ''}} {{person.name}}
                  </span>
                    <span class="pl-2" v-if="person.phone">({{person.phone}})</span>
                    <span class="icon">
                    <i class="fal valid" :class="{'fa-signature': person.signed_type === 'SIGNATURE_IMAGE',
                     'fa-usb-drive':  person.signed_type === 'SIGNATURE_DIGITAL',
                     'fa-eye':  person.signed_type === 'VIEW',
                     'fa-server':  person.signed_type === 'SIGNATURE_DIGITAL_HSM',
                      'fa-check': person.signed_type === 'SIGNATURE_APP_CONFIRMATION' }"></i>
                    <i class="fa in-valid fa-ban"></i>
                  </span>
                    <span>{{person.signed_at | formatDateTime}}</span>
                  </h5>
                </li>
                <p v-if="person.note" style="padding: .25rem 0">{{$t('user.comment')}}: {{person.note}}</p>
                <slot :name="`slot-approval-id:${person.approvalId}`"></slot>
              </div>
            </template>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import PersonIcon from '@/portal-components/icons/person-icon'

export default {
  name: 'DocumentSigningStatus',
  components: {
    PersonIcon
  },
  props: {
    documentModel: Object
  },
  data () {
    return {
      signedVendors: [],
      currentSignPerson: null
    }
  },
  computed: {
  },
  mounted () {
    if (this.documentModel.id) {
      this.currentSignPerson = this.getPersonInTurn()
      this.signedVendors = this.documentModel.signed_vendors.map((v) => {
        const companyId = v.company_id.id
        const persons = this.documentModel.signed_persons && this.documentModel.signed_persons.filter(p => p.company_id === companyId && p.signed_type !== 'VIEW').map(p => ({
          name: (p.user_id.id !== 0) ? p.user_id.name : p.email,
          phone: (p.user_id.id !== 0) ? p.user_id.phone : '',
          sequence: p.sequence,
          note: p.note,
          approvalId: p.id,
          esignrole: p.user_id.esignrole,
          description: p.description,
          signed_at: p.signed_at,
          signed_type: p.signed_type
        })).sort((p1, p2) => p1.sequence - p2.sequence)
        return {
          completed: `${v.current_index} / ${persons ? persons.length : 0}`,
          company: v.company_id,
          persons: persons || []
        }
      }).sort((v1, v2) => v1.sequence - v2.sequence)
    }
  },
  beforeDestroy () {
  },
  methods: {
    getVendorInTurn () {
      const currentVendorIndex = this.documentModel.current_index
      const result = this.documentModel.signed_vendors.filter(v => v.sequence === currentVendorIndex)
      return result && result.length > 0 ? result[0] : null
    },
    getPersonInTurn () {
      const vendorInTurn = this.getVendorInTurn()
      if (!vendorInTurn) {
        return null
      }
      const result = this.documentModel.signed_persons
        ? this.documentModel.signed_persons.filter(p =>
          vendorInTurn.company_id &&
        p.company_id === vendorInTurn.company_id.id &&
        p.sequence === vendorInTurn.current_index + 1
        )
        : []
      return result && result.length > 0 ? result[0] : null
    }
  }
}
</script>
<style scoped lang="scss">
.selected-files {
  padding: 0;
  margin: 0;
}
.selected-files li {
  cursor: pointer;
  list-style: none;
  padding: .5rem;
  border: 1px solid #ccc;
  margin: 1rem 0;
  border-radius: 3px;
}
.selected-files li.active, .selected-files li:hover  {
  background: #DAECF9;
  border: 1px solid #DAECF9;
}
.selected-files li.active  {
  font-weight: bold;
  color: #225b87;
}
.vendors {
  @media screen and (max-width: 576px) {
    margin-top: 2rem;
  }
}
</style>
