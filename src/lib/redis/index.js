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