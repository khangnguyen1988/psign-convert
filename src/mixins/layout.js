import Vue from 'vue'
/**
 * Compile the layout
 *
 * @param {VueComponent} context Vue instance
 * @returns Compiled Component
 */
function layoutCompile (context) {
  const layout = `${context.$route.meta.layout || 'app'}-layout`
  if (!context.$route.name) {
    return Vue.compile('<div id="app"><router-view/></div>')
  }
  return Vue.compile(`    <div id="app">
                            <${layout}>
                                <router-view/>
                            </${layout}>
                          </div>`)
}

/**
 * Render the layout
 *
 * @param {VueComponent} context Vue instance
 * @param {Object} res Compiled Component
 * @param {Boolean} update To force update component layout
 */
function layoutRender (context, res, update) {
  context.$options.render = res.render
  context.$options.staticRenderFns = res.staticRenderFns
  if (update) context.$forceUpdate()
}
const mixin = {
  beforeCreate () {
    layoutRender(this, layoutCompile(this))
  },
  watch: {
    $route () {
      layoutRender(this, layoutCompile(this), true)
    }
  }
}
export default mixin
