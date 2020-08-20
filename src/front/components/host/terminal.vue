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
      <canvas  style="z-index: 0;overflow-y:scroll;" id="shell-text-layer"></canvas>
      <canvas @click.stop="listenKeyboard = 1" @mouseout="listenKeyboard = 0" @mousewheel="mousewheel" style="z-index: 3;" id="shell-cursor-layer"></canvas>
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
      contentWidth: 0, // 内容宽度
      contentHeight: 0, // 内容高度
      fontSize: 14, // 字体大小
      lineInterval: 4, // 行间隔
      currentData: '', // 当前行文本的内容
      lineNum: 0,
      cursorSite: 0,
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
    mousewheel(e) { // 鼠标滚轮滚动
      if (this.contentHeight - this.fontSize <= this.terminalHeight) return
      console.log(e.wheelDeltaY)
    },
    // 绘制行头
    writePrifix(lineNum) {
      const text = document.getElementById('shell-text-layer').getContext('2d')
      // console.log(lineNum * (this.fontSize + this.lineInterval))
      // 绘制前缀头
      text.fillText(this.perfix, 0, lineNum * (this.fontSize + this.lineInterval))
      this.currentData = this.perfix
      // 记录内容宽度(只记录最大值)
      if (this.contentWidth < this.$data.textCtx.measureText(this.currentData).width) this.contentWidth = this.$data.textCtx.measureText(this.currentData).width
      this.lineNum = lineNum // 记录行号
      // 记录内容高度
      this.contentHeight = lineNum * (this.fontSize + this.lineInterval) + this.fontSize
      // 绘制光标
      this.writeCursor(this.$data.cursorCtx.measureText(this.currentData).width, this.currentData.length)
      
      // TODO
      if (this.contentHeight > this.terminalHeight) { // 内容超过盒子大小，显示最下面的一行
        this.$data.textCtx.clearRect(0, 0, this.contentWidth, this.contentHeight) // 清空画布
        // 重绘制画布数据
        console.log(this.terminalHeight - this.contentHeight)
        // this.$data.textCtx.translate(0, this.terminalHeight - this.contentHeight)
        this.$data.textCtx.putImageData(this.allText, 0, this.terminalHeight - this.contentHeight)
      }
    },
    // 绘制光标
    writeCursor(width, index) {
      // 清除旧光标
      this.$data.cursorCtx.clearRect(0, 0, this.terminalWidth, this.terminalHeight)
      // 绘制新光标，计算前面文本的宽度后再绘制,宽：8，高：字体宽度再加 5
      this.$data.cursorCtx.fillRect(width, (this.lineNum - 1) * this.fontSize + this.lineInterval * this.lineNum, 8, this.fontSize + 5)
      this.cursorSite = index // 记录光标的索引位置
      // console.log(index)
      // 记录光标内容
      this.$data.allCursor = this.$data.cursorCtx.getImageData(0, 0, this.terminalWidth, this.contentHeight)
      // 记录画布内容
      this.allText = this.$data.textCtx.getImageData(0, 0, this.contentWidth, this.contentHeight)
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
      // console.log(e.key, e.keyCode)
      if (this.showKeyCode.includes(e.keyCode)) { // 键盘可显示字符
        const x = this.$data.cursorCtx.measureText(this.currentData.substring(0, this.cursorSite)).width // 左边的宽度
        // 删除后面的字符（删除一个矩形来完成）特别是在中间插入字符
        this.$data.textCtx.clearRect(x,
          (this.lineNum - 1) * this.fontSize + this.lineInterval * this.lineNum,
          this.$data.cursorCtx.measureText(this.currentData.substring(this.cursorSite)).width, this.fontSize + this.lineInterval)
        // 重绘制后面的数据
        const data = e.key + this.currentData.substring(this.cursorSite)
        this.$data.textCtx.fillText(data, x, this.lineNum * (this.lineInterval + this.fontSize))
        this.currentData = this.currentData.substring(0, this.cursorSite) + data
        // 记录内容宽度(只记录最大值)
        if (this.contentWidth < this.$data.textCtx.measureText(this.currentData).width) this.contentWidth = this.$data.textCtx.measureText(this.currentData).width
        // 绘制光标
        this.writeCursor(x + this.$data.cursorCtx.measureText(e.key).width, this.cursorSite + 1)
      } else if (this.operateKeyCode.includes(e.keyCode)) { // 操作字符
        switch (e.keyCode) {
          case 37: // 左移
            if (this.cursorSite === this.perfix.length) return // 左边的光标边界限制
            this.writeCursor(this.$data.textCtx.measureText(this.currentData.substring(0, this.cursorSite - 1)).width, this.cursorSite - 1)
            this.$data.beforeC = this.$data.cursorCtx
            break
          case 39: // 右移
            this.writeCursor(this.$data.cursorCtx.measureText(this.currentData.substring(0,
              (this.cursorSite + 1) < this.currentData.length ? (this.cursorSite + 1) : this.currentData.length)).width,
            this.cursorSite < this.currentData.length ? this.cursorSite + 1 : this.cursorSite)
            break
          case 8: // 回退
            {
              if (this.cursorSite === this.perfix.length) return // 左边的光标边界限制
              const x = this.$data.cursorCtx.measureText(this.currentData.substring(0, this.cursorSite - 1)).width // 左边的宽度
              // 删除字符（删除一个矩形来完成）
              this.$data.textCtx.clearRect(x, (this.lineNum - 1) * this.fontSize + this.lineInterval * this.lineNum,
                this.$data.cursorCtx.measureText(this.currentData.substring(this.cursorSite - 1)).width,
                this.fontSize + this.lineInterval)
              // 重绘制后面的数据
              const data = this.currentData.substring(this.cursorSite)
              this.$data.textCtx.fillText(data, x, this.lineNum * (this.lineInterval + this.fontSize))
              this.currentData = this.currentData.substring(0, this.cursorSite - 1) + data
              // 记录内容宽度(只记录最大值)
              if (this.contentWidth < this.$data.textCtx.measureText(this.currentData).width) this.contentWidth = this.$data.textCtx.measureText(this.currentData).width
              // 绘制光标
              this.writeCursor(x, this.cursorSite - 1)
            }
            break
          case 13: // 回车换行
            this.writePrifix(++this.lineNum)
            // if (this.lineNum === 3) this.$data.textCtx.translate(20, 20)
            // if (this.currentData === this.perfix) { // 空行换行,新启一行
            // }
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
      const cursor = document.getElementById('shell-cursor-layer')
      // 设置画布的宽高
      text.height = val
      cursor.height = val
      // 高度变化，更新dom对象
      this.$data.textCtx = text.getContext('2d')
      this.$data.cursorCtx = cursor.getContext('2d')
      this.$data.textCtx.fillStyle = '#00cc74'
      this.$data.textCtx.font = this.fontSize + 'px Monaco' // Menlo, Monaco
      this.$data.cursorCtx.font = this.fontSize + 'px Monaco' // Menlo, Monaco 设置字体样式
      this.$data.cursorCtx.fillStyle = '#fff' // 字体颜色
      // 复原图像
      if (old !== 0) {
        if (this.allText) this.$data.textCtx.putImageData(this.allText, 0, 0)
        if (this.allCursor) this.$data.cursorCtx.putImageData(this.allCursor, 0, 0)
      }
    },
    // 监听父容器的宽高，动态设置canvas画布宽高
    terminalWidth(val, old) {
      const text = document.getElementById('shell-text-layer')
      const cursor = document.getElementById('shell-cursor-layer')
      // 设置画布的宽高
      text.width = val
      cursor.width = val
      // 高度变化，更新dom对象
      this.$data.textCtx = text.getContext('2d')
      this.$data.cursorCtx = cursor.getContext('2d')
      this.$data.textCtx.fillStyle = '#00cc74'
      this.$data.textCtx.font = this.fontSize + 'px Monaco' // Menlo, Monaco
      this.$data.cursorCtx.font = this.fontSize + 'px Monaco' // Menlo, Monaco 设置字体样式
      this.$data.cursorCtx.fillStyle = '#fff' // 字体颜色
      // 复原图像
      if (old !== 0) {
        if (this.allText) this.$data.textCtx.putImageData(this.allText, 0, 0)
        if (this.allCursor) this.$data.cursorCtx.putImageData(this.allCursor, 0, 0)
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
