export default {
  namespaced: true,
  state: {
    hosts: [{
      id: '1',
      label: '外网',
      address: '127.0.0.1',
      port: 1,
      passwd: ''
    }],
    openHost: []
  },
  mutations: {
    connectionHost (state, host) {
      state.openHost.push(host)
    },
    closeHost (state, time) {
      const arr = []
      for (const h of state.openHost) {
        if (h.time !== time) {
          arr.push(h)
        }
      }
      state.openHost = arr
    }
  },
  actions: {
  },
  modules: {
  }
}
