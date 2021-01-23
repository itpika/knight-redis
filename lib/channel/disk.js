const { ipcMain } = require('electron')
/**
 * 保存host信息到磁盘
 */
ipcMain.on('addHost', async (event, data) => {
  const { app } = require('electron')
  const path = require('path')
  const os = require('os')
  const crypto = require('crypto')
  const conf = path.join(app.getPath('userData'), os.userInfo().username,
   crypto.createHash('sha256').update(os.userInfo().username).digest('hex'))

  const Store = require('electron-store')
  const s = new Store({
    name: conf,
    encryptionKey: os.userInfo().username,
    fileExtension: ''
  })
  console.log(data)
  s.set(data.id, data)
})
ipcMain.on('deleteHost', async (event, id) => {
  const { app } = require('electron')
  const path = require('path')
  const os = require('os')
  const crypto = require('crypto')
  const conf = path.join(app.getPath('userData'), os.userInfo().username,
   crypto.createHash('sha256').update(os.userInfo().username).digest('hex'))

  const Store = require('electron-store')
  const s = new Store({
    name: conf,
    encryptionKey: os.userInfo().username,
    fileExtension: ''
  })
  s.delete(id)
})