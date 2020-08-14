import send from '../../lib/channel/send.js'
export default {
  namespaced: true,
  state: {
  },
  mutations: {
    // 获取db所有的key
    getAllKey: function (state, data) {
      send.getAllKey(data)
    }
  },
  actions: {
  },
  modules: {
  }
}
