import Vue from 'vue'

function VueBus (vue) {
  const bus = new Vue()

  Object.defineProperties(bus, {
    on: {
      get () {
        return this.$on
      }
    },
    once: {
      get () {
        return this.$once
      }
    },
    off: {
      get () {
        return this.$off
      }
    },
    emit: {
      get () {
        return this.$emit
      }
    }
  })

  vue.bus = bus

  Object.defineProperty(vue.prototype, '$bus', {
    get () {
      return bus
    }
  })
}

Vue.use(VueBus)

export default VueBus
