export default {
  namespaced: true,
  state: {
    mainClass: 'main_bgd_color',
    winMax: false
  },
  mutations: {
    setMainClass(state, Class) {
      state.mainClass = Class
    }
  },
  actions: {
  },
  modules: {
  }
}
