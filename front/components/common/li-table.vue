<template>
  <div :class="['table-box', customClass]">
    <div class="item-box radio-kgt bgdColor" v-for="(o, i) of data" :key="i">
      <i v-if="o.i" :class="[o.i, 'brand-color']"></i>
      <span class="left fontColor3">{{o.k}}</span>
      <span class="right greenColor" v-html="o.v"></span>
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
  // flex-direction: column;
  width: 100%;
  justify-content: space-between;
  position: absolute;
  height: 100%;
  overflow-y: scroll;
  .item-box {
    i {
      margin-right: 5px;
      // color: red;
    }
    box-sizing: border-box;
    width: 49%;
    margin: 5px 0;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;
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
