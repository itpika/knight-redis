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
      <canvas @click.stop="getFocus" style="z-index: 3;" id="shell-cursor-layer"></canvas>
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
      // return `${this.address}[${this.current.selectDB}] > `
      return `${this.address}[0]> `
    }
  },
  data: function () {
    return {
      terminalWidth: 0, // 画布宽度
      terminalHeight: 0, // 画布高度
      fontSize: 14, // 字体大小
      lineInterval: 4, // 行间隔
      imgData: '', // 行间隔
      textLocation: 0
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
    // 获得光标
    getFocus() {
    },
    writePrifix() {
      const text = document.getElementById('shell-text-layer').getContext('2d')
      text.fillStyle = '#00cc74'
      text.font = this.fontSize + 'px Microsoft JhengHei'
      text.fillText(this.perfix, 0, this.fontSize + this.lineInterval)
    }
  },
  mounted() {
    window.addEventListener('resize', this.getBodyWidth)
    window.addEventListener('resize', this.getBodyHeight)
    this.$nextTick(() => {
      this.getBodyWidth()
      this.getBodyHeight()
      this.$nextTick(() => {
        this.writePrifix()
      })
    })
  },
  watch: {
    // 监听父容器的宽高，动态设置canvas画布宽高
    terminalHeight(val, old) {
      const text = document.getElementById('shell-text-layer')
      const textCtx = text.getContext('2d')
      const cursor = document.getElementById('shell-cursor-layer')
      // 保存图像
      let imgData
      if (old !== 0) imgData = textCtx.getImageData(0, 0, this.terminalWidth, old)
      // 设置画布的宽高
      text.height = val
      cursor.height = val
      // 复原图像
      if (old !== 0) textCtx.putImageData(imgData, 0, 0)
    },
    // 监听父容器的宽高，动态设置canvas画布宽高
    terminalWidth(val, old) {
      const text = document.getElementById('shell-text-layer')
      const textCtx = text.getContext('2d')
      const cursor = document.getElementById('shell-cursor-layer')
      // 保存图像
      let imgData
      if (old !== 0) imgData = textCtx.getImageData(0, 0, this.terminalWidth, old)
      // 设置画布的宽高
      text.width = val
      cursor.width = val
      // 复原图像
      if (old !== 0) textCtx.putImageData(imgData, 0, 0)
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
<<<<<<< HEAD
      position: absolute;
      box-sizing: border-box;
      top: 0;
      left: 0;
      padding: 0 10px;
=======
      color: #fff;
>>>>>>> 33ae4e042c11c948ee4f2779a0e09e295b630c28
      font-size: 12px;
    }
  }
}
</style>
