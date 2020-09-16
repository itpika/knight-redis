<template>
  <div class="header">
    <div class="menu" style="-webkit-app-region: drag">
      <div class="logo">
        <el-image
        :src="require('@/public/image/icon.png')"
        fit="fill"></el-image>
      </div>
      <div class="opertion">
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
    background-color: rgb(28, 48, 70);
    .logo {
      height: 100%;
      width: 25px;
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
          background-color: rgb(87, 113, 145);
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
