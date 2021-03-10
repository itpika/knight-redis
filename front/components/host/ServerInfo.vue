<template>
  <div class="pading-cu bgkColor radio-kgt">
    <el-tabs class="el-tab-cls" v-model="activeName" @tab-click="handleClick" :stretch="true">
      <el-tab-pane label="Server" name="server">
        <LiTable customClass="li-table" :key="current.serverInfoKey" :data="current.serverInfo ? current.serverInfo.s : { 'User suas asa': '1\r\n999922222222299999922222', name: '111', age: 2222222, age15: 2222222, age14: 2222222, age13: 2222222, age12: 2222222, age11: 2222222, age10: 2222222, age9: 2222222, age8: 2222222, age7: 2222222, age6: 2222222, age5: 2222222, age4: 2222222, age3: 2222222, age2: 2222222}"/>
      </el-tab-pane>
      <el-tab-pane label="Clients" name="second">
          <LiTable customClass="li-table" :key="current.serverInfoKey" :data="current.serverInfo ? current.serverInfo.c : { 'nam': 1, aa: 2, 'ccc': 3}"/>
      </el-tab-pane>
      <el-tab-pane label="DB" name="four">
        <LiTable customClass="li-table" :key="current.serverInfoKey" :data="current.serverInfo ? current.serverInfo.o : {}"/>
      </el-tab-pane>
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
      activeName: 'server'
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
    // height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    .el-tab-cls {
      display: flex;
      flex-direction: column;
    }
    /deep/ .el-tabs__content {
      flex: 1;
    }
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
    }
  }
</style>
