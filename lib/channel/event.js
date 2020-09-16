const { ipcMain, clipboard } = require('electron')
const redis = require('../redis/index.js')
const singal = require('../redis/singal.js')
// 异步
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// })
// 同步
// event.returnValue = 'fail'

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
// 删除key
ipcMain.on('removeKey', async (event, data) => {
  const keys = await redis.removeKey(data)
  if (keys !== null) {
    event.reply('getAllKey', { time: data.time, keys })
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
// 执行命令
ipcMain.on('sendCommand', async (event, data) => {
  const ret = await redis.sendCommand(data)
  event.reply('commandResult', { time: data.time,
    text: ret.code === 0 ? ret.data : 'unknown command: ' + data.command })
})
// 获取key详情
ipcMain.on('keyDetail', async (event, data) => {
  const ret = await redis.keyDetail(data)
  event.reply('keyDetail', { time: data.time, data: ret })
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
