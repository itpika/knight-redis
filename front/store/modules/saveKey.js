import send from '../../lib/channel/send.js'
export default {
  namespaced: true,
  state: {
  },
  mutations: {
    // 保存string
    string: function (state, data) {
      send.sendEvent('saveString', data)
    },
    // 保存hash
    hash: function (state, data) {
      send.sendEvent('saveHash', data)
    },
    // 保存list
    list: function (state, data) {
      send.sendEvent('saveList', data)
    },
    // 保存set
    set: function (state, data) {
      send.sendEvent('saveSet', data)
    },
    // 保存zset
    zset: function (state, data) {
      send.sendEvent('saveZSet', data)
    },
    addRow: function(state, data) {
      send.sendEvent('addRow', data)
    }
  },
  actions: {
  },
  modules: {
  }
}
