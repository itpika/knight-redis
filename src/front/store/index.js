import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import host from './modules/host'
import hostView from './modules/hostView'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    app,
    host,
    hostView
  }
})

/**
 * host主机连接成功与否通知
 */
window.ipcRenderer.on('conection-notify', (event, data) => {
  // 跟新状态机的host的连接状态
  for (let i = 0; i < hostView.state.all.length; i++) {
    if (hostView.state.all[i].time === data.time) {
      hostView.state.all[i].connectState = data.code
      break
    }
  }
  console.log(hostView.state.current.connectState, data)
})
