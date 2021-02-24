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
      deleteKeyOK: 0, // 是否成功删除key
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
      searchBoxShow: false, // 过滤key输入框是否展示
      searchValue: '', // 过滤key值
      searchDate: [], // 过滤key后的结果key
      keyDetailShow: false, // key详情窗口是否展示
      serverInfoShow: false, // server详情窗口是否展示
      keyExists: 0, // key是否存在
      keyDetail: {
        keyName: '', // key name
        type: '-', // key类型
        ttl: -1, // 有效期
        ttlTimer: null, // ttl自减定时器
        ttlShow: true, // ttl数值是否展示
        ttlSave: false, // ttl是否保存成功
        renameStatus: 0, // 重命名成功与否, 0:初始状态，1：成功，-1：失败
        rename: false, // 重命名key
        newKeyName: '', // 新key的名字
        value: '', // 值
        saveKeyCode: 0, // 保存key成功与否, 1:ok， -1:fail
        saveDrop: true, // 是否禁止save按钮
        ketData: { // 修改key内容的数据暂存
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
        }
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
        realTime: '0',
        connectState: process.env.NODE_ENV === 'development' ? 0 : -1,
        // connectState: 2,
        deleteKeyOK: 0,
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
        searchBoxShow: false,
        searchValue: '',
        searchDate: [], // 过滤key后的结果key
        keyDetailShow: false,
        serverInfoShow: false, // server详情窗口是否展示
        keyExists: 0,
        keyDetail: {
          keyName: '',
          type: 'LIST',
          rename: false,
          renameStatus: 0,
          ttl: 1000000111111,
          ttlTimer: null,
          ttlShow: true,
          ttlSave: false,
          // value: '12889838jndnahxa9121',
          value: [1, 'http://www.mamicode.com/info-detail2983524.html111111111123121', 'pika', 'md;osajdo;fmn;jfkdfjlksdhreihdjbvliubgfugfdjhfjfudufhjkjhfksndnskasdasdasxsxq1ewq141223'],
          // value: {
          //   keys: ['name', 'asxasxssssssssaaaaaaaaaaaaa'],
          //   values: ['euumxkasxlasxjuiqwxlm;maxla;iwxmaxawlxksdjhfuhsaxansxkalshxuixmohdkadkak', '20']
          // },
          // value: {
          //   scores: ['11', '2', '31'],
          //   values: ['euumxkasxlasxjuiqwxlm;maxla;iwxmaxawlxksdjhfuhsaxansxkalshxuixmohdkadkak', '20', 'pika']
          // },
          newKeyName: '',
          saveKeyCode: 0,
          saveDrop: true, // 是否禁止save按钮
          ketData: { // 修改key内容的数据暂存
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
      send.sendEvent('initConnect', Object.assign({ time: data.time }, data.conf))
    },
    // 重连
    reconnect(state) {
      // 通知主进程建立连接
      send.sendEvent('initConnect', Object.assign({ time: state.current.time }, state.current.conf))
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
