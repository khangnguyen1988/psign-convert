<template>
  <div class="document-row">
    <b-form-checkbox
      :id="'chk_' + rowItem.id"
      v-model="chkValues[rowItem.id]"
    >
    </b-form-checkbox>
<!--    <svg  width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0.188416L10.472 5.45445L16 6.30408L12 10.4008L12.944 16.1884L8 13.4545L3.056 16.1884L4 10.4008L0 6.30408L5.528 5.45445L8 0.188416Z" fill="#FF869A"/>
    </svg>-->
    <img class="img-pdf" @click="onClickPdf(rowItem)" src="/images/pdf.png" alt="pdf sample">
    <div>
      <h6> {{rowItem.name}}</h6>
      <div>{{rowItem.created_at | formatDateTime}}</div>
      <div style="display: inline-flex; margin-top: .75rem">
        <div style="margin-right: 16px">
          <document-status :document="rowItem"></document-status>
        </div>
        <div style="margin-right: 16px">
          <multiselect
            :selectLabel="$t('app.enterToConfirm')"
            :deselectLabel="$t('app.enterToCancel')"
            selectedLabel="✓"
            :value="selectedTags"
            @input="onUpdateTag"
            @close="onCloseTag"
            :options="tags"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="$t('tag.selectTag')"
            name="text" label="text" track-by="value" :preselect-first="true">
            <template v-slot:selection="{ values, search, isOpen }">
          <span class="multiselect__single" v-if="values.length && !isOpen">
            <span style="font-size: 12px" class="mr-3" v-for="(v, index) in values" :key="index">
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :fill="getColor(v.text)" d="M0.798359 11.007C0.881292 11.2026 1.00127 11.3803 1.15169 11.5303C1.30626 11.6864 1.49033 11.8103 1.69318 11.8947C1.89604 11.9791 2.11364 12.0224 2.33336 12.022H12.3334C12.5809 12.022 12.815 11.912 12.9742 11.7228L17.1409 6.7228C17.3984 6.41364 17.3984 5.96447 17.1409 5.6553L12.9742 0.655301C12.815 0.465302 12.5809 0.355301 12.3334 0.355301H2.33336C2.11515 0.354298 1.89891 0.396656 1.6972 0.479914C1.49549 0.563172 1.31233 0.685673 1.15836 0.840302C1.00221 0.994874 0.878338 1.17894 0.793934 1.38179C0.70953 1.58465 0.666279 1.80225 0.666693 2.02197V10.3553C0.666693 10.577 0.710026 10.7928 0.798359 11.007Z"></path>
              </svg>
              <span class="ml-1">{{v.text}}</span>
            </span>
          </span>
            </template>
            <template v-slot:option="props">
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :fill="getColor(props.option.text)" d="M0.798359 11.007C0.881292 11.2026 1.00127 11.3803 1.15169 11.5303C1.30626 11.6864 1.49033 11.8103 1.69318 11.8947C1.89604 11.9791 2.11364 12.0224 2.33336 12.022H12.3334C12.5809 12.022 12.815 11.912 12.9742 11.7228L17.1409 6.7228C17.3984 6.41364 17.3984 5.96447 17.1409 5.6553L12.9742 0.655301C12.815 0.465302 12.5809 0.355301 12.3334 0.355301H2.33336C2.11515 0.354298 1.89891 0.396656 1.6972 0.479914C1.49549 0.563172 1.31233 0.685673 1.15836 0.840302C1.00221 0.994874 0.878338 1.17894 0.793934 1.38179C0.70953 1.58465 0.666279 1.80225 0.666693 2.02197V10.3553C0.666693 10.577 0.710026 10.7928 0.798359 11.007Z"></path>
              </svg>
              <span class="ml-2">{{props.option.text}}</span>
            </template>
          </multiselect>
        </div>
        <div style="margin-right: 16px">
          <multiselect
            :selectLabel="$t('app.enterToConfirm')"
            :deselectLabel="$t('app.enterToCancel')"
            selectedLabel="✓"
            :value="selectedGroups"
            @input="onUpdateGroup"
            @close="onCloseGroup"
            :options="groupOptions"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="$t('group.selectGroup')"
            name="text" label="text" track-by="value" :preselect-first="true">
            <template v-slot:selection="{ values, search, isOpen }">
              <span class="multiselect__single" v-if="values.length && !isOpen">
                <span style="font-size: 12px" class="mr-3" v-for="(v, index) in values" :key="index">
                <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :fill="getColor(v.text)" d="M6.3002 2.19961C6.3002 2.75656 6.07895 3.29071 5.68512 3.68453C5.29129 4.07836 4.75715 4.29961 4.2002 4.29961C3.64324 4.29961 3.1091 4.07836 2.71527 3.68453C2.32144 3.29071 2.1002 2.75656 2.1002 2.19961C2.1002 1.64265 2.32144 1.10851 2.71527 0.714685C3.1091 0.320859 3.64324 0.0996094 4.2002 0.0996094C4.75715 0.0996094 5.29129 0.320859 5.68512 0.714685C6.07895 1.10851 6.3002 1.64265 6.3002 2.19961ZM11.9002 2.19961C11.9002 2.47539 11.8459 2.74846 11.7403 3.00324C11.6348 3.25803 11.4801 3.48953 11.2851 3.68453C11.0901 3.87954 10.8586 4.03422 10.6038 4.13976C10.349 4.24529 10.076 4.29961 9.80019 4.29961C9.52442 4.29961 9.25134 4.24529 8.99656 4.13976C8.74178 4.03422 8.51027 3.87954 8.31527 3.68453C8.12027 3.48953 7.96558 3.25803 7.86005 3.00324C7.75451 2.74846 7.7002 2.47539 7.7002 2.19961C7.7002 1.64265 7.92144 1.10851 8.31527 0.714685C8.7091 0.320859 9.24324 0.0996094 9.80019 0.0996094C10.3572 0.0996094 10.8913 0.320859 11.2851 0.714685C11.6789 1.10851 11.9002 1.64265 11.9002 2.19961ZM9.0512 9.89961C9.0834 9.67071 9.10019 9.43761 9.10019 9.19961C9.10182 8.09981 8.73181 7.03172 8.0502 6.16861C8.58226 5.86142 9.1858 5.6997 9.80017 5.6997C10.4145 5.69969 11.0181 5.86141 11.5502 6.16859C12.0822 6.47577 12.5241 6.91759 12.8313 7.44964C13.1384 7.98169 13.3002 8.58524 13.3002 9.19961V9.89961H9.0512ZM4.2002 5.69961C5.12845 5.69961 6.01869 6.06836 6.67507 6.72473C7.33145 7.38111 7.7002 8.27135 7.7002 9.19961V9.89961H0.700195V9.19961C0.700195 8.27135 1.06894 7.38111 1.72532 6.72473C2.3817 6.06836 3.27194 5.69961 4.2002 5.69961Z"/>
                </svg>
                <span class="ml-1">{{v.text}}</span>
            </span>
              </span>
            </template>
            <template v-slot:option="props">
              <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :fill="getColor(props.option.text)" d="M6.3002 2.19961C6.3002 2.75656 6.07895 3.29071 5.68512 3.68453C5.29129 4.07836 4.75715 4.29961 4.2002 4.29961C3.64324 4.29961 3.1091 4.07836 2.71527 3.68453C2.32144 3.29071 2.1002 2.75656 2.1002 2.19961C2.1002 1.64265 2.32144 1.10851 2.71527 0.714685C3.1091 0.320859 3.64324 0.0996094 4.2002 0.0996094C4.75715 0.0996094 5.29129 0.320859 5.68512 0.714685C6.07895 1.10851 6.3002 1.64265 6.3002 2.19961ZM11.9002 2.19961C11.9002 2.47539 11.8459 2.74846 11.7403 3.00324C11.6348 3.25803 11.4801 3.48953 11.2851 3.68453C11.0901 3.87954 10.8586 4.03422 10.6038 4.13976C10.349 4.24529 10.076 4.29961 9.80019 4.29961C9.52442 4.29961 9.25134 4.24529 8.99656 4.13976C8.74178 4.03422 8.51027 3.87954 8.31527 3.68453C8.12027 3.48953 7.96558 3.25803 7.86005 3.00324C7.75451 2.74846 7.7002 2.47539 7.7002 2.19961C7.7002 1.64265 7.92144 1.10851 8.31527 0.714685C8.7091 0.320859 9.24324 0.0996094 9.80019 0.0996094C10.3572 0.0996094 10.8913 0.320859 11.2851 0.714685C11.6789 1.10851 11.9002 1.64265 11.9002 2.19961ZM9.0512 9.89961C9.0834 9.67071 9.10019 9.43761 9.10019 9.19961C9.10182 8.09981 8.73181 7.03172 8.0502 6.16861C8.58226 5.86142 9.1858 5.6997 9.80017 5.6997C10.4145 5.69969 11.0181 5.86141 11.5502 6.16859C12.0822 6.47577 12.5241 6.91759 12.8313 7.44964C13.1384 7.98169 13.3002 8.58524 13.3002 9.19961V9.89961H9.0512ZM4.2002 5.69961C5.12845 5.69961 6.01869 6.06836 6.67507 6.72473C7.33145 7.38111 7.7002 8.27135 7.7002 9.19961V9.89961H0.700195V9.19961C0.700195 8.27135 1.06894 7.38111 1.72532 6.72473C2.3817 6.06836 3.27194 5.69961 4.2002 5.69961Z"/>
              </svg>
              <span class="ml-2">{{props.option.text}}</span>
            </template>
          </multiselect>
        </div>
      </div>

      <div class="signers">
        <strong>{{$t('user.signerAndFollower')}} <span v-if="rowItem.signed_persons">({{rowItem.signed_persons.length || 0}})</span></strong>

        <template  v-for="(signed_person, index) in rowItem.signed_persons">
          <span class="signer" :key="index">
            <DocumentStatusIcon :type="(signed_person.signed_type === 'VIEW') ? 'view' : (signed_person.signed_at ? 'done': 'out')"></DocumentStatusIcon>
            {{signed_person.email || signed_person.user_id.name }}
          </span>
        </template>
      </div>
    </div>
    <slot name="buttons"></slot>
  </div>
</template>
<script>
import DocumentStatusIcon from '@/portal-components/icons/document-status-icons'
import DocumentStatus from '@/portal-components/documents/table/document-status'
import Multiselect from 'vue-multiselect'
import { mapState } from 'vuex'
import { getColor } from '@/utils/document'
import TagProxy from '@/store/proxies/tag-proxy'
import GroupProxy from '@/store/proxies/group-proxy'

export default {
  name: 'DocumentRowItem',
  components: {
    DocumentStatusIcon,
    DocumentStatus,
    Multiselect
  },
  props: {
    rowItem: {
      type: Object
    }
  },
  data () {
    return {
      documentTags: [],
      documentGroups: [],
      selectedTags: [],
      selectedGroups: [],
      chkValues: {}
    }
  },
  computed: {
    ...mapState(['tags', 'groups']),
    groupOptions () {
      return this.groups.map(g => ({ value: g.id, text: g.name }))
    },
    waitingForMyTurn () {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      let idx = -1
      if (currentUser && this.document.signed_persons) {
        idx = this.document.signed_persons.findIndex(p => !p.signed_at && p.user_id.id === currentUser.user_id)
      }
      return (this.document.status === 'IN_PROGRESS' || document.status === 'SUBMIT') && idx > -1
    }
  },
  mounted () {
    this.loadTags()
    this.loadGroups()
  },
  methods: {
    tagHasChanged () {
      const v1 = this.selectedTags.map(t => t.value).sort()
      const v2 = this.documentTags.map(t => t.value).sort()
      if (v1.length !== v2.length) {
        return true
      }
      for (let i = 0; i < v1.length; i++) {
        if (v1[i] !== v2[i]) {
          return true
        }
      }
      return false
    },
    groupHasChanged () {
      const v1 = this.selectedGroups.map(t => t.value).sort()
      const v2 = this.documentGroups.map(t => t.value).sort()
      if (v1.length !== v2.length) {
        return true
      }
      for (let i = 0; i < v1.length; i++) {
        if (v1[i] !== v2[i]) {
          return true
        }
      }
      return false
    },
    onUpdateTag (tag) {
      this.selectedTags = tag
    },
    onUpdateGroup (group) {
      this.selectedGroups = group
    },
    loadTags () {
      if (this.rowItem.tag_id && this.rowItem.tag_id.length > 0) {
        this.selectedTags = this.rowItem.tag_id.map(t => ({ text: t.name, value: t.id }))
      } else {
        this.selectedTags = []
      }
      this.documentTags = [
        ...this.selectedTags
      ]
    },
    loadGroups () {
      if (this.rowItem.group_id && this.rowItem.group_id.length > 0) {
        this.selectedGroups = this.rowItem.group_id.map(t => ({ text: t.name, value: t.id }))
      } else {
        this.selectedGroups = []
      }
      this.documentGroups = [
        ...this.selectedGroups
      ]
    },
    onCloseTag (tags) {
      if (this.tagHasChanged()) {
        this.$modal.show('dialog', {
          title: this.$t('tag.updateTag'),
          text: this.$t('tag.updateTagConfirmMsg'),
          okText: this.$t('app.ok'),
          okClass: 'btn-primary',
          onOk: () => {
            new TagProxy().setTagForDocument({
              tag_id: tags.map(t => t.value),
              document_id: [this.rowItem.id]
            }).then(() => {
              this.selectedTags = tags
              this.documentTags = [
                ...this.selectedTags
              ]
            })
          },
          onCancel: () => {
            this.selectedTags = [
              ...this.documentTags
            ]
          },
          onClose: () => {
            this.selectedTags = [
              ...this.documentTags
            ]
          }
        })
      }
    },
    onCloseGroup (groups) {
      if (this.groupHasChanged()) {
        this.$modal.show('dialog', {
          title: this.$t('group.updateGroup'),
          text: this.$t('group.updateGroupConfirmMsg'),
          okText: this.$t('app.ok'),
          okClass: 'btn-primary',
          onOk: () => {
            new GroupProxy().addDocuments({
              group_id: groups.map(t => t.value),
              document_id: [this.rowItem.id]
            }).then(() => {
              this.selectedGroups = groups
              this.documentGroups = [
                ...this.selectedGroups
              ]
            })
          },
          onCancel: () => {
            this.selectedGroups = [
              ...this.documentGroups
            ]
          },
          onHide: () => {
            this.selectedGroups = [
              ...this.documentGroups
            ]
          }
        })
      }
    },
    getColor (tagName) {
      return getColor(tagName)
    },
    onClickPdf (model) {
      this.$emit('on-click-row-item', model)
    }
  },
  watch: {
    rowItem () {
      this.loadTags()
      this.loadGroups()
    }
  }
}
</script>

<style lang="scss">
.document-row {
  font-size: .75rem;
  color: #575A5E;
  padding: 1rem;
  display: flex;
  align-items: center;
  img {
    padding: 0 1rem;
    &:hover {
      cursor: pointer;
    }
  }
  h6 {
    margin-bottom: 4px;
  }
  .buttons {
    .btn {
      font-size: 12px;
    }
    margin-left: auto;
    @media screen and (max-width: 576px) {
      display: flex;
      flex-direction: column;
      .btn {
        margin: .5rem 0;
      }
    }
  }
  .signers {
    margin-top: 1rem;
    display: flex;
    .signer {
      margin: 0 .5rem;
    }
    @media screen and (max-width: 576px) {
      flex-direction: column;
    }
  }

  @media screen and (max-width: 576px) {
    img, .custom-checkbox {
      display: none;
    }
  }
}
</style>
