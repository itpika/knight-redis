const Redis = require('ioredis')


// ioredis：https://www.npmjs.com/package/ioredis

const redisOptions = {
  // redis遇到错误尝试重连，默认只在 READONLY 状态进行重连
  reconnectOnError: function(err) {
    console.error('err:--', err.toString())
    if (err.message.includes('NOAUTH Authentication')) {
      return false
    }
    return false
  },
  // 尝试重连机制
  retryStrategy: function (times) {
    // console.log(times)
    const delay = Math.min(times * 50, 2000)
    return delay
  }
}
const pool = {}

module.exports = {
  connection: async function(conf) {
    if (pool[conf.time]) {
      return
    }
    if (conf.connectTimeout) redisOptions.connectTimeout = conf.connectTimeout
    // conf.port = 6381
    const cli = new Redis({ host: conf.address, port: conf.port, password: conf.passwd }, redisOptions)
    if (await this.Ping(cli) !== 1) {
      return 0
    }
    cli.auth()
    pool[conf.time] = cli
    console.info('%s:%s@%s', conf.address, conf.port, conf.passwd)
    return 1
  },
  disconnect: function(time) {
    if (!pool[time]) {
      return
    }
    pool[time].disconnect()
    delete pool[time]
  },
  Ping: async function(cli) {
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
  }
}