<template>
  <div class="home">
      <el-header><Header/></el-header>
      <el-container>
        <el-aside width="18%" class="fontColor bgdColor"><Aside></Aside></el-aside>
        <el-main :class="mainClass"><Main></Main></el-main>
      </el-container>
  </div>
</template>

<script>
import Header from '@/front/components/Header.vue'
import Aside from '@/front/components/Aside/index.vue'
import Main from '@/front/components/Main/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: mapState({
    mainClass: state => state.app.mainClass
  }),
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
    display: flex;
    flex-direction: column;
    > .el-container {
      flex: 1;
      > ::-webkit-scrollbar { // 主body隐藏滚动条
        display: none; /* Chrome Safari */
      }
      box-sizing: border-box;
    }
  }
  .el-header {
    max-height: 30px;
  }
  .el-header, .el-footer {
    color: #c9ced4;
    text-align: center;
    padding: 0;
  }
  .el-aside {
    text-align: center;
  }
  .el-main {
    color: #333;
    height: 100%;
    padding: 0;
  }
  // body > .el-container {
  //   margin-bottom: 40px;
  // }
</style>
