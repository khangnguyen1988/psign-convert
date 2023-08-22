<script>
import Vue from 'vue'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo'
import VuetablePaginationBootstrap from './vue-pagination-bootstrap'
import CustomActions from './custom-action'
import DetailRow from './detail-row'
import FilterBar from './filter-bar'
import PageSize from './page-size'
import CssConfig from './css.config'

Vue.component('detail-row', DetailRow)

export default {
  components: {
    Vuetable,
    VuetablePaginationInfo,
    VuetablePaginationBootstrap,
    CustomActions,
    FilterBar,
    DetailRow,
    PageSize
  },
  render (h) {
    return h(
      'div',
      {
        class: { 'container-fluid': true }
      },
      [
        this.filter ? this.renderFilterBar(h) : null,
        this.renderVuetable(h),
        this.pagination ? this.renderPagination(h) : null
      ]
    )
  },
  methods: {
    buildVuetableProps () {
      if (!this.apiMode) {
        this.dataTotal = this.dataRows.length
      }
      return {
        apiUrl: this.apiUrl,
        apiMode: this.apiMode,
        fields: this.fields,
        data: !this.pagination ? this.dataRows : null,
        dataTotal: this.dataTotal,
        dataManager: this.dataManager,
        perPage: this.currentPageSize,
        multiSort: true,
        sortOrder: this.sortOrder,
        appendParams: this.appendParams,
        detailRowComponent: this.detailRowComponent,
        rowClass: this.rowClass,
        httpOptions: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('id_token')}`
          }
        },
        css: Object.assign({}, CssConfig.table, this.css),
        httpFetch: this.httpFetch,
        queryParams: { sort: 'sort', page: 'page', perPage: 'limit' }
      }
    },
    getScopedSlots () {
      return this.$vnode.data.scopedSlots
    },
    renderVuetable (h) {
      return h('div', { class: { row: true } }, [
        h('div', { class: { 'table-responsive': true } }, [
          h('vuetable', {
            ref: 'vuetable',
            props: this.buildVuetableProps(),
            on: {
              'vuetable:row-clicked': (data, event) => {
                this.$emit('on-row-clicked', data, event)
              },
              'vuetable:cell-clicked': this.onCellClicked,
              'vuetable:pagination-data': this.onPaginationData,
              'vuetable:load-success': this.onLoadSuccess,
              'vuetable:loaded': this.onLoaded
            },
            scopedSlots: this.getScopedSlots()
          })
        ])
      ])
    },

    renderPagination (h) {
      return h(
        'div',
        { class: { row: true, 'justify-content-between': true } },
        [
          h('form', { class: { 'form-inline': true } }, [
            h('page-size', {
              props: {
                'page-size': this.currentPageSize
              },
              on: {
                'vuetable-pagination:change-page-size': this.onChangePageSize
              }
            }),
            h('vuetable-pagination-info', {
              ref: 'paginationInfo',
              props: { css: CssConfig.paginationInfo }
            })
          ]),
          h('vuetable-pagination-bootstrap', {
            ref: 'pagination',
            class: { 'pt-3': true },
            props: {},
            on: {
              'vuetable-pagination:change-page': this.onChangePage
            }
          })
        ]
      )
    },
    renderFilterBar (h) {
      return h(
        'filter-bar',
        {
          on: {
            'filter-set': this.onFilterSet,
            'filter-reset': this.onFilterReset
          }
        },
        [
          h(
            'template',
            {
              slot: 'filter-slot'
            },
            this.$slots['filter-slot']
          )
        ]
      )
    }
  }
}
</script>
