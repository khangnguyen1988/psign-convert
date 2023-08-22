<script>
import Vue from 'vue'
import TableSubHeader from './table-sub-header'
import TableFooter from './table-footer'

export default {
  beforeDestroy () {
    this.destroyAppTableComponent('subHeader')
    this.destroyAppTableComponent('footer')
  },
  methods: {
    renderAppTableComponent (type) {
      if (!this.hasDefinedComponentProps(type)) {
        return
      }
      this.destroyAppTableComponent(type)
      const element = this.createAppTableElement(type)
      this.createAppTableComponent(type, element)
    },
    getParentElement (type, vuetableElement) {
      return type === 'footer' ? vuetableElement : vuetableElement.getElementsByTagName('thead')[0]
    },
    createAppTableElement (type) {
      const container = document.createElement('div')
      const parentElement = this.getParentElement(type, this.$refs.vuetable.$el)
      parentElement.appendChild(container)
      return container
    },
    createAppTableComponent (type, mountedElement) {
      const ComponentCtor = type === 'footer' ? Vue.extend(TableFooter) : Vue.extend(TableSubHeader)
      this[type] = new ComponentCtor({
        propsData: {
          fields: this.fields,
          tableData: this.$refs.vuetable.tableData,
          vm: this
        }
      }).$mount(mountedElement)
    },
    hasDefinedComponentProps (componentType) {
      return !!this.fields.filter(f => f[componentType]).length
    },
    destroyAppTableComponent (type) {
      if (this[type].$destroy) {
        const parentElement = this.getParentElement(type, this.$refs.vuetable.$el)
        parentElement.removeChild(this[type].$el)
        this[type].$destroy()
      }
    }
  }
}
</script>
