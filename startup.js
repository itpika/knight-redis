const { app, BrowserWindow, } = require('electron')

require('./lib/channel/event.js')
function createWindow () {
  const win = require('./lib/windows/index.js')
  win.removeMenu()
  // 加载index.html文件
  win.loadFile('dist/index.html')
  //当所有窗口都被关闭后退出
    app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  // shell.openPath('/var/code')
  // win.webContents.openDevTools()
}
app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
app.whenReady().then(createWindow)
