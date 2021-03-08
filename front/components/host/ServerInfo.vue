<template>
  <div class="pading-cu bgkColor radio-kgt">
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
      <el-tab-pane label="Server" name="server">
        <div class="tab-server">
          <LiTable customClass="li-table" :key="current.serverInfoKey" :data="current.serverInfo ? current.serverInfo.s : {}"/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Clients" name="second">
          <LiTable customClass="li-table" :key="current.serverInfoKey" :data="current.serverInfo ? current.serverInfo.c : {}"/>
      </el-tab-pane>
      <el-tab-pane label="Memory" name="third">Memory</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import LiTable from '@/front/components/common/li-table.vue'
import send from '@/front/lib/channel/send.js'
export default {
  name: 'serverInfo',
  components: {
    LiTable
  },
  computed: {
    current() {
      return this.$store.state.hostView.current
    }
  },
  data: function () {
    return {
      activeName: 'server',
      data1: [
        { 'k': 'vesion', 'v': 3.0 },
        { 'k': 'mode', 'v': 'single' },
        { 'k': 'os', 'v': 'linux' }
      ],
      data2: [
        { 'k': 'vesion', 'v': 2.0 }
      ]
    }
  },
  created: function() {
    send.sendEvent('REDIS_VERSION', { time: this.current.time })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>
<style lang="less" scoped>
  .pading-cu {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    > div {
      height: 100%;
      border-radius: 5px;
      color: white;
      background-color: #4f6d8c;
      width: 100%;
      /deep/ .el-tabs__item {
        color: white;
      }
      /deep/ .is-active {
        color: #00de7e;
      }
      /deep/ .el-tabs__active-bar {
        background-color: #00de7e;
      }
      .tab-server {
        display: flex;
        justify-content: space-between;
        .li-table {
          width: 50%
        }
      }
    }
  }
</style>
