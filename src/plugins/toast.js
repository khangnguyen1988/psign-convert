import Vue from 'vue'
import Toasted from 'vue-toasted'

// you can also pass options, check options reference below
Vue.use(Toasted, {
  theme: 'bubble',
  position: 'top-right',
  duration: 3000,
  action: {
    text: 'x',
    onClick: (e, toastObject) => {
      toastObject.goAway(0)
    }
  }
})
