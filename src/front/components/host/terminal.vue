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
      <canvas  style="z-index: 0;" id="shell-text-layer"></canvas>
      <canvas @click.stop="listenKeyboard = 1" @mouseout="listenKeyboard = 0" style="z-index: 3;" id="shell-cursor-layer"></canvas>
    </div>
  </div>
</template>
<script>
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
      fontSize: 14, // 字体大小
      lineInterval: 4, // 行间隔
      currentData: '', // 当前行文本的内容
      lineNum: 0,
      cursorSite: 0,
      listenKeyboard: 0, // 是否监听键盘按下
      showKeyCode: [ // 键盘可显示字符
        32,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111,
        186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222
      ],
      operateKeyCode: [ // 键盘操作字符
        37, 39
      ]
    }
  },
  methods: {
    leftBack () {
      this.current.shellState.open = false
    },
    getBodyWidth() {
      const obj = document.getElementById('shellBody')
      if (!obj) return 0
      this.terminalWidth = obj.clientWidth - 20 // #shellBody 有20的padding，要减去
      return obj.clientWidth
    },
    getBodyHeight() {
      const obj = document.getElementById('shellBody')
      if (!obj) return 0
      this.terminalHeight = obj.clientHeight
      return obj.clientHeight
    },
    // 绘制行头
    writePrifix(lineNum) {
      const text = document.getElementById('shell-text-layer').getContext('2d')
      text.fillStyle = '#00cc74'
      text.font = this.fontSize + 'px Monaco' // Menlo, Monaco
      text.fillText(this.perfix, 0, this.fontSize + this.lineInterval)
      this.currentData = this.perfix
      this.lineNum = lineNum
      this.writeCursor(this.$data.cursorCtx.measureText(this.currentData).width, this.currentData.length)
    },
    // 绘制光标
    writeCursor(width, index) {
      // 清除旧光标
      this.$data.cursorCtx.clearRect(0, 0, this.terminalWidth, this.terminalHeight)
      // 绘制新光标，计算前面文本的宽度后再绘制,宽：8，高：字体宽度再加 5
      this.$data.cursorCtx.fillRect(width, this.lineInterval + (this.lineNum - 1) * this.fontSize, 8, this.fontSize + 5)
      this.cursorSite = index // 记录光标的索引位置
      console.log(index)
    }
  },
  mounted() {
    // 监听宽高变化，同步canvas画布
    window.addEventListener('resize', this.getBodyWidth)
    window.addEventListener('resize', this.getBodyHeight)
    this.$nextTick(() => {
      this.getBodyWidth() // 初始化画布宽
      this.getBodyHeight() // 初始化画布高
      this.$nextTick(() => {
        this.$data.listenKeyboard = 1
        this.$data.textCtx = document.getElementById('shell-text-layer').getContext('2d')
        this.$data.textCtx.fillStyle = '#00cc74'
        this.$data.textCtx.font = this.fontSize + 'px Monaco' // Menlo, Monaco
        this.$data.cursorCtx = document.getElementById('shell-cursor-layer').getContext('2d')
        this.$data.cursorCtx.font = this.fontSize + 'px Monaco' // Menlo, Monaco 设置字体样式
        this.$data.cursorCtx.fillStyle = '#fff' // 字体颜色
        this.writePrifix(1) // 绘制前缀头
      })
    })
  },
  created() {
    // 监听键盘事件
    document.onkeydown = (e) => {
      if (!this.listenKeyboard) return
      console.log(e.key, e.keyCode)
      if (this.showKeyCode.includes(e.keyCode)) { // 键盘可显示字符
        // 计算宽度，在光标的位置写入新数据
        // if (this.cursorSite === this.currentData.length) {
        //   this.$data.textCtx.fillText(this.currentData, this.$data.textCtx.measureText(this.currentData).width, this.lineNum * (this.lineInterval + this.fontSize))
        //   this.writeCursor(this.$data.cursorCtx.measureText(this.currentData).width, this.currentData.length - 1)
        //   return
        // }
        // 删除后面的字符（删除一个矩形来完成）特别是在中间插入字符
        const x = this.$data.cursorCtx.measureText(this.currentData.substring(0, this.cursorSite)).width // 左边的宽度
        this.$data.textCtx.clearRect(x,
          this.lineInterval + (this.lineNum - 1) * this.fontSize,
          this.$data.cursorCtx.measureText(this.currentData.substring(this.cursorSite)).width, this.fontSize)
        // 重绘制后面的数据
        const data = e.key + this.currentData.substring(this.cursorSite)
        this.$data.textCtx.fillText(data, x, this.lineNum * (this.lineInterval + this.fontSize))
        // 绘制光标
        this.currentData = this.currentData.substring(0, this.cursorSite) + data
        this.writeCursor(x + this.$data.cursorCtx.measureText(e.key).width, this.cursorSite + 1)
      } else if (this.operateKeyCode.includes(e.keyCode)) { // 操作字符
        switch (e.keyCode) {
          case 37: // 左移
            if (this.cursorSite === this.perfix.length) return // 左边的光标边界限制
            this.writeCursor(this.$data.cursorCtx.measureText(this.currentData.substring(0, this.cursorSite - 1)).width, this.cursorSite - 1)
            break
          case 39: // 右移
            this.writeCursor(this.$data.cursorCtx.measureText(this.currentData.substring(0,
              (this.cursorSite + 1) < this.currentData.length ? (this.cursorSite + 1) : this.currentData.length)).width,
            this.cursorSite < this.currentData.length ? this.cursorSite + 1 : this.cursorSite)
            break
          default:
            break
        }
      }
    }
  },
  watch: {
    // 监听父容器的宽高，动态设置canvas画布宽高
    terminalHeight(val, old) {
      const text = document.getElementById('shell-text-layer')
      const textCtx = text.getContext('2d')
      const cursor = document.getElementById('shell-cursor-layer')
      const cursorCtx = cursor.getContext('2d')
      // 保存文本和光标
      let textData, cursorData
      if (old !== 0) {
        textData = textCtx.getImageData(0, 0, this.terminalWidth, old)
        cursorData = cursorCtx.getImageData(0, 0, this.terminalWidth, old)
      }
      // 设置画布的宽高
      text.height = val
      cursor.height = val
      // 复原图像
      if (old !== 0) {
        textCtx.putImageData(textData, 0, 0)
        cursorCtx.putImageData(cursorData, 0, 0)
      }
    },
    // 监听父容器的宽高，动态设置canvas画布宽高
    terminalWidth(val, old) {
      const text = document.getElementById('shell-text-layer')
      const textCtx = text.getContext('2d')
      const cursor = document.getElementById('shell-cursor-layer')
      const cursorCtx = cursor.getContext('2d')
      // 保存图像
      let imgData, cursorData
      if (old !== 0) {
        imgData = textCtx.getImageData(0, 0, this.terminalWidth, old)
        cursorData = cursorCtx.getImageData(0, 0, this.terminalWidth, old)
      }
      // 设置画布的宽高
      text.width = val
      cursor.width = val
      // 复原图像
      if (old !== 0) {
        textCtx.putImageData(imgData, 0, 0)
        cursorCtx.putImageData(cursorData, 0, 0)
      }
    }
  }
}
</script>
<style lang="less" scoped>
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
