const { ipcMain } = require('electron')
const redis = require('../redis/index.js')
// 异步
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// })

// 渲染进程通知新建连接(同步)
ipcMain.on('initConnect', (event, conf) => {
  /**
   * arg
   * {
      time: '1596697213288', address: '127.0.0.1', port: 8080, passwd: '123'
    }
  */
  redis.connection(conf)
  event.returnValue = 'pong'
})
// 渲染进程通知关闭连接(异步)
ipcMain.on('closeConnect', (event, time) => {
  redis.disconnect(time)
})
