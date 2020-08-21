<template>
  <!-- 底层命令行抽屉 -->
  <div class="terminal">
    <!-- 头部 -->
    <div class="header">
      <div class="addTitle">Shell</div>
      <i @click.stop="current.shellState.open = false" class="el-icon-close"/>
    </div>
    <!-- 主体 -->
    <div id="shellBody">
    </div>
  </div>
</template>
<script>
import { Terminal } from 'xterm'
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
      lineInterval: 4, // 行间隔
      currentData: '', // 当前行文本的内容
      lineNum: 0, // 行号
      cursorSite: 0, // 光标在当前行的索引位置
      listenKeyboard: 0, // 是否监听键盘按下
      allText: null, // 所有的画布文本内容
      allCursor: null, // 所有的画布光标内容
      showKeyCode: [ // 键盘可显示字符
        32,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111,
        186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222
      ],
      operateKeyCode: [ // 键盘操作字符
        8, 13, 37, 39
      ]
    }
  },
  methods: {
    leftBack () {
      this.current.shellState.open = false
    },
    mousewheel(e) { // 鼠标滚轮滚动
    }
  },
  mounted() {
    const term = new Terminal({
      cols: 10,
      rows: 10,
      fontFamily: 'courier',
      theme: {
        foreground: '#00cc74',
        background: '#000',
        cursor: '#fff',
        cursorAccent: '#000'
      },
      bellStyle: 'both'
    })
    term.open(document.getElementById('shellBody'))
    // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    // term.textarea.hidden = true
    // term.setOption
    // term.focus()
    term.write('Hello from')
    term.clear()
    // term.onKey((a1, a2) => {
    //   console.log(a1, a2)
    // })
  },
  created() {
    // 监听键盘事件
    // document.onkeydown = (e) => {
    //   if (!this.listenKeyboard) return
    //   // console.log(e.key, e.keyCode)
    //   if (this.showKeyCode.includes(e.keyCode)) { // 键盘可显示字符
    //   } else if (this.operateKeyCode.includes(e.keyCode)) { // 操作字符
    //     switch (e.keyCode) {
    //       case 37: // 左移
    //         break
    //       case 39: // 右移
    //         break
    //       case 8: // 回退
    //         break
    //       case 13: // 回车换行
    //         break
    //       default:
    //         break
    //     }
    //   }
    // }
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
    canvas {
      position: absolute;
      box-sizing: border-box;
      top: 0;
      left: 0;
      padding: 0 10px;
      font-size: 12px;
    }
  }
}
</style>
