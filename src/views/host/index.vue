<template>
  <div class="host">
    <div class="header">
      <el-button type="primary" icon="el-icon-plus" size="mini" round>NEW HOST</el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" round>NEW GROUP</el-button>
    </div>
  </div>
</template>

<script>
// import Header from '@/components/Header.vue'

export default {
  name: 'host',
  components: {
  }
}
</script>
<style scoped lang="less">
.host {
  > .header {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 40px;
    background-color: rgb(180, 200, 216);
  }
}
</style>
