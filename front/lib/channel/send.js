// import { ipcRenderer } from 'electron'
// 同步
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// ipcRenderer.on('reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// 异步
// ipcRenderer.send('asynchronous-message', 'ping')

/**
 * 发送消息到主进程
 */
export default {
  closeConnect(time) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('closeConnect', time)
    }
  },
  windowsOpertion(event) {
    if (window.ipcRenderer) window.ipcRenderer.send(event)
  },
  sendEvent(event, data) {
    if (window.ipcRenderer) window.ipcRenderer.send(event, data)
  }
}
