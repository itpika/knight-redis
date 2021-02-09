const Redis = require('ioredis');
const singal = require('./singal.js');
// ioredis：https://www.npmjs.com/package/ioredis

const pool = {}
module.exports = {
  /**
   * 建立一个连接
   */
  connection: async function(conf) {
    // console.log(conf)
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
   * 获取指定的连接
   */
  getConnectByTime: function (time) {
    return pool[time]
  },
  /**
   * 重命名key
   */
  renameKey: async function (data) {
    await pool[data.time].select(data.index)
    return await pool[data.time].renamenx(data.key, data.newKey)
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
    let ret
    switch (data.type) {
      case require('./singal.js').STRING.value: // string
        if (data.expireModel) {
          ret = await pool[data.time].set(data.key, data.value, data.expireModel, data.expireTime)
        } else {
          ret = await pool[data.time].set(data.key, data.value)
        }
        return ret === 'OK'
      case require('./singal.js').LIST.value: // list
        ret = await pool[data.time].lpush(data.key, data.value)
        if (data.expireModel) {
          const seconds = data.expireModel === 'EX' ? data.expireTime : Math.floor(data.expireTime / 1000)
          await pool[data.time].expire(data.key, seconds)
        }
        break
      case require('./singal.js').HASH.value: // hash
        ret = await pool[data.time].hset(data.key, data.hashKey, data.value)
        if (data.expireModel) {
          const seconds = data.expireModel === 'EX' ? data.expireTime : Math.floor(data.expireTime / 1000)
          await pool[data.time].expire(data.key, seconds)
        }
        break
      case require('./singal.js').SET.value: // set
        ret = await pool[data.time].sadd(data.key, data.value)
        if (data.expireModel) {
          const seconds = data.expireModel === 'EX' ? data.expireTime : Math.floor(data.expireTime / 1000)
          await pool[data.time].expire(data.key, seconds)
        }
        break
      case require('./singal.js').ZSET.value: // zset
        ret = await pool[data.time].zadd(data.key, data.score, data.value)
        if (data.expireModel) {
          const seconds = data.expireModel === 'EX' ? data.expireTime : Math.floor(data.expireTime / 1000)
          await pool[data.time].expire(data.key, seconds)
        }
        break
      default:
        break
    }
    return ret === 1
  },
  /**
   * 执行命令
   */
  sendCommand: async function(data) {
    const commands = data.command.split(' ')
    let ret
    try {
      await pool[data.time].select(data.index)
      ret = await pool[data.time].send_command(commands[0], commands.slice(1))
      console.log(ret)
      // string，boolean， number类型之间返回
      if (['string', 'number', 'boolean'].includes(typeof ret)) return {code: 0, data: ret}
      // nul和undefined直接返回
      if (ret === null || ret === undefined) return {code: 0, data: 'null'}
      let s = ''
      if (ret instanceof Array) { // list
        for (let i = 0; i < ret.length; i++) {
          s += `${i+1})  ${ret[i]}\n`
        }
      } else { // object
        const keys = Reflect.ownKeys(ret)
        if (keys.length === 0) {
          s = '{}'
        } else {
          s = '{\n'
          for (k of keys) {
            s += `  ${k}: ${ret[k]},\n`
          }
          s += '}'
        }
      }
      ret = s.trim()
    } catch (error) {
      console.log(error)
      return {code: -1}
    }
    return {code: 0, data: ret}
  },
  /**
   * 获取key详情
   */
  keyDetail: async function(data) {
    await pool[data.time].select(data.index)
    const exists = await pool[data.time].exists(data.key)
    if (exists === 0) { // key不存在
      return { name: data.key, exists: 0 }
    }
    const keyType = await pool[data.time].type(data.key)
    const ret = {
      name: data.key,
      exists: 1,
      type: keyType.toUpperCase(),
    }
    let val
    switch (keyType) {
      case 'string':
        val = await pool[data.time].get(data.key)
        ret.value = val
        break;
      case 'hash':
        ret.value = {
          values: []
        }
        val = await pool[data.time].hgetall(data.key)
        ret.value.keys = Reflect.ownKeys(val)
        for (const v of ret.value.keys) {
          ret.value.values.push(val[v])
        }
        break;
      case 'list':
        ret.value = await pool[data.time].lrange(data.key, 0, -1)
        break;
      case 'set':
        ret.value = await pool[data.time].smembers(data.key)
        break;
      case 'zset':
        const count = await pool[data.time].zcard(data.key)
        const result = await pool[data.time].zrange(data.key, 0, count-1, 'withscores')
        ret.value = {
          scores: [],
          values: []
        }
        for (let i = 0; i < result.length; i++) {
          i % 2 === 0 ? ret.value.values.push(result[i]) : ret.value.scores.push(result[i])
        }
        break;
      default:
        break;
    }
    const ttl = await pool[data.time].ttl(data.key)
    ret.ttl = ttl
    return ret
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
  console.log(conf)
  return new Promise(resolve => {
    const cli = new Redis({ host: conf.address, port: conf.port, password: conf.passwd, tls: conf.tls ? {
      host: conf.address, port: conf.port,
      ca: require('fs').readFileSync(conf.clientCacert),
      cert: require('fs').readFileSync(conf.clientCert),
      dhparam: '/usr/local/etc/redis-tls/redis.dh',
      key: require('fs').readFileSync(conf.clientKey),
    } : null}, {
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