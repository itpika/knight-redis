export default {
  namespaced: true,
  state: {
    hosts: []
  },
  mutations: {
    openHost (state, host) {
      state.hosts.push(host)
    },
    closeHost (state, id) {
      const arr = []
      for (const h of state.hosts) {
        if (h.id !== id) {
          arr.push(arr)
        }
      }
      state.hosts = arr
    }
  },
  actions: {
  },
  modules: {
  }
}
