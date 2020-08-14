import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.js'
import host from './modules/host.js'
import hostView from './modules/hostView.js'
import redis from './modules/redis.js'
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
    hostView,
    redis
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
  /**
   * 获取所有key
   */
  window.ipcRenderer.on('getAllKey', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        console.log('data.keys', data.keys)
        hostView.state.all[i].dbLoading = false
        hostView.state.all[i].dbData = data.keys
      }
    }
  })
}
