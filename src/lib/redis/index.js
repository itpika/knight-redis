const Redis = require('ioredis')


// ioredis：https://www.npmjs.com/package/ioredis

const redisOptions = {
  // redis遇到错误尝试重连，默认只在 READONLY 状态进行重连
  reconnectOnError: function(err) {
    console.log(err)
    // var targetError = 'READONLY'
    return true
  },
  // 尝试重连机制
  retryStrategy: function (times) {
    var delay = Math.min(times * 50, 2000)
    return delay
  }
}

module.exports = async function connection(conf) {
  return new Redis(conf, redisOptions)
}