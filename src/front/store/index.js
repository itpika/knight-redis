import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import host from './modules/host'
import hostView from './modules/hostView'
import { NO_AUTH, PASSWD_ERROR, CONNECT_TIMEOUT, FAIL } from '../../lib/redis/singal'

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

if (window.ipcRenderer) {
  /**
   * host主机连接成功与否通知
   */
  window.ipcRenderer.on('conection-notify', (event, data) => {
    // 跟新状态机的host的连接状态
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].connectState = data.code
        switch (data.code) {
          case NO_AUTH:
            hostView.state.all[i].dialogState.promptTest = 'Require Password'
            break
          case PASSWD_ERROR:
            hostView.state.all[i].dialogState.promptTest = 'Password authentication failed'
            break
          case CONNECT_TIMEOUT:
            hostView.state.all[i].dialogState.promptTest = 'Connection timeout'
            break
          case FAIL:
            hostView.state.all[i].dialogState.promptTest = 'Connection fail'
            break
          default:
            break
        }
        break
      }
    }
    console.log(hostView.state.current, data)
  })
}
