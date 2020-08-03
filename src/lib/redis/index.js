const Redis = require('ioredis')

module.exports = async function build(conf) {
  return new Redis(conf)
}