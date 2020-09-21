import send from '../../lib/channel/send.js'
export default {
  namespaced: true,
  state: {
    current: {
      selectDB: '', // 当前选择的库
      time: '', // host的打开时间，用作唯一id
      label: '', // 当前host的标题
      dbData: [], // keys数据
      realTime: '0', // keys数据是否实时热更新
      dbLoading: false, // 放keys数据集合的div是否显示加载中特效
      connectState: -1, // 当前host是否连接成功 (-1:连接中，0:成功，1：需要密码，2:密码错误，4:连接失败)
      dialogState: {
        promptTest: '', // 错误提示框的内容文本
        lucencyMaskShow: false, // 透明遮罩层是否显示
        infoShowTitle: '', // 信息提示框标题
        infoShowTest: '' // 信息提示框文本
      },
      shellState: { // shell命令窗口状态
        open: false, // 是否打开
        commandExecCode: 0,
        commandExecData: '',
        clipboardText: '', // 剪切板内容
        paste: 0 // 获取剪切板内容(ctrl+v触发)
      },
      keyDetail: {
        keyName: '', // key name
        type: '-', // key类型
        ttl: -1, // 有效期
        value: '' // 值
      }
    },
    all: [] // 所有打开的host的连接
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
        selectDB: null,
        dbData: [],
        time: data.time,
        conf: data.conf,
        label: data.label,
        connectState: process.env.NODE_ENV === 'development' ? 0 : -1,
        // connectState: 2,
        dbLoading: false,
        dialogState: {
          promptTest: '', // 错误提示框的内容文本
          lucencyMaskShow: false, // 透明遮罩层是否显示
          infoShowTitle: '', // 信息提示框标题
          infoShowTest: '' // 信息提示框文本
        },
        shellState: {
          open: false, // shell窗口是否打开
          commandExecCode: 0,
          commandExecData: '',
          clipboardText: '', // 剪切板内容
          paste: 0 // 获取剪切板内容(ctrl+v触发)
        },
        keyDetail: {
          keyName: '',
          type: 'ZSET',
          ttl: -1,
          // value: '12889838jndnahxa9121'
          // value: [1, 'http://www.mamicode.com/info-detail2983524.html111111111123121', 'pika', 'md;osajdo;fmn;jfkdfjlksdhreihdjbvliubgfugfdjhfjfudufhjkjhfksndnskasdasdasxsxq1ewq141223']
          // value: {
          //   keys: ['name', 'asxasxssssssssaaaaaaaaaaaaa'],
          //   values: ['euumxkasxlasxjuiqwxlm;maxla;iwxmaxawlxksdjhfuhsaxansxkalshxuixmohdkadkak', '20']
          // }
          value: {
            scores: ['11', '2', '31'],
            values: ['euumxkasxlasxjuiqwxlm;maxla;iwxmaxawlxksdjhfuhsaxansxkalshxuixmohdkadkak', '20', 'pika']
          }
        }
      }
      if (process.env.NODE_ENV === 'development') {
        for (let index = 0; index < 50; index++) {
          host.dbData.push(Math.floor(Math.random() * 100) + '')
        }
        host.dbData[3] = 'aaaaaabbbbbbbcccccccddddddd111111222222'
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