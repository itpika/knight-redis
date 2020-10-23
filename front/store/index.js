import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.js'
import host from './modules/host.js'
import hostView from './modules/hostView.js'
import newKey from './modules/newKey.js'
import redis from './modules/redis.js'
import saveKey from './modules/saveKey.js'
import { NO_AUTH, PASSWD_ERROR, CONNECT_TIMEOUT, FAIL, STRING } from '../../lib/redis/singal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    app,
    host,
    hostView,
    redis,
    saveKey,
    newKey
  }
})

if (window.ipcRenderer) {
  /**
   * host主机连接成功与否通知
   */
  window.ipcRenderer.on('conection-notify', (event, data) => {
    // 跟新状态机的host的连接状态
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].connectState = data.code
        switch (data.code) {
          case NO_AUTH:
            hostView.state.all[i].dialogState.promptTest = 'Require Password'
            break
          case PASSWD_ERROR:
            hostView.state.all[i].dialogState.promptTest = 'Password authentication failed'
            break
          case CONNECT_TIMEOUT:
            hostView.state.all[i].dialogState.promptTest = 'Connection timeout'
            break
          case FAIL:
            hostView.state.all[i].dialogState.promptTest = 'Connection fail'
            break
          default:
            break
        }
        break
      }
    }
    console.log(hostView.state.current, data)
  })
  /**
   * 获取所有key
   */
  window.ipcRenderer.on('getAllKey', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].dbData = data.keys
        hostView.state.all[i].dbLoading = false
        break
      }
    }
  })
  /**
   * 删除key通知
   */
  window.ipcRenderer.on('removeKey', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        if (data.keys) hostView.state.all[i].dbData = data.keys
        hostView.state.all[i].dbLoading = false
        hostView.state.all[i].deleteKeyOK = 1
        break
      }
    }
  })
  /**
   * 重命名key通知
   */
  window.ipcRenderer.on('renameKey', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        if (!data.ret) { // 更新失败
          hostView.state.all[i].keyDetail.renameStatus = -1
        } else {
          if (data.realTime === '1') { // 实时更新
            hostView.state.all[i].dbData = data.keys
          } else { // 手动更新
            for (let j = 0; j < hostView.state.all[i].dbData.length; j++) {
              if (data.key === hostView.state.all[i].dbData[j]) {
                hostView.state.all[i].dbData[j] = data.newKey
                break
              }
            }
          }
          hostView.state.all[i].keyDetail.renameStatus = 1
          hostView.state.all[i].keyDetail.rename = false
          hostView.state.all[i].keyDetail.newKeyName = ''
          hostView.state.all[i].keyDetail.keyName = data.newKey
        }
        hostView.state.all[i].dbLoading = false
        break
      }
    }
  })
  /**
   * 设置key成功
   */
  window.ipcRenderer.on('setKeyOK', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].dbLoading = false
        hostView.state.all[i].dbData = data.keys
        newKey.state.ok = true
        break
      }
    }
  })
  /**
   * 接收key详情数据
   */
  window.ipcRenderer.on('keyDetail', (event, data) => {
    if (hostView.state.current.keyDetail.ttlTimer) clearInterval(hostView.state.current.keyDetail.ttlTimer) // 打开新key详情，清除上一次key可能存在的ttl定时器
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        if (data.keys) { // 是否热更新数据
          hostView.state.all[i].dbData = data.keys
        }
        if (data.data.exists === 0) { // key不存在
          hostView.state.all[i].keyExists = 1
          hostView.state.all[i].existsKeyName = data.data.name
          hostView.state.all[i].keyDetailShow = false
          if (!data.keys) { // 没有热更新，手动删除不存在的key
            const db = []
            for (const v of hostView.state.all[i].dbData) {
              if (v !== data.data.name) db.push(v)
            }
            hostView.state.all[i].dbData = db
          }
          return
        }
        if (data.data.type === STRING.upName) hostView.state.all[i].keyDetail.saveDrop = false // 如果是string类型，进入详情可以直接保存
        hostView.state.all[i].keyDetail.type = data.data.type
        hostView.state.all[i].keyDetail.ttl = data.data.ttl
        hostView.state.all[i].keyDetail.value = data.data.value
        if (hostView.state.all[i].keyDetail.ttl > 0) { // ttl 定时器
            ((current) => {
              current.keyDetail.ttlTimer = setInterval(() => {
                if (current.keyDetail.ttl > 0) { // key过期刷新key列表
                  current.keyDetail.ttl--
                } else {
                  clearInterval(current.keyDetail.ttlTimer)
                  // 刷新key列表
                  current.dbLoading = true
                  current.keyDetailShow = false // 关闭key详情窗口
                  redis.mutations.getAllKey(redis.state, { index: current.selectDB, time: current.time })
                  current.keyDetail.ttlTimer = null
                }
              }, 1000)
            })(hostView.state.all[i])
        }
        break
      }
    }
  })
  /**
   * 命令结果返回
   * { time: data.time, code: ret.code, data: ret.data | null })
   */
  window.ipcRenderer.on('commandResult', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].shellState.commandExecCode = 1
        hostView.state.all[i].shellState.commandExecData = data.text
        break
      }
    }
  })
  /**
   * 获取剪切板的内容
   */
  window.ipcRenderer.on('getClipboard', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].shellState.clipboardText = data.text
        hostView.state.all[i].shellState.paste = 1
        break
      }
    }
  })
  // 窗口最大化
  window.ipcRenderer.on('maximize', () => {
    app.state.winMax = true
  })
  // 窗口取消最大化
  window.ipcRenderer.on('unmaximize', () => {
    app.state.winMax = false
  })
  // 接收本地的host数据
  window.ipcRenderer.on('localHostData', (event, data) => {
    console.log(event, data)
    if (data && data instanceof Array && data.length > 0) {
      host.state.hosts = data
    }
  })
  // 设置key值，保存key通知
  window.ipcRenderer.on('saveString', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].keyDetail.saveKeyCode = data.code
        break
      }
    }
  })
  window.ipcRenderer.on('saveHash', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].keyDetail.saveKeyCode = data.code
        if (data.code !== 1) return // 没有成功
        if (data.realTime === '1') { // 实时更新hash的键值
          hostView.state.all[i].keyDetail.value.keys = data.keys
          hostView.state.all[i].keyDetail.value.values = data.values
        } else {
          const val = []
          for (let j = 0; j < hostView.state.all[i].keyDetail.value.keys.length; j++) {
            if (hostView.state.all[i].keyDetail.value.keys[j] === data.hkey) {
              hostView.state.all[i].keyDetail.value.values[j] = data.hvalue
            }
            val.push(hostView.state.all[i].keyDetail.value.values[j])
          }
          hostView.state.all[i].keyDetail.value.values = val
        }
        break
      }
    }
  })
  window.ipcRenderer.on('saveList', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].keyDetail.saveKeyCode = data.code
        if (data.code !== 1) return // 没有成功
        if (data.realTime === '1') { // 实时更新值
          hostView.state.all[i].keyDetail.value = data.keys
        } else {
          const val = []
          for (let j = 0; j < hostView.state.all[i].keyDetail.value.length; j++) {
            if (j === data.listIndex) {
              hostView.state.all[i].keyDetail.value[j] = data.value
            }
            val.push(hostView.state.all[i].keyDetail.value[j])
          }
          hostView.state.all[i].keyDetail.value = val
        }
        break
      }
    }
  })
  window.ipcRenderer.on('saveSet', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].keyDetail.saveKeyCode = data.code
        hostView.state.all[i].keyDetail.ketData.set = data.value
        if (data.code !== 1) return // 没有成功
        if (data.realTime === '1') { // 实时更新值
          hostView.state.all[i].keyDetail.value = data.keys
        } else {
          const val = []
          for (let j = 0; j < hostView.state.all[i].keyDetail.value.length; j++) {
            if (hostView.state.all[i].keyDetail.value[j] === data.oldValue) {
              hostView.state.all[i].keyDetail.value[j] = data.value
            }
            if (val.indexOf(hostView.state.all[i].keyDetail.value[j]) === -1) { // 手动去重
              val.push(hostView.state.all[i].keyDetail.value[j])
            }
          }
          hostView.state.all[i].keyDetail.value = val
        }
        break
      }
    }
  })
  window.ipcRenderer.on('saveZSet', (event, data) => {
    for (let i = 0; i < hostView.state.all.length; i++) {
      if (hostView.state.all[i].time === data.time) {
        hostView.state.all[i].keyDetail.saveKeyCode = data.code
        hostView.state.all[i].keyDetail.ketData.zset.value = data.value
        if (data.code !== 1) return // 没有成功
        if (data.realTime === '1') { // 实时更新值
          hostView.state.all[i].keyDetail.value.values = data.values
          hostView.state.all[i].keyDetail.value.scores = data.scores
        } else {
          const flag = []
          const scores = []
          const values = []
          for (let j = 0; j < hostView.state.all[i].keyDetail.value.values.length; j++) {
            if (hostView.state.all[i].keyDetail.value.values[j] === data.oldValue) {
              hostView.state.all[i].keyDetail.value.values[j] = data.value
              hostView.state.all[i].keyDetail.value.scores[j] = data.score
            }
            // 不是热更新，zset数据手动去重
            if (values.indexOf(hostView.state.all[i].keyDetail.value.values[j]) === -1) {
              flag.push({ value: hostView.state.all[i].keyDetail.value.values[j], score: hostView.state.all[i].keyDetail.value.scores[j] })
            }
          }
          // 排序
          flag.sort((a, b) => a.score - b.score)
          for (const v of flag) {
            scores.push(v.score)
            values.push(v.value)
          }
          hostView.state.all[i].keyDetail.value.scores = scores
          hostView.state.all[i].keyDetail.value.values = values
        }
        break
      }
    }
  })
}
