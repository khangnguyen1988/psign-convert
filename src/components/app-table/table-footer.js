export default {
  template:
`<tfoot>
  <tr v-if="hasData" class="footer-row">
    <template v-for="field in fields">
      <td :colspan="colspan[field.name]"
          :class="[field.titleClass]" 
          v-html="render(field)" v-if="colspan[field.name]"></td>
    </template>
  </tr>
</tfoot>`,
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
  computed: {
    hasData () {
      return this.tableData.length > 0
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
      if (!field.footer) {
        return ''
      }

      if (field.footer.template) {
        return field.footer.template
      }

      if (typeof field.footer.callback === 'function') {
        return field.footer.callback.apply(this.vm, [this.tableData])
      }

      return ''
    },
    calculateColSpan () {
      let remainingCol = this.fields.length
      const colspan = {}

      this.fields.forEach((f) => {
        if (f.footer) {
          colspan[f.name] = f.footer.colspan || 1
        } else {
          colspan[f.name] = remainingCol > 0 ? 1 : 0
        }

        remainingCol -= colspan[f.name]
      })

      return colspan
    }
  }
}
