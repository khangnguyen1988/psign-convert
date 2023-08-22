import CssConfig from './css.config'

export default {
  apiUrl: {
    type: String
  },
  fields: {
    type: Array,
    required: true
  },
  sortOrder: {
    type: Array,
    default () {
      return []
    }
  },
  appendParams: {
    type: Object,
    default () {
      return {}
    }
  },
  css: {
    type: Object,
    default () {
      return CssConfig.table
    }
  },
  rowClass: {
    type: [Function, String]
  },
  detailRowComponent: {
    type: String
  },
  data: {
    type: [Array, Object]
  },
  apiMode: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 25
  },
  dataTransform: {
    type: Function
  },
  filter: {
    type: Boolean,
    default: true
  },
  onRowClicked: {
    type: Function,
    default: () => {}
  },
  loaded: {
    type: Function,
    default: () => {}
  }
}
