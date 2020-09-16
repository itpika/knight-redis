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
	titleBarStyle: 'hidden'
})
// 监听窗口最大化，通知渲染进程
app.on('maximize', () => {
	app.webContents.send('maximize')
})
// 监听窗口取消最大化，通知渲染进程
app.on('unmaximize', () => {
	app.webContents.send('unmaximize')
})
module.exports = app