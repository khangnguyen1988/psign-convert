<template>
  <div class="document-list-container w-100">
    <div v-if="title" class="table-header-toolbox">
      <h6>{{title}}</h6>
    </div>

    <app-table
      v-if="appendParams"
      ref="table"
      :append-params="appendParams"
      :data-transform="dataTransform"
      :api-url="apiUrl"
      :filter="true"
      :pagination="true"
      :css="{ tableClass: 'table mb-0 no-header' }"
      :data="data"
      :fields="fields"
    >
      <template slot="filter-slot">
        <b-dropdown size="sm" variant="button" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
            <button class="btn btn-sm btn-outline-primary">
              <i style="font-size: 1.125rem" class="fal fa-sort-amount-down"></i>
            </button>
          </template>
          <b-dropdown-item @click="sortBy('created_at')" href="javascript:" ><span class="mr-auto  pr-2">Thời gian</span>  <i class="fal fa-sort-alpha-down"></i></b-dropdown-item>
          <b-dropdown-item @click="sortBy('name')" href="javascript:" ><span class="mr-auto pr-2">Theo tên văn bản</span>  <i class="fal fa-sort-alpha-down"></i></b-dropdown-item>
          <!--        <b-dropdown-item href="javascript:" ><span class="mr-auto  pr-2">Email</span> <i class="fal fa-sort-alpha-down"></i></b-dropdown-item>-->
        </b-dropdown>
        <button @click="onClickReload()" style="padding: 5px 6px" class="btn btn-sm">
          <i class="fal" :class="{'fa-spin': loading }">
            <i style="font-size: 1.125rem" class="far fa-sync"></i>
          </i>
        </button>
      </template>

      <div slot="customRow" slot-scope="props">
        <document-row-item
          @on-click-row-item="onClickRowItem"
          :row-item="props.rowData"
        >
          <slot slot="buttons" name="buttons" :row-item="props.rowData" ></slot>
        </document-row-item>
      </div>
    </app-table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DocumentRowItem from '@/portal-components/documents/table/document-row-item'
import AppTable from '@/components/app-table/index'

const baseUrl = process.env.VUE_APP_API_URL

export default {
  name: 'DocumentTable',
  props: {
    api: {
      type: String,
      default: '/esign-api/api/document/get_by_partner'
    },
    title: String,
    status: {
      type: String,
      default: ''
    },
    tag: {
      type: [String, Number],
      default: ''
    },
    addedPersons: {
      type: String,
      default: ''
    },
    waitForSign: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      chkAll: false,
      chkValues: {},
      currentUser: null,
      checkList: {},
      appendParams: null,
      dataTransform: src => ({
        data: src.data.map(item => ({
          ...item.document,
          signed_persons: item.signed_persons,
          signed_vendors: item.signed_vendors,
          tag_id: item.tag_id,
          group_id: item.group_id
        })),
        page_info: src.page_info
      }),
      fields: [
        {
          name: '__slot:customRow'
        }
      ],
      data: []
    }
  },
  beforeDestroy () {
    this.$bus.off('document-upload-success', this.reload)
  },
  created () {
    this.$bus.on('document-upload-success', this.reload)
  },
  mounted () {
    const status = this.status || this.$route.params.status
    const tag = this.tag || this.$route.params.tag
    const addedPersons = this.addedPersons || this.$route.params.addedPersons
    const waitForSign = this.waitForSign
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser) {
      const companyId = currentUser.company.company_id || currentUser.company.id
      this.appendParams = {
        sort: 'created_at',
        sort_direction: 'desc',
        user_id: currentUser.user_id,
        company_id: companyId
      }
      if (status) {
        this.appendParams.status_doc_array = status
      }
      if (tag) {
        this.appendParams.tags_id = tag
        this.title = `Văn bản gắn nhãn${this.getTagName(tag)}`
      }
      if (addedPersons) {
        this.appendParams.added_persons = addedPersons
      }
      if (waitForSign) {
        this.appendParams.user_filter_doc = waitForSign
      }
    }
  },
  computed: {
    apiUrl () {
      return `${baseUrl}${this.api}`
    },
    ...mapState([
      'appNavbarDisplay',
      'tags'
    ])
  },
  methods: {
    ...mapActions(['countDocument']),
    getTagName (tagId) {
      const tag = this.tags.find(t => t.value === tagId)
      return tag ? ` (${tag.text})` : ''
    },
    onClickRowItem (model) {
      this.$emit('on-click-row-item', model)
    },
    sortBy (colName) {
      this.appendParams = {
        ...this.appendParams,
        sort: `${colName}`,
        sort_direction: 'desc'
      }
      this.reload()
    },
    onClickReload () {
      this.loading = true
      this.reload()
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    reload () {
      this.$nextTick(() => {
        this.$refs.table.reload()
        this.countDocument()
      })
    },
    onViewClick (model) {
      this.$modal.show('view-document-modal', { model })
    }
  },
  watch: {
    status (newStatus) {
      this.appendParams = {
        ...this.appendParams,
        status_doc_array: newStatus
      }
      this.reload()
    },
    tag (newTag) {
      this.appendParams = {
        ...this.appendParams,
        tags_id: newTag
      }
      this.title = `Văn bản gắn nhãn${this.getTagName(newTag)}`
      this.reload()
    },
    addedPersons (newValue) {
      if (newValue) {
        this.appendParams = {
          ...this.appendParams,
          added_persons: newValue
        }
      } else {
        delete this.appendParams.added_persons
      }
      this.reload()
    },
    waitForSign (newValue) {
      if (newValue) {
        this.appendParams = {
          ...this.appendParams,
          user_filter_doc: newValue
        }
      } else {
        delete this.appendParams.user_filter_doc
      }
      this.reload()
    }
  },
  components: {
    AppTable,
    DocumentRowItem
  }
}
</script>
<style lang="scss">
.table-header-toolbox {
  display: flex;
  align-items: center;
  height: 70px;
  h6 {
    display: inline-block;
    font-size: 1.25rem;
    margin-bottom: 0;
  }
}
.table-top-row {
  padding: 0 1rem 0 1.5rem;
  display: flex;
  align-items: center;
  height: 70px;
}

.dropdown-item {
  display: flex;
  &:hover {
    background: #E6ECF4;
  }
}
</style>
