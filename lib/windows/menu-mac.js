/**
 * macos 自定义菜单
 */
const { Menu } = require('electron')
const template = [
	{
		label:"文件",
		submenu:[
			{
				label:"打开",
				click:()=>{
					console.log("我点击了")
				}
			}
		]
	},
	{
		label:"help",
		submenu:[
			{
				label:"open developer tools",
				// role:'copy',
				// icon: 'public/image/tool.png',
				click:()=>{
					require('./index.js').webContents.openDevTools()
				}
			},
			{
				label:"github",
				// accelerator:'ctrl+v'
				click() {
					require('electron').shell.openExternal('https://github.com/itpika/knight')
				}
			},
		]
	}
]
const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)