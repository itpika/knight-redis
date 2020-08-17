<template>
  <!-- 底层命令行抽屉 -->
  <el-drawer
    size="30%"
    :visible.sync="current.shellState.open"
    direction="btt"
    :with-header="false"
    :before-close="handleClose"
    >
    <!-- 头部 -->
    <div class="header">
      <div>
        <div class="addTitle">Shell</div>
      </div>
      <div class="closeIcon" @click.stop="current.shellState.open = false">
        <i class="el-icon-close"/>
      </div>
    </div>
    <!-- 主体 -->
    <div id="shellBody">
      <canvas @click.stop="getFocus" id="shellBox" :width="terminalWidth+'px'" :height="terminalHeight+'px'"></canvas>
    </div>
  </el-drawer>
</template>
<script>
export default {
  name: 'Terminal',
  computed: {
    current() {
      return this.$store.state.hostView.current
    },
    shellState() {
      return this.$store.state.hostView.current.shellState.open
    }
  },
  data: function () {
    return {
      terminalWidth: 0,
      terminalHeight: 0
    }
  },
  methods: {
    handleClose (done) {
    },
    leftBack () {
      this.current.shellState.open = false
    },
    getBodyWidth() {
      this.terminalWidth = document.getElementById('shellBody').clientWidth - 20 // #shellBody 有20的padding，要减去
      return document.getElementById('shellBody').clientWidth
    },
    getBodyHeight() {
      this.terminalHeight = document.getElementById('shellBody').clientHeight
      return document.getElementById('shellBody').clientHeight
    },
    // 获得光标
    getFocus() {
      console.log('====')
      const c = document.getElementById('shellBox')
      const ctx = c.getContext('2d')
      // ctx.font = '12'
      ctx.fillText('Hello World', 10, 50)
    }
  },
  mounted() {
    window.addEventListener('resize', this.getBodyWidth)
    window.addEventListener('resize', this.getBodyHeight)
  },
  watch: {
    shellState(val, old) {
      if (val) {
        this.$nextTick(() => {
          this.getBodyWidth()
          this.getBodyHeight()
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .header {
    height: 10%;
    border-bottom: solid 1px #334460;
    background-color: #1c3046;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 12px;
    > div:first-child {
      width: 90%;
      display: flex;
      justify-content: flex-start;
      > .addTitle {
        line-height: 25px;
      }
    }
    .closeIcon:hover {
      background-color: #334460;
      cursor: pointer;
    }
    .closeIcon {
      height: 20px;
      width: 20px;
      border-radius: 6px;
      > i {
        font-size: 14px;
        height: 14px;
      }
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  #shellBody {
    height: 90%;
    box-sizing: border-box;
    background-color: #000;
    padding: 0 10px;
    canvas {
      color: #fff;
      font-size: 10px;
    }
  }
</style>
