import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'default-passive-events'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/display.css' // 基于断点的隐藏类样式
import 'element-ui/lib/theme-chalk/base.css' // 内置过度动画
Vue.config.productionTip = false

// global.os_platform = 'macOS'
global.os_platform = 'win'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
