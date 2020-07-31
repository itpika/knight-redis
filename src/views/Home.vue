<template>
  <div class="home">
  <el-container>
    <el-header><Header/></el-header>
    <el-container>
      <el-aside width="200px"><Aside></Aside></el-aside>
      <el-main><Main></Main></el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Aside from '@/components/Aside/index.vue'
import Main from '@/components/Main/index.vue'

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
    background-color: #d5dfec;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #253b54;
    color: #c9ced4;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 100%;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
