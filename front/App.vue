<template>
  <div id="app">
    <Home></Home>
  </div>
</template>
<script>
import Home from '@/front/views/Home.vue'

export default {
  components: {
    Home
  },
  computed: {
    successAlert: {
      get() {
        return this.$store.state.successAlert
      },
      set(newVal) {
        this.$store.state.successAlert = newVal
      }
    },
    keyExists: {
      get() {
        return this.$store.state.keyExists
      },
      set(newVal) {
        this.$store.state.keyExists = newVal
      }
    }
  },
  watch: {
    successAlert(val) {
      if (val) {
        this.$store.state.successAlert = false
        this.$notify.success({
          duration: 2000,
          customClass: 'notifyBox',
          message: 'SUCCESS'
        })
      }
    },
    keyExists(val) {
      if (val) {
        this.$store.state.keyExists = false
        this.$notify.error({
          duration: 3000,
          customClass: 'notifyBox',
          message: 'The key doesn\'t exist!'
        })
        this.$store.state.hostView.current.keyDetailShow = false // 关闭key详情窗口
        // 刷新key列表
        this.$store.state.hostView.current.dbLoading = true
        this.$store.commit('redis/getAllKey', {
          index: this.$store.state.hostView.current.selectDB,
          time: this.$store.state.hostView.current.time
        })
      }
    }
  }
}
</script>

<style lang="less">
@import 'style/common.less';
@import 'style/index.less';
@import 'style/animation.less';

#app {
  font-family: 'Microsoft JhengHei', 'Microsoft Yahei', Helvetica, Arial, '黑体';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

</style>
