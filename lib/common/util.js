
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
	// console.log(conf) // /Users/dalgurak/Library/Application Support/knight/dalgurak
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

const fs = require('fs');
exports.fileExist = async function (filepath) {
	return new Promise((res) => {
		fs.access(filepath, fs.constants.F_OK, err => {
			if (err) {
				res(0);
				return;
			}
			res(1);
		})
	});
}