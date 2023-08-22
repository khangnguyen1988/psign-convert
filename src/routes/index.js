import Vue from 'vue'
import VueRouter from 'vue-router'
import VuexRouterSync from 'vuex-router-sync'
import routes from './routes'
import store from '../store'

Vue.use(VueRouter)

export const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.state.auth.authenticated && to.path !== '/login') {
    localStorage.setItem('originalRoute', JSON.stringify(to))
    console.log(to)
    document.location.href = '/#/login'
    window.location.reload()
  } else {
    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      store.dispatch('hideSidebar')
    }
    next()
  }
})

Vue.router = router
VuexRouterSync.sync(store, router)

export default {
  router
}
