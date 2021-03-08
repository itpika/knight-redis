<template>
  <div :class="['table-box', customClass]">
    <ul>
      <li v-for="(o, i) of data" :key="i">
        <span>{{i}}</span>
        <span>{{o}}</span>
      </li>      
    </ul>
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
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin: 10px 0;
      display: flex;
      padding: 0 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        flex: 1;
        text-align: left;
      }
    }
  }
}
</style>
