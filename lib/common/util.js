
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
};

// document：http://www.redis.cn/commands/info.html
const INFO_KV = {
	// ---server
	version_s: {
		key: 'redis_version:',
		showKey: 'Version' // showKey: 前端页面展示的key
	},
	os_s: {
		key: 'os:',
		showKey: 'OS'
	},
	mode_s: {
		key: 'redis_mode:',
		showKey: 'Mode'
	},
	// gcc_version_s: {
	// 	key: 'gcc_version:',
	// 	showKey: 'gcc version'
	// },
	process_id_s: {
		key: 'process_id:',
		showKey: 'Process Id'
	},
	tcp_port_s: {
		key: 'tcp_port:',
		showKey: 'Port'
	},
	config_file_s: {
		key: 'config_file:',
		showKey: 'Config File'
	},
	// executable_s: {
	// 	key: 'executable:',
	// 	showKey: 'executable'
	// },
	// arch_bits_s: {
	// 	key: 'arch_bits:',
	// 	showKey: 'arch bits'
	// },
	uptime_in_seconds_s: {
		key: 'uptime_in_seconds:',
		showKey: 'Uptime In Seconds'
	},
	// ---cpu
	used_cpu_sys_s: {
		key: 'used_cpu_sys:',
		showKey: 'System CPU Used'
	},
	used_cpu_user_s: {
		key: 'used_cpu_user:',
		showKey: 'User CPU Used'
	},
	// ---client
	connected_clients_c: {
		key: 'connected_clients:',
		showKey: 'Connected Clients'
	},
	blocked_clients_c: {
		key: 'blocked_clients:',
		showKey: 'Blocked Clients'
	},
	// ---memory
	used_memory_human_m: {
		key: 'used_memory_human:',
		showKey: 'Used Memory'
	},
	total_system_memory_human_m: {
		key: 'total_system_memory_human:',
		showKey: 'System Memory'
	},
	used_memory_lua_human_m: {
		key: 'used_memory_lua_human:',
		showKey: 'Lua Used Memory'
	},
	// ---other
	// used_memory_lua_human_m: {
	// 	key: 'used_memory_lua_human:',
	// 	showKey: 'Lua Used Memory'
	// },
};

exports.handlerServerInfo = str => {
	const kvArr = str.split('\r\n').filter(v => {
    return (v !== '' && v[0] !== '#');
  });
	const dbReg = /^db[0-9]{1,2}:/
	const data = { s: {}, c: {}, m: {}, o: {} };
	for (s of kvArr) {
		for (k in INFO_KV) {
			if (s.indexOf(INFO_KV[k].key) !== -1) {
				data[k[k.length - 1]][INFO_KV[k].showKey] = s.substr(s.indexOf(':') + 1)
				break;
			}
		}
		
		if (dbReg.test(s)) {
			data.o[s.substring(0, s.indexOf(':'))] = s.substring(s.indexOf(':') + 1, s.lastIndexOf(',')).replace(',', '\r\n')
			
		}
	}
	return data;
};