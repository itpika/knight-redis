import send from '../../lib/channel/send.js'
export default {
  namespaced: true,
  state: {
    hostState: false, // host菜单栏的显示状态
    // hosts: [],
    hosts: [{
      id: '1',
      label: 'localhost',
      address: '10.10.1.43',
      port: 6380,
      passwd: '123456'
    }],
    openHost: [] // 打开的host连接
  },
  mutations: {
    // 打开一个host连接
    connectionHost (state, host) {
      let num = 0
      for (const h of state.openHost) {
        if (h.id === host.id) num++
      }
      if (num !== 0) {
        host.label += `(${num})`
      }
      state.openHost.push(host) // 添加一个激活的host项
      // 关闭其它host项
      for (let i = 0; i < state.openHost.length; i++) {
        if (state.openHost[i].time === host.time) {
          state.openHost[i].isActive = true // 选中项设为选中状态
          state.hostState = false // 同时把host菜单栏取消选中状态
        } else {
          state.openHost[i].isActive = false
        }
      }
    },
    addHost (state, host) {
      state.hosts.push(host)
      send.addHost(host) // 持久化到磁盘
    },
    editHost (state, host) {
      for (let i = 0; i < state.hosts.length; i++) {
        if (state.hosts[i].id === host.id) {
          state.hosts[i] = host
          send.addHost(host) // 持久化到磁盘
          break
        }
      }
    },
    deleteHost(state, id) {
      const arr = []
      for (let i = 0; i < state.hosts.length; i++) {
        if (state.hosts[i].id !== id) {
          arr.push(state.hosts[i])
        }
      }
      state.hosts = arr
      send.delete(id) // 持久化到磁盘
    },
    closeHost (state, time) {
      const arr = []
      for (const h of state.openHost) {
        if (h.time !== time) {
          arr.push(h)
        }
      }
      state.openHost = arr
    },
    // 设置host菜单栏的显示状态
    setHostState (state, flag) {
      state.hostState = flag
    }
  },
  actions: {
  },
  modules: {
  }
}
