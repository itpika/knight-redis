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
    <div class="body" ref="body">
      <canvas id="shellBox" height="100px" width="1380px"></canvas>
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
    bodyHeight() {
      return this.$refs.body.clientHeight
    }
  },
  data: function () {
    return {
    }
  },
  methods: {
    handleClose (done) {
    },
    leftBack () {
      this.current.shellState.open = false
    }
  },
  watch: {
    bodyHeight: function(val, old) {
      console.log('---', val)
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
  .body {
    height: 90%;
    box-sizing: border-box;
    background-color: #000;
    padding: 0 10px;
  }
</style>
