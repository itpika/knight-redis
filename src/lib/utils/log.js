const util = require('util')
const colors = require('colors')
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'red',
  info: 'green',
  data: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red'
})

const log = {
  $(type, color, ...p) {
    p[0] = (`${type} ` + p[0])[color]
    util.log.apply(util, p)
  },
  ok() { this.$('   [ OK ]', 'green', ...arguments) },
  error() { this.$('[ ERROR ]', 'red', ...arguments) },
  info() { this.$(' [ INFO ]', 'grey', ...arguments) },
  stack(e) {
    let matchs = e.stack.match(/^([^\)]+\)).*/)
    matchs = matchs === null ? e.stack : matchs[0]
    this.$('[ STACK ]', 'blue', '%s', matchs.replace(/\n\s+/, ' => '))
  },
  debug() { this.$('[ DEBUG ]', 'yellow', ...arguments) },
  notic() { this.$('[ NOTIC ]', 'magenta', ...arguments) }
}

module.exports = log
