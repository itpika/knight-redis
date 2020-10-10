import send from '../../lib/channel/send.js'
export default {
  namespaced: true,
  state: {
    string: null,
    list: null,
    hash: {
      key: null,
      value: null
    },
    set: null,
    zset: {
      score: null,
      value: null
    }
  },
  mutations: {
    // 保存string
    string: function (state, data) {
      send.sendEvent('saveString', data)
    }
  },
  actions: {
  },
  modules: {
  }
}
