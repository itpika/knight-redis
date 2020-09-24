
/**
 * 读取本地数据发送给渲染进程
 */
exports.sendLocalHost = () => {
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
	const host = []
	for (const k in s.store) {
		host.push(s.store[k])
	}
	return host
}