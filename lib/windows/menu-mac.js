/**
 * macos 自定义菜单
 */
const { Menu } = require('electron')
const template = [
	{
		label:"Electron",
		submenu: [{
			label: 'Import',
			accelerator: process.platform === 'darwin' ? 'Cmd+Shift+T' : 'Control+Shift+T',
			click: () => {
				require('../../lib/windows/index.js').webContents.copy();
			}
		}, {
			label: 'Export',
			accelerator: process.platform === 'darwin' ? 'Cmd+Shift+P' : 'Control+Shift+P',
			click: () => {
				require('../../lib/windows/index.js').webContents.paste();
			}
		}]
	},
	{
		label:"edit",
		submenu: [{
			role: 'Copy',
			accelerator: process.platform === 'darwin' ? 'Cmd+C' : 'Control+C',
			click: () => {
				require('../../lib/windows/index.js').webContents.copy();
			}
		}, {
			role: 'Paste',
			accelerator: process.platform === 'darwin' ? 'Cmd+V' : 'Control+V',
			click: () => {
				require('../../lib/windows/index.js').webContents.paste();
			}
		}, {
			role: 'SelectAll',
			accelerator: process.platform === 'darwin' ? 'Cmd+A' : 'Control+A',
			click: () => {
				require('../../lib/windows/index.js').webContents.selectAll();
			}
		}]
	},
	{
		label:"help",
		submenu:[
			{
				label:"open developer tools",
				// role:'copy',
				// icon: 'public/image/tool.png',
				accelerator: process.platform === 'darwin' ? 'Cmd+Shift+I' : 'Control+Shift+I',
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