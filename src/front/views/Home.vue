<template>
  <div class="home">
  <el-container>
    <el-header><Header/></el-header>
    <el-container>
      <el-aside width="240px" class="fontColor"><Aside></Aside></el-aside>
      <el-main><Main></Main></el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
import Header from '@/front/components/Header.vue'
import Aside from '@/front/components/Aside/index.vue'
import Main from '@/front/components/Main/index.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Aside,
    Main
  }
}
</script>
<style scoped lang="less">
  .home {
    height: 100%;
    .el-container {
      height: 100%;
    }
  }
  .el-header, .el-footer {
    background-color: #1c3046;
    border-bottom: solid 1px #334460;
    color: #c9ced4;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #1c3046;
    text-align: center;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    // text-align: center;
    height: 100%;
    padding: 0;
  }
  // body > .el-container {
  //   margin-bottom: 40px;
  // }
</style>
