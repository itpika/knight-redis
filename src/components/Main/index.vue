<!-- 左侧边栏组件-->

<template>
  <div :class="[{main: isMain}, mainClass]">
    <!-- <router-link to="/about">About</router-link> -->
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Main',
  components: {
  },
  computed: mapState({
    mainClass: state => state.app.mainClass
  }),
  data: () => {
    return {
      isMain: true
    }
  }
}
</script>

<style scoped lang="less">
.main {
  height: 100%;
  background: #fff;
}
</style>
