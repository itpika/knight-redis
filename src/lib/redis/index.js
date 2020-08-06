const Redis = require('ioredis')


// ioredis：https://www.npmjs.com/package/ioredis

const redisOptions = {
  // redis遇到错误尝试重连，默认只在 READONLY 状态进行重连
  reconnectOnError: function(err) {
    console.error(err)
    // var targetError = 'READONLY'
    return true
  },
  // 尝试重连机制
  retryStrategy: function (times) {
    var delay = Math.min(times * 50, 2000)
    return delay
  }
}
const pool = {}

module.exports = {
  connection: function(conf) {
    if (pool[conf.time]) {
      return
    }
    const cli = new Redis({ host: conf.address, port: conf.port, password: conf.passwd }, redisOptions)
    pool[conf.time] = cli
    console.info('%s:%s@%s', conf.address, conf.port, conf.passwd)
  },
  disconnect: function(time) {
    if (!pool[time]) {
      return
    }
    pool[time].disconnect()
    delete pool[time]
  }
}