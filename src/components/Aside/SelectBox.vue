<!-- 左侧项组件-->

<template>
  <div class="box" v-on:click="click">
    <div v-bind:class="{active: box.isActive}" :id="box.id">
      {{box.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectBox',
  props: {
    box: Object
  },
  data: () => {
    return {
    }
  },
  methods: {
    click: function (event) {
      this.$props.box.isActive = !this.$props.box.isActive
      this.$emit('active', this.$props.box.id)
    }
  }
}
</script>

<style scoped lang="less">
  .box {
    height: 50px;
    line-height: 50px;
    div:hover {
      background-color: #4a5868;
      cursor: pointer;
    }
  }
  .active {
    background-color: #102846 !important;
  }
</style>
