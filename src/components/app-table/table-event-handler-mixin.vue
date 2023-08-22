<script>
export default {
  methods: {
    onChangePageSize (pageSize) {
      const oldPageSize = this.currentPageSize
      this.currentPageSize = pageSize
      if (oldPageSize !== pageSize) {
        this.$nextTick(() => {
          this.$refs.vuetable.refresh()
        })
      }
    },
    onPaginationData (paginationData) {
      if (this.$refs.pagination) {
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      }
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked (data) {
      // console.log('cellClicked: ', data, field.name, this.css.table);
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    //  onRowChanged(dataItem) {
    //    console.log('onRowChanged: ', dataItem);
    //  },
    onLoadSuccess (data) {
      this.$emit('on-load-success', data.data)
    },
    onLoaded () {
      this.renderAppTableComponent('subHeader')
      this.renderAppTableComponent('footer')
      this.loaded()
    },
    onFilterSet (text) {
      if (this.apiMode) {
        this.appendParams.search = text
      } else {
        this.handleLocalFilter(text)
      }
      this.$nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset () {
      if (this.apiMode) {
        this.appendParams.search = null
      } else {
        this.handleLocalFilter(null)
      }
      this.$nextTick(() => this.$refs.vuetable.refresh())
    },

    handleLocalFilter (filterText) {
      this.dataRows = !filterText ? this.data : this.getMatchItems(filterText)
      this.dataTotal = this.dataRows.length
      return this
    },
    getMatchItems (filterText) {
      const result = []
      this.data.forEach((item) => {
        if (this.isMatchFilterText(item, filterText)) {
          result.push(item)
        }
      })
      return result
    },
    isMatchFilterText (item, filterText) {
      const isCaseSensitive = false
      const parseText = (caseSensitive, text) => {
        let parsedText
        if (typeof text === 'object') {
          parsedText = JSON.stringify(text)
        } else {
          parsedText = text ? text.toString() : ''
        }
        return caseSensitive ? parsedText : parsedText.toLowerCase()
      }

      const searchText = parseText(isCaseSensitive, filterText)
      const keys = Object.keys(item)
      for (let i = 0; i < keys.length; i += 1) {
        const cellText = parseText(isCaseSensitive, item[keys[i]])
        if (cellText.indexOf(searchText) > -1) {
          return true
        }
      }
      return false
    }
  }
}
</script>
