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
  getAllKey(data) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('getAllKey', data)
    }
  },
  removeKey(data) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('removeKey', data)
    }
  },
  setKey(data) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('setKey', data)
    }
  },
  sendCommand(data) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('sendCommand', data)
    }
  },
  keyDetail(data) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('keyDetail', data)
    }
  },
  rename(data) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('rename', data)
    }
  },
  getClipboard(data) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('getClipboard', data)
    }
  },
  setClipboard(data) {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('setClipboard', data)
    }
  },
  windowsOpertion(event) {
    if (window.ipcRenderer) window.ipcRenderer.send(event)
  },
  openDevelopTool() {
    if (window.ipcRenderer) window.ipcRenderer.send('openDevelopTool')
  },
  openBrowserUri(uri) {
    if (window.ipcRenderer) window.ipcRenderer.send('openBrowserUri', uri)
  },
  sendEvent(event, data) {
    if (window.ipcRenderer) window.ipcRenderer.send(event, data)
  }
}
