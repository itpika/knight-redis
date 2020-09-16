<template>
  <!-- 底层命令行抽屉 -->
  <div class="terminal">
    <!-- 头部 -->
    <div class="header bgdColor">
      <div class="addTitle">Shell</div>
      <i @click.stop="current.shellState.open = false" class="el-icon-close"/>
    </div>
    <!-- 主体 -->
    <div id="shellBody" ref="terminal">
    </div>
  </div>
</template>
<script>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

export default {
  name: 'Terminal',
  props: {
    address: String
  },
  computed: {
    current() {
      return this.$store.state.hostView.current
    },
    commandExecCode() {
      return this.$store.state.hostView.current.shellState.commandExecCode
    },
    prefix() {
      return `${this.address}[${this.selectDB}]> `
    },
    paste() {
      return this.$store.state.hostView.current.shellState.paste
    },
    copy() {
      return this.$store.state.hostView.current.shellState.clipboardText
    }
  },
  data: function () {
    return {
      selectDB: 0,
      terminalHeight: 0, // 画布高度
      contentHeight: 0, // 内容高度
      fontSize: 14, // 字体大小
      input: '', // 当前输入的内容
      histIndex: 0, // 历史指令索引
      histCommandList: [], // 历史指令集合
      currentOffset: 0 // 当前行的光标总偏移长度
    }
  },
  watch: {
    paste: function(val, old) {
      if (!val) return
      if (this.currentOffset + this.copy.length >= this.term.cols) return
      if (this.copy) {
        this.term.write(this.copy)
        this.input += this.copy
      }
      this.$store.state.hostView.current.shellState.paste = 0
    },
    commandExecCode: function(val) {
      if (!val) return
      this.term.write(this.current.shellState.commandExecData + '\n')
      this.term.prompt()
      this.$store.state.hostView.current.shellState.commandExecCode = 0
    }
  },
  methods: {
    leftBack () {
      this.current.shellState.open = false
    },
    getBodyHeight() {
      const obj = document.getElementById('shellBody')
      if (!obj) return 0
      this.terminalHeight = obj.clientHeight
      return obj.clientHeight
    },
    // 在这里处理自定义输入...
    handleInput() {
      // 判断空值
      this.term.write('\n')
      this.input = this.input.trim()
      if (this.input) {
        // 发送到后端
        this.$store.commit('redis/sendCommand', { time: this.current.time, command: this.input, index: this.selectDB })
        // 记录历史命令
        if (this.histCommandList[this.histCommandList.length - 1] !== this.input) {
          this.histCommandList.push(this.input)
          this.histIndex = this.histCommandList.length - 1
        }
        // 判断特殊命令 select
        if (/^select [0-9][0-5]?$/gi.test(this.input)) {
          const splis = this.input.split(' ')
          const index = parseInt(splis[1])
          if (splis.length === 2 && splis[0].toLowerCase() === 'select' && index < 16 && index >= 0) {
            this.selectDB = index
          }
        }
        return
      }
      this.term.prompt()
    }
  },
  beforeMount() {
    this.selectDB = this.current.selectDB || 0
  },
  mounted() {
    window.addEventListener('resize', this.getBodyHeight)
    const term = new Terminal({
      fontFamily: 'courier', // Menlo courier
      rendererType: 'canvas',
      // scrollback: 1000,
      disableStdin: false,
      cursorStyle: 'block', // 光标样式
      convertEol: true,
      cursorBlink: true, // 是否闪烁
      tabStopWidth: 4, // 制表宽度
      theme: {
        foreground: '#00cc74',
        background: '#2a2734',
        cursor: '#fff',
        // lineHeight: 20
        scrollback: 800,
        cursorAccent: '#000'
      },
      bellStyle: 'both'
    })
    this.term = term
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(new WebLinksAddon())
    term.open(this.$refs.terminal)
    fitAddon.fit()
    term.prompt = () => {
      term.write(this.prefix)
    }
    // term.onKey(data => this.send(data))
    term.prompt()
    term.focus()
    window.onresize = function() {
      fitAddon.fit()
    }
    
    // 选中复制
    // term.onSelectionChange(() => {
    //   if (term.hasSelection()) {
    //     this.copy = term.getSelection()
    //     // console.log(this.copy)
    //   }
    // })
    term.onKey(key => {
      // 每行开头前缀长度 @ashinWu:$ 
      const threshold = this.prefix.length
      // 总偏移(长度) = 输入+前缀
      const fixation = this.input.length + threshold
      // 当前x偏移量
      const offset = term._core.buffer.x
      this.currentOffset = fixation
      // 禁用Home、PgUp、PgDn、Ins、Del键
      if ([36, 33, 34, 45, 46].indexOf(key.domEvent.keyCode) !== -1) return
      // ctrl
      if ([17, 18].includes(key.domEvent.keyCode)) return

      switch (key.domEvent.keyCode) {
        // 回车键
        case 13:
          this.handleInput()
          this.input = ''
          break
        // 退格键
        case 8:
          if (offset > threshold) {
            term._core.buffer.x = offset - 1
            // \x1b[?K: 清除光标至行末的"可清除"字符
            term.write('\x1b[?K' + this.input.slice(offset - threshold))
            // 保留原来光标位置
            const cursor = '\x1b[D'.repeat(fixation - offset)
            term.write(cursor)
            this.input = `${this.input.slice(0, offset - threshold - 1)}${this.input.slice(offset - threshold)}`
          }
          break
        case 35:
          const cursor = '\x1b[C'.repeat(fixation - offset)
          term.write(cursor)
          break
        // 方向盘上键
        case 38:
          if (this.histCommandList[this.histIndex]) {
            // 将光标重置到末端
            term._core.buffer.x = fixation
            let b1 = '', b2 = '', b3 = ''
            // 构造退格(模拟替换效果) \b \b标识退一格; \b\b  \b\b表示退两格...
            for (let i = 0; i < this.input.length; i++) {
              b1 = b1 + '\b'
              b2 = b2 + ' '
              b3 = b3 + '\b'
            }
            term.write(b1 + b2 + b3)
            this.input = this.histCommandList[this.histIndex]
            term.write(this.histCommandList[this.histIndex])
            this.histIndex--
          }
          break
        // 方向盘下键
        case 40:
          if (this.histCommandList[this.histIndex]) {
            // 将光标重置到末端
            term._core.buffer.x = fixation  
            let b1 = '', b2 = '', b3 = ''
            // 构造退格(模拟替换效果) \b \b标识退一格; \b\b  \b\b表示退两格...
            for (let i = 0; i < this.histCommandList[this.histIndex].length; i++) {
              b1 = b1 + '\b'
              b2 = b2 + ' '
              b3 = b3 + '\b'
            }
            this.input = this.histCommandList[this.histIndex]
            term.write(b1 + b2 + b3)
            term.write(this.histCommandList[this.histIndex])
            this.histIndex++
          }
          break
        // 方向盘左键
        case 37:
          if (offset > threshold) {
            term.write(key.key)
          }
          break
        // 方向盘右键
        case 39:
          if (offset < fixation) {
            term.write(key.key)
          }
          break
        default:
          // ctrl, alt 组合键不打印
          if (key.domEvent.ctrlKey || key.domEvent.altKey) return
          // 限制输入最大长度 防止换行bug
          if (fixation >= term.cols) return
          // 不在末尾插入时 要拼接
          if (offset < fixation) {
            // term.write('\x1b[?K' + `${key.key}${this.input.slice(offset - threshold)}`)
            term.write(`${key.key}${this.input.slice(offset - threshold)}`)
            const cursor = '\x1b[D'.repeat(fixation - offset)
            term.write(cursor)
            this.input = `${this.input.slice(0, offset - threshold)}${key.key}${this.input.slice(offset - threshold)}`
          } else {
            term.write(key.key)
            this.input += key.key
          }
          this.histIndex = this.histCommandList.length
          break
      }
    })
    term.attachCustomKeyEventHandler(ev => {
      console.log(ev)
      // ctrl+v
      if (ev.keyCode === 86 && (ev.ctrlKey || ev.metaKey) && ev.type === 'keydown') {
        // 从主进程获取系统剪切板内容
        this.$store.commit('redis/getClipboard', { time: this.current.time })
      }
      // ctrl+c
      if (ev.keyCode === 67 && (ev.ctrlKey || ev.metaKey) && ev.type === 'keydown') {
        if (term.hasSelection()) {
          // 设置系统剪切板内容
          this.$store.commit('redis/setClipboard', { text: term.getSelection() })
        }
      }
    })

    // 若需要中文输入, 使用on data监听
    // term.on('data', function(data){
    // todo something
    // })
  },
  created() {
    // 处理鼠标按下默认事件，后续处理
    window.addEventListener('mousedown', e => e.preventDefault(), { passive: false })
    // window.addEventListener('onmousedown', e => e.preventDefault(), { passive: false })
  }
}
</script>
<style lang="less" scoped>
@import '~xterm/css/xterm.css';

.terminal {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 30%;
  width: 100%;
  .header {
    height: 15%;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 12px;
    .addTitle {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 90%;
      font-size: 12px;
    }
    > i {
      &:hover {
        color: #fff;
        cursor: pointer;
      }
      color: #bebebe;
      font-size: 14px;
      height: 14px;
    }
  }
  #shellBody {
    height: 85%;
    box-sizing: border-box;
    padding: 5px;
    background-color: #2a2734;
    :first-child {
      height: 100%;
    }
  }
}
</style>
