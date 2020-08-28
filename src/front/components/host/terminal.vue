<template>
  <!-- 底层命令行抽屉 -->
  <div class="terminal">
    <!-- 头部 -->
    <div class="header">
      <div class="addTitle">Shell</div>
      <i @click.stop="current.shellState.open = false" class="el-icon-close"/>
    </div>
    <!-- 主体 -->
    <div id="shellBody" ref="shellBody">
      <div id="terminal"></div>
    </div>
  </div>
</template>
<script>
import Term from 'term-web'
export default {
  name: 'Terminal',
  props: {
    address: String
  },
  computed: {
    current() {
      return this.$store.state.hostView.current
    },
    commandExecData() {
      return this.$store.state.hostView.current.shellState.commandExecData
    },
    perfix() {
      return `${this.address}[${this.current.selectDB}]> `
    }
  },
  data: function () {
    return {
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
    getBodyHeight() {
      const obj = document.getElementById('shellBody')
      if (!obj) return 0
      this.term.height = obj.clientHeight
      return obj.clientHeight
    },
    getBodyWidth() {
      const obj = document.getElementById('shellBody')
      if (!obj) return 0
      this.term.width = obj.clientWidth
      return obj.clientWidth
    }
  },
  beforeMount() {
  },
  mounted() {
    window.addEventListener('resize', this.getBodyHeight)
    window.addEventListener('resize', this.getBodyWidth)
    const term = new Term({
      container: '#terminal',
      height: document.getElementById('shellBody').clientHeight,
      width: document.getElementById('shellBody').clientWidth,
      recorder: false, // 开启右上角记录按钮
      fontFamily: 'Menlo', // Menlo,Monaco
      fontSize: 16,
      color: '#b0b2b6',
      draggable: false, // 是否可拖动
      title: '', // 首部标题
      welcome: '', // 欢迎词
      prefix: this.perfix,
      background: '#2a2734',
      loading: (val) => '<d color="yellow">Loading...</d>', // 加载提示
      // Pixel ratio
      pixelRatio: window.devicePixelRatio,
      // Callback when command is not found
      // notFound: (val) => `-bash: <d color='red'>${val}</d>: command not found`,
      notFound: (val) => { // 命令内容
        // 发送命令到主进程进行执行
        this.$store.commit('redis/sendCommand', { time: this.current.time, command: val.trim() })
      },
      watermark: '' // 命令行水印图片
    })
    this.term = term
    // this.term.output('<d color="#fff" background="red">some text</d>')
  },
  watch: {
    commandExecData: function(val, old) {
      this.term.output(val)
      this.term.input()
    }
  },
  created() {
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
  min-height: 20%;
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
    background-color: #2a2734;
  }
}
</style>
