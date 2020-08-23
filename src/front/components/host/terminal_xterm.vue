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
      terminalWidth: 0, // 画布宽度
      terminalHeight: 0, // 画布高度
      contentWidth: 0, // 内容宽度
      contentHeight: 0, // 内容高度
      fontSize: 14, // 字体大小
      currentData: '', // 当前行文本的内容
      lineNum: 0, // 行号
      listenKeyboard: 0 // 是否监听键盘按下
    }
  },
  methods: {
    leftBack () {
      this.current.shellState.open = false
    },
    send(data) {
      console.log(data)
      // if (data.domEvent.keyCode === 8) {
      //   return
      // }
      this.term.write(data.key)
    }
  },
  mounted() {
    const term = new Terminal({
      rows: 10,
      fontFamily: 'courier',
      rendererType: 'canvas',
      convertEol: true,
      scrollback: 1000,
      disableStdin: false,
      cursorStyle: 'block', // 光标样式
      cursorBlink: true, // 是否闪烁
      theme: {
        foreground: '#00cc74',
        background: '#000',
        cursor: '#fff',
        cursorAccent: '#000'
      },
      bellStyle: 'both'
    })
    this.term = term
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(new WebLinksAddon())
    this.term.open(this.$refs.terminal)
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
