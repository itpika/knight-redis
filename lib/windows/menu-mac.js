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
		label:"view",
		submenu:[
			{
				label:"复制",
				role:'copy'
			},
			{
				label:"粘贴",
				accelerator:'ctrl+v'
			},
		]
	},
	{
		label:"help",
		submenu:[
			{
				label:"复制",
				role:'copy'
			},
			{
				label:"粘贴",
				accelerator:'ctrl+v'
			},
		]
	}
]
const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)