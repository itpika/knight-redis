import channel from '../../lib/channel.js'

export default {
  namespaced: true,
  state: {
    current: {
      selectDB: '',
      time: '',
      dbData: []
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
        conf: data.conf
      }
      const flg = Math.floor(Math.random() * 20)
      for (let index = 0; index < flg; index++) {
        host.dbData.push(Math.floor(Math.random() * 100))
      }
      state.current = host
      state.all.push(host)
      // 通知主进程建立连接
      // channel.initConnect(Object.assign({ time: data.time }, data.conf))
    },
    closeHost(state, time) {
      const arr = []
      for (let i = 0; i < state.all.length; i++) {
        if (state.all[i].time !== time) {
          arr.push(state.all[i])
        }
      }
      state.all = arr
      // 通知主进程关闭连接
      channel.closeConnect(time)
    },
    setSelectDB(state, db) {
      state.current.selectDB = db
    },
    clearCurrent(state) {
      state.current = null
    }
  },
  actions: {
  },
  modules: {
  }
}
