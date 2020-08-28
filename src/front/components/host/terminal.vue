<template>
  <!-- 底层命令行抽屉 -->
  <div class="terminal">
    <!-- 头部 -->
    <div class="header">
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
    perfix() {
      return `${this.address}[${this.current.selectDB}]> `
    }
  },
  data: function () {
    return {
      terminalHeight: 0, // 画布高度
      contentHeight: 0, // 内容高度
      fontSize: 14, // 字体大小
      command: '', // 当前行文本的内容
      lineNum: 0, // 行号
      cursorIndex: 0 // 光标索引位置
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
    send(data) {
      console.log(data)
      // new TextEncoder().encode("\x00" + data)
      if (data.domEvent.keyCode === 8) { // 回退
        if (this.command.length === 0) return
        this.term.write('\b \b')
        this.command = this.command.slice(0, this.cursorIndex - 1) + this.command.slice(this.cursorIndex)
        this.cursorIndex--
        return
      } else if (data.domEvent.keyCode === 13) { // 换行
        this.cursorIndex = 0
        this.command = ''
        this.term.write('\n')
        this.term.prompt()
        return
      } else if (data.domEvent.keyCode === 37) { // left move
        if (this.cursorIndex === 0) return
        this.cursorIndex--
        this.term.write(data.key)
        return
      } else if (data.domEvent.keyCode === 38) { // top move
        return
      } else if (data.domEvent.keyCode === 39) { // right move
        if (this.command.length === this.cursorIndex) return
        this.cursorIndex++
        this.term.write(data.key)
        return
      } else if (data.domEvent.keyCode === 40) { // bottom move
        return
      }
      this.command += data.key
      this.term.write(data.key)
      this.cursorIndex++
    }
  },
  mounted() {
    window.addEventListener('resize', this.getBodyHeight)
    const term = new Terminal({
      rows: 10,
      fontFamily: 'courier', // Menlo courier
      rendererType: 'canvas',
      convertEol: true,
      scrollback: 1000,
      disableStdin: false,
      cursorStyle: 'block', // 光标样式
      cursorBlink: true, // 是否闪烁
      tabStopWidth: 4, // 制表宽度
      theme: {
        foreground: '#00cc74',
        background: '#2a2734',
        cursor: '#fff',
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
      term.write(this.perfix)
    }
    term.onKey(data => this.send(data))
    term.prompt()
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
    background-color: #1c3046;
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
    background-color: #000;
    position: relative;
  }
}
</style>
