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
  }
}
</script>

<style lang="less">
@import 'style/common.less';
@import 'style/index.less';
@import 'style/animation.less';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

</style>
