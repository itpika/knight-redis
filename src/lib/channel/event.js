const { ipcMain } = require('electron')
const redis = require('../redis/index.js')
// 异步
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// })
// 同步
// event.returnValue = 'fail'


// 渲染进程通知新建连接(同步)
ipcMain.on('initConnect', async (event, conf) => {
  /**
   * conf
   * {time: '1596697213288', address: '127.0.0.1', port: 8080, passwd: '123'}
  */
  if (await redis.connection(conf) === 0) {
    // 连接失败
    // event.returnValue = 'fail'
    event.reply('conection-notify', 'fail')
  } else {
    event.reply('conection-notify', 'ok')
  }
})
// 渲染进程通知关闭连接(异步)
ipcMain.on('closeConnect', (event, time) => {
  redis.disconnect(time)
})
