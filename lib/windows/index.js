const { BrowserWindow } = require('electron')
const path = require('path')

// 创建浏览器窗口
const win = new BrowserWindow({
	width: 1400,
	height: 800,
	minWidth: 950,
	minHeight: 600,
	webPreferences: {
		nodeIntegration: true,
		preload: path.join(__dirname, './render.js')
	},
	maximizable: true,
	center: true,
	frame: false,
	// vibrancy: 'dark',
	transparent: true,
	show: false, // 启动时不显示
	titleBarStyle: 'hidden'// hidden, hiddenInset
})
win.once('ready-to-show', () => { // 渲染进程准备好显示
	const hosts = require('../common/util.js').sendLocalHost()
	// 发送本地的host数据到渲染进程
	win.webContents.send('localHostData', hosts)
	win.show() // 显示主窗口
})
// 监听窗口最大化，通知渲染进程
win.on('maximize', () => {
	win.webContents.send('maximize')
})
// 监听窗口取消最大化，通知渲染进程
win.on('unmaximize', () => {
	win.webContents.send('unmaximize')
})

require('./menu-mac.js')
module.exports = win
