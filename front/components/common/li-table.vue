<template>
  <div :class="['table-box', customClass]">
    <div class="item-box radio-kgt bgdColor" v-for="(o, i) of data" :key="i">
      <!-- <i class="el-icon-info"></i> -->
      <span class="left">{{i}}</span>
      <span class="right" v-html="o"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LiTable',
  props: {
    customClass: String,
    data: Object
  },
  data() {
    return {
    }
  },
  methods: {
  },
  computed: {
  },
  created() {
  }
}
</script>
<style lang="less" scoped>
.table-box {
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: space-between;
  overflow: auto;
  position: relative;
  // top: 0;
  .item-box {
    i {
      margin-right: 5px;
    }
    box-sizing: border-box;
    width: 49%;
    margin: 5px 0;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    .left {
      flex: 1;
      text-align: left;
    }
    .right {
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
