<template>
  <div class="box" v-on:click="click">
    <div>
      {{val}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectBox',
  props: {
    val: String,
    color: String
  },
  data: () => {
    return {
    }
  },
  methods: {
    click: function () {
    }
  }
}
</script>

<style scoped lang="less">
  .box {
    height: 50px;
    line-height: 50px;
    cursor: default;
    div:hover {
      background-color: #657180;
    }
  }
</style>
