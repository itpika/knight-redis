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
