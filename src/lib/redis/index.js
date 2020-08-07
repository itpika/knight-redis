const Redis = require('ioredis')
const singal = require('./singal.js')
const { resolve } = require('core-js/fn/promise')
// ioredis：https://www.npmjs.com/package/ioredis

const pool = {}
module.exports = {
  connection: async function(conf) {
    return new Promise(resolve => {
      if (pool[conf.time]) {
        resolve()
        return
      }
      // conf.port = 6381
      
      if (await this.Ping(cli) !== 1) {
        return 0
      }
      pool[conf.time] = cli
      console.info('%s:%s@%s', conf.address, conf.port, conf.passwd)
      return 1
    })

  },
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
      reconnectOnError: function(err) {
        console.error('err:--', err.toString())
        if (err.message.includes('NOAUTH Authentication')) {
          // 需要密码
          resolve(singal.NO_AUTH)
          return false
        } else if (err.message.includes('NOAUTH Authentication')) {
          // 密码错误
          resolve(singal.NO_AUTH)
          return false
        } else if (err.message.includes('READONLY')) {
          return true
        }
        return false
      },
      // 尝试重连机制
      retryStrategy: function (times) {
        // console.log(times)
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      connectTimeout: conf.connectTimeout ? conf.connectTimeout : 10000
    })
  })
}
async function Ping (cli) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(0)
    }, 10000);

    (async() => {
      if (await cli.ping('ok') === 'ok') {
        resolve(1)
      }
    })()
  })
},