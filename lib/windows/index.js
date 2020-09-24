const { BrowserWindow } = require('electron')
const path = require('path')
// 创建浏览器窗口
const app = new BrowserWindow({
	width: 1400,
	height: 800,
	minWidth: 700,
	minHeight: 400,
	webPreferences: {
		nodeIntegration: true,
		preload: path.join(__dirname, './render.js')
	},
	center: true,
	frame: false,
	// vibrancy: 'dark',
	transparent: true,
	show: false, // 启动时不显示
	titleBarStyle: 'hidden'// hidden, hiddenInset
})
app.once('ready-to-show', () => { // 渲染进程准备好显示
	const hosts = require('../common/util.js').sendLocalHost()
	// 发送本地的host数据到渲染进程
	app.webContents.send('localHostData', hosts)
	app.show() // 显示主窗口
})
// 监听窗口最大化，通知渲染进程
app.on('maximize', () => {
	app.webContents.send('maximize')
})
// 监听窗口取消最大化，通知渲染进程
app.on('unmaximize', () => {
	app.webContents.send('unmaximize')
})
require('./menu-mac.js')
module.exports = app