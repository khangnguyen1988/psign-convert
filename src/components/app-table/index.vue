<script>
import AppTableProps from './app-table-props'
import TableRenderMixin from './table-render-mixin'
import TableRenderHeaderFooterMixin from './table-render-header-footer-mixin'
import TableEventHandlerMixin from './table-event-handler-mixin'

export default {
  name: 'AppTable',
  mixins: [TableRenderMixin, TableEventHandlerMixin, TableRenderHeaderFooterMixin],
  props: AppTableProps,
  data () {
    return {
      currentPageSize: 25,
      dataTotal: 0,
      dataRows: null,
      footer: {},
      subHeader: {}
    }
  },
  created () {
    this.currentPageSize = this.pageSize
    this.dataRows = this.data
    this.standardizedFields()
  },
  mounted () {
    // this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
    // this.$events.$on('filter-reset', () => this.onFilterReset());
  },
  computed: {
    selectedTo () {
      return this.$refs.vuetable.selectedTo
    }
  },

  methods: {
    dataManager (sort, pagination) {
      const filterItems = []
      for (let i = pagination.from - 1; i < pagination.to; i += 1) {
        filterItems.push(this.dataRows[i])
      }
      return {
        links: {
          pagination
        },
        data: filterItems
      }
    },
    standardizedFields () {
      this.fields.forEach((f) => {
        if (f.title) {
          f.title = this.$t(f.title)
        }

        if (f.myTitle && typeof f.myTitle === 'function') {
          f.title = () => f.myTitle.call(this)
        }
        if (f.myCallback && typeof f.myCallback === 'function') {
          f.callback = model => f.myCallback.apply(this, [model])
        }
      })
    },
    normalizeFields () {
      this.$refs.vuetable.normalizeFields()
    },
    t (value, format) {
      if (!value) {
        return ''
      }
      return this.$t(format.replace('%s', value))
    },
    refresh () {
      this.$refs.vuetable.refresh()
    },
    reload () {
      this.$refs.vuetable.reload()
    },
    getAppendParams () {
      const vuetableRef = this.$refs.vuetable
      return vuetableRef.getAppendParams(vuetableRef.getAllQueryParams())
    },
    transform (srcData) {
      const data = this.dataTransform ? this.dataTransform(srcData) : srcData
      return this.transformSourceData(data)
    },
    transformSourceData (srcData) {
      const total = srcData.page_info ? srcData.page_info.total : srcData.length
      const data = srcData.data || srcData
      const pagination = this.$refs.vuetable.makePagination(total, this.currentPageSize,
        this.$refs.vuetable.currentPage)
      return {
        links: {
          pagination
        },
        data
      }
    },
    httpFetch (apiUrl, httpOptions) {
      return this.$http.get(apiUrl, httpOptions)
    }
  },
  watch: {
    data (newVal) {
      this.dataRows = newVal
    }
  }
}
</script>
