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
      let num = 0
      for (const h of state.openHost) {
        if (h.id === host.id) num++
      }
      if (num !== 0) {
        host.label += `(${num})`
      }
      state.openHost.push(host)
    },
    addHost (state, host) {
      state.hosts.push(host)
    },
    editHost (state, host) {
      for (let i = 0; i < state.hosts.length; i++) {
        if (state.hosts[i].id === host.id) {
          state.hosts[i] = host
          break
        }
      }
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
