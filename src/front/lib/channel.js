// import { ipcRenderer } from 'electron'
// 同步
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// ipcRenderer.on('reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// 异步
// ipcRenderer.send('asynchronous-message', 'ping')

export default {
  // 初始化连接
  initConnect(conf) {
    window.ipcRenderer.sendSync('initConnect', conf)
  },
  closeConnect(time) {
    window.ipcRenderer.send('closeConnect', time)
  }
}
