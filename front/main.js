import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'default-passive-events'
import './plugins/element.js'

Vue.config.productionTip = false

// global.os_platform = 'macOS'
global.os_platform = 'win'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
