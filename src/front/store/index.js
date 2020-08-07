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
      if (data.result === 'ok') {
        hostView.state.all[i].connectState = 1
      } else {
        hostView.state.all[i].connectState = -1
      }
      break
    }
  }
  console.log(hostView.state.current.connectState, data)
})
