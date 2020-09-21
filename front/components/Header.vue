<template>
  <div class="header">
    <div class="menu" style="-webkit-app-region: drag">
      <div class="left" v-if="os != 'macOS'">
        <div class="logo">
          <el-image
          :src="require('@/public/image/mac.png')"
          fit="fill"></el-image>
        </div>
        <div class="top-menu">
          <div>View</div>
          <div>Help</div>
        </div>
      </div>
      <div class="opertion" v-if="os != 'macOS'">
        <div class="min" style="-webkit-app-region: no-drag;" @click.stop="minWindow">
          <div></div>
        </div>
        <div class="max" style="-webkit-app-region: no-drag;" @click.stop="maxWindow">
          <div></div>
        </div>
        <div class="close" style="-webkit-app-region: no-drag;" @click.stop="exit">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import send from '@/front/lib/channel/send.js'
export default {
  name: 'Header',
  data() {
    return {
      os: global.os_platform
    }
  },
  computed: {
    winMax() {
      return this.$store.state.app.winMax
    }
  },
  methods: {
    minWindow() {
      send.windowsOpertion('minWindow')
    },
    maxWindow() {
      if (this.winMax) {
        send.windowsOpertion('unmaxWindow')
      } else {
        send.windowsOpertion('maxWindow')
      }
      this.winMax = !this.winMax
    },
    exit() {
      send.windowsOpertion('exit')
    }
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  box-sizing: border-box;
  height: 100%;
  .menu {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(37, 53, 70);
    .left {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      .logo {
        height: 100%;
        padding: 4px;
        box-sizing: border-box;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .top-menu {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        > div {
          user-select: none;
          height: 100%;
          font-size: 13px;
          width: 50px;
          display: flex;
          color: #cccccc;
          justify-content: center;
          align-items: center;
          -webkit-app-region: no-drag;
          &:hover {
            background-color: rgb(56, 70, 83);
            color: #dad9d9;
            cursor: default;
          }
        }
      }
    }
    .opertion {
      height: 100%;
      > div {
        height: 100%;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      .min, .max {
        &:hover {
          background-color: rgb(56, 70, 83);
        }
      }
      .min div {
        height: 0;
        width: 10px;
        border-top: 1px solid #fff;
      }
      .max div {
        height: 8px;
        width: 8px;
        border: 1px solid #fff;
      }
      .close {
        i {
          color: #fff;
        }
        &:hover {
          background-color: rgb(202, 59, 59);
        }
      }
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
