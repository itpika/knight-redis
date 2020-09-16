import send from '../../lib/channel/send.js'
export default {
  namespaced: true,
  state: {
  },
  mutations: {
    // 获取db所有的key
    getAllKey: function (state, data) {
      send.getAllKey(data)
    },
    // 删除key
    removeKey: function (state, data) {
      send.removeKey(data)
    },
    // 保存key
    setKey: function (state, data) {
      send.setKey(data)
    },
    // 发送执行命令
    sendCommand: function (state, data) {
      send.sendCommand(data)
    },
    // 获取key详情
    keyDetail: function (state, data) {
      send.keyDetail(data)
    },
    // 获取剪切板内容
    getClipboard: function (state, data) {
      send.getClipboard(data)
    },
    // 设置剪切板内容
    setClipboard: function (state, data) {
      send.setClipboard(data)
    }
  },
  actions: {
  },
  modules: {
  }
}
