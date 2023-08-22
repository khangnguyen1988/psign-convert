import Tawk from 'vue-tawk'
import Vue from 'vue'
// Show chat support for web only
if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
  Vue.use(Tawk, {
    tawkSrc: 'https://embed.tawk.to/612b9223649e0a0a5cd382d9/1fe935n1a'
  })
}
