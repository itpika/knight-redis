const { ipcMain, clipboard } = require('electron')
const redis = require('../redis/index.js')
// 异步
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// })
// 同步
// event.returnValue = 'fail'

/**
 * 打开开发者工具
 */
ipcMain.on('openDevelopTool', async (event, data) => {
  require('../windows/index.js').webContents.openDevTools()
})

/**
 * 打开浏览器访问一个地址
 */
ipcMain.on('openBrowserUri', async (event, uri) => {
  require('electron').shell.openExternal(uri)
})
/**
 * 获取系统剪切板内容
 */
ipcMain.on('getClipboard', async (event, data) => {
  const text = clipboard.readText()
  event.reply('getClipboard', { time: data.time, text })
})
/**
 * 设置系统剪切板内容
 */
ipcMain.on('setClipboard', async (event, data) => {
  const text = data.text.trim()
  if (text !== '') clipboard.writeText(data.text)
})

// 渲染进程通知新建连接(同步)
ipcMain.on('initConnect', async (event, conf) => {
  /**
   * conf
   * {time: '1596697213288', address: '127.0.0.1', port: 8080, passwd: '123'}
  */
  const code = await redis.connection(conf)
  event.reply('conection-notify', { time: conf.time, code })
})
// 渲染进程通知关闭连接(异步)
ipcMain.on('closeConnect', (event, time) => {
  redis.disconnect(time)
})
// 获取所有key
ipcMain.on('getAllKey', async (event, data) => {
  const keys = await redis.getAllKey(data)
  event.reply('getAllKey', { time: data.time, keys })
})
// 保存string
ipcMain.on('saveString', async (event, data) => {
  const cli = redis.getConnectByTime(data.time)
  await cli.select(data.index)
  const exists = await cli.exists(data.key)
  if (exists === 0) {
    event.reply('saveString', { time: data.time, key: data.key, code: -2 })
    return  
  }
  const ret = await cli.set(data.key, data.value)
  let code = ret === 'OK' ? 1 : -1
  event.reply('saveString', { time: data.time, key: data.key, code })
})
// 保存List
ipcMain.on('saveList', async (event, data) => {
  const cli = redis.getConnectByTime(data.time)
  await cli.select(data.index)
  const exists = await cli.exists(data.key)
  if (exists === 0) { // 判断key是否存在
    event.reply('saveList', { time: data.time, key: data.key, code: -2 }) // -2: key不存在
    return
  }
  if (await cli.llen(data.key) < data.listIndex + 1) { // 判断长度
    event.reply('saveList', { time: data.time, key: data.key, code: -3 }) // -3: key内容已经被修改
    return
  }
  const ret = await cli.lset(data.key, data.listIndex, data.value)
  let code = ret === 'OK' ? 1 : -1
  let keys
  if (data.realTime === '1') {
    keys = await cli.lrange(data.key, 0, -1)
  }
  event.reply('saveList', { time: data.time, key: data.key, code, keys, 
    realTime: data.realTime, listIndex: data.listIndex, value: data.value })
})
// 保存set
ipcMain.on('saveSet', async (event, data) => {
  const cli = redis.getConnectByTime(data.time)
  await cli.select(data.index)
  const exists = await cli.exists(data.key)
  if (exists === 0) { // 判断key是否存在
    event.reply('saveSet', { time: data.time, key: data.key, code: -2 }) // -2: key不存在
    return
  }
  await cli.srem(data.key, data.oldValue) // 删除旧值
  const ret = await cli.sadd(data.key, data.value) // 添加新值
  let code = (ret === 1 || ret === 0) ? 1 : -1
  let keys
  if (data.realTime === '1') { // 实时获取所有值
    keys = await cli.smembers(data.key)
  }
  event.reply('saveSet', { time: data.time, key: data.key, code, keys, 
    realTime: data.realTime, oldValue: data.oldValue, value: data.value })
})
// 保存zset
ipcMain.on('saveZSet', async (event, data) => {
  const cli = redis.getConnectByTime(data.time)
  await cli.select(data.index)
  const exists = await cli.exists(data.key)
  if (exists === 0) { // 判断key是否存在
    event.reply('saveZSet', { time: data.time, key: data.key, code: -2 }) // -2: key不存在
    return
  }
   // 删除旧值
  await cli.zrem(data.key, data.oldValue), data.oldValue
  const ret = await cli.zadd(data.key, data.score, data.value) // 添加新值
  let code = (ret === 1 || ret === 0) ? 1 : -1
  const scores = [], values = []
  if (data.realTime === '1') { // 实时获取所有值
    const count = await cli.zcard(data.key)
    const result = await cli.zrange(data.key, 0, count-1, 'withscores')
    for (let i = 0; i < result.length; i++) {
      i % 2 === 0 ? values.push(result[i]) : scores.push(result[i])
    }
  }
  event.reply('saveZSet', { time: data.time, key: data.key, code, 
    realTime: data.realTime, values, scores, oldValue: data.oldValue, score: data.score, value: data.value })
})
// 保存saveHash
ipcMain.on('saveHash', async (event, data) => {
  const cli = redis.getConnectByTime(data.time)
  await cli.select(data.index)
  const exists = await cli.exists(data.key)
  if (exists === 0) {
    event.reply('saveHash', { time: data.time, key: data.key, code: -2 })
    return  
  }
  const ret = await cli.hset(data.key, data.hkey, data.hvalue)
  let code = (data.type === 1 && (ret === 0 || ret === 1)) ? 1 : -1 // type=1, hset是修改原来的key
  // 实时更新？重新获取所有hash的键值
  let keys
  const values = []
  if (data.realTime === '1') {
    let val = await cli.hgetall(data.key)
    keys = Reflect.ownKeys(val)
    for (const v of keys) {
      values.push(val[v])
    }
  }
  event.reply('saveHash', { time: data.time, key: data.key, 
    code, realTime: data.realTime, hkey: data.hkey, hvalue: data.hvalue, keys, values })
})
// 删除key
ipcMain.on('removeKey', async (event, data) => {
  const keys = await redis.removeKey(data)
  if (keys !== null) {
    event.reply('removeKey', { time: data.time, keys })
  } else {
    event.reply('removeKey', { time: data.time })
  }
})
// 保存key
ipcMain.on('setKey', async (event, data) => {
  const ret = await redis.setKey(data)
  if (ret) {
    const keys = await redis.getAllKey(data)
    event.reply('setKeyOK', { time: data.time, keys })
  }
})
// 重命名key
ipcMain.on('rename', async (event, data) => {
  const ret = await redis.renameKey(data)
  let keys
  if (data.realTime === '1' && ret === 1) { // 是否实时更新，重新获取所有key
    keys = await redis.getAllKey(data)
  }
  event.reply('renameKey', { time: data.time, ret: ret === 1, realTime: data.realTime, keys, key: data.key, newKey: data.newKey })
})
// 执行命令
ipcMain.on('sendCommand', async (event, data) => {
  const ret = await redis.sendCommand(data)
  event.reply('commandResult', { time: data.time,
    text: ret.code === 0 ? ret.data : 'unknown command: ' + data.command })
})
// save ttl
ipcMain.on('saveTTL', async (event, data) => {
  const cli = redis.getConnectByTime(data.time)
  await cli.select(data.index)
  event.reply('saveTTL', {
    time: data.time,
    data: await cli.expire(data.key, data.ttl),
  })
})
// 获取key详情
ipcMain.on('keyDetail', async (event, data) => {
  const ret = await redis.keyDetail(data)
  let keys
  if (data.liveUpdate === "1") {
    keys = await redis.getAllKey(data)
  }
  event.reply('keyDetail', { time: data.time, data: ret, keys })
})
// 最小化窗口
ipcMain.on('minWindow', async (event, data) => {
  const win = require('../windows/index.js')
  if (!win.isMinimized()) {
    win.minimize()
  }
})
// 最大化窗口
ipcMain.on('maxWindow', async (event, data) => {
  const win = require('../windows/index.js')
  if (!win.isMaximized()) {
    win.maximize()
  }
})
// 退出最大化
ipcMain.on('unmaxWindow', async (event, data) => {
  const win = require('../windows/index.js')
  win.unmaximize()
})
// 退出程序
ipcMain.on('exit', async (event, data) => {
  const win = require('../windows/index.js')
  win.close()
})
