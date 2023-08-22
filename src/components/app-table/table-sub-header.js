export default {
  template:
`<tr>
  <template v-for="field in fields">
    <th :class="[field.titleClass]" :colspan="colspan[field.name]"
        v-if="colspan[field.name]" v-html="render(field)"></th>
  </template>
</tr>`,
  props: {
    fields: {
      type: Array,
      required: true
    },
    tableData: {
      type: null,
      required: true
    },
    vm: {
      type: null
    }
  },
  created () {
    this.colspan = this.calculateColSpan()
  },
  data () {
    return {
      colspan: null
    }
  },
  methods: {
    render (field) {
      if (!field.subHeader) {
        return ''
      }

      if (field.subHeader.template) {
        return field.subHeader.template
      }

      if (typeof field.subHeader.callback === 'function') {
        return field.subHeader.callback.apply(this.vm, [this.tableData])
      }

      return ''
    },
    calculateColSpan () {
      let remainingCol = this.fields.length
      const colspan = {}

      this.fields.forEach((f) => {
        if (f.subHeader) {
          colspan[f.name] = f.subHeader.colspan || 1
        } else {
          colspan[f.name] = remainingCol > 0 ? 1 : 0
        }

        remainingCol -= colspan[f.name]
      })

      return colspan
    }
  }
}
