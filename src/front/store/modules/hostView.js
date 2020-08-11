import send from '../../lib/channel/send.js'

export default {
  namespaced: true,
  state: {
    current: {
      selectDB: '',
      time: '',
      label: '',
      dbData: [],
      connectState: -1, // 当前host是否连接成功 (-1:连接中，0:成功，1：需要密码，2:密码错误，4:连接失败)
      dialogState: {
        promptTest: '', // 错误提示框的内容文本
        lucencyMaskShow: false, // 透明遮罩层是否显示
        infoShowTitle: '', // 信息提示框标题
        infoShowTest: '' // 信息提示框文本
      }
    },
    all: []
  },
  mutations: {
    // 找出当前host的数据
    restoreCurrentHost(state, time) {
      for (let i = 0; i < state.all.length; i++) {
        if (state.all[i].time === time) {
          state.current = state.all[i]
        }
      }
    },
    // 打开host连接，初始化host状态数据
    initHost(state, data) {
      const host = {
        selectDB: '',
        dbData: [],
        time: data.time,
        conf: data.conf,
        label: data.label,
        connectState: Math.floor(Math.random() * 10) % 2,
        // connectState: -1,
        dialogState: {
          promptTest: '', // 错误提示框的内容文本
          lucencyMaskShow: false, // 透明遮罩层是否显示
          infoShowTitle: '', // 信息提示框标题
          infoShowTest: '' // 信息提示框文本
        }
      }
      const flg = Math.floor(Math.random() * 20)
      for (let index = 0; index < flg; index++) {
        host.dbData.push({
          type: 'string',
          key: Math.floor(Math.random() * 100)
        })
      }
      state.all.push(host)
      state.current = state.all[state.all.length - 1]
      // 通知主进程建立连接
      send.initConnect(Object.assign({ time: data.time }, data.conf))
    },
    // 重连
    reconnect(state) {
      // 通知主进程建立连接
      send.initConnect(Object.assign({ time: state.current.time }, state.current.conf))
    },
    closeHost(state, time) {
      const arr = []
      for (let i = 0; i < state.all.length; i++) {
        if (state.all[i].time !== time) {
          arr.push(state.all[i])
        }
      }
      if (arr.length === 0) state.current = null
      state.all = arr
      // 通知主进程关闭连接
      send.closeConnect(time)
    },
    setSelectDB(state, db) {
      state.current.selectDB = db
    }
  },
  actions: {
  },
  modules: {
  }
}
