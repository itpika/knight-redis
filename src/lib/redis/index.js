const Redis = require('ioredis')
const singal = require('./singal.js')
// ioredis：https://www.npmjs.com/package/ioredis

const pool = {}
module.exports = {
  /**
   * 建立一个连接
   */
  connection: async function(conf) {
    // conf.port = 6381
    const ret = await connect(conf)
    if (ret.code === singal.OK) {
      console.info('The connect %s:%s@%s OK', conf.address, conf.port, conf.passwd)
      pool[conf.time] = ret.data
    }
    return ret.code
  },
  /**
   * 获取所有key
   */
  getAllKey: async function (data) {
    await pool[data.time].select(data.index)
    return await pool[data.time].keys('*')
  },
  /**
   * 删除key
   */
  removeKey: async function (data) {
    await pool[data.time].select(data.index)
    await pool[data.time].del(data.key)
    if (data.liveUpdate) {
      return await pool[data.time].keys('*')
    }
    return null
  },
  /**
   * 保存key
   */
  setKey: async function (data) {
    await pool[data.time].select(data.index)
    switch (data.type) {
      case require('./singal.js').STRING.value: // string
        if (data.expireModel) {
          return await pool[data.time].set(data.key, data.value, data.expireModel, data.expireTime)
        } else {
          return await pool[data.time].set(data.key, data.value)
        }
        break
      default:
        break
    }
    return null
  },
  /**
   * 执行命令
   */
  sendCommand: async function(data) {
    const commands = data.command.split(' ')
    let ret
    try {
      ret = await pool[data.time].send_command(commands[0], commands.slice(1))
      console.log(ret)
      if (!(ret instanceof String) && typeof ret === 'object' && ret !== null) {
        const keys = Reflect.ownKeys(ret)
        if (keys.length === 0) {
          ret = '{}'
        } else {
          let s = '{\n'
          for (k of keys) {
            s += `  ${k}: ${ret[k]},\n`
          }
          s += '}'
          ret = s
        }
      }
    } catch (error) {
      return {code: -1}
    }
    return {code: 0, data: ret}
  },
  /**
   * 断开连接
   */
  disconnect: function(time) {
    if (!pool[time]) {
      return
    }
    pool[time].disconnect()
    delete pool[time]
  }
}

async function connect (conf) {
  return new Promise(resolve => {
    const cli = new Redis({ host: conf.address, port: conf.port, password: conf.passwd }, {
      // 错误重连机制
      reconnectOnError: function(err) {
        if (err.message.includes('READONLY')) return true
        return false
      },
      // 尝试重连机制
      retryStrategy: function (times) {
        // console.log('retryStrategy:', times)
        return false
        // const delay = Math.min(times * 50, 2000)
        // return delay
      },
      connectTimeout: conf.connectTimeout ? conf.connectTimeout : 10000
    })
    cli.ping('ok').then(data => {
      if (data === 'ok') resolve({ code: singal.OK, data: cli })
    }).catch(err => {
      console.log('catch:', err)
      if (err.message.includes('NOAUTH Authentication')) {
        // 需要密码
        resolve({ code: singal.NO_AUTH })
      } else if (err.message.includes('invalid username-password') || err.message.includes('invalid password')) {
        // 密码错误
        resolve({ code: singal.PASSWD_ERROR })
      } else {
        resolve({ code: singal.FAIL })
      }
    })
  })
}