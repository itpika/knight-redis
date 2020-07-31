<!-- 左侧项组件-->

<template>
  <div :class="[selectBox, {active: box.isActive}]" v-on:click="click" :id="box.id">
    <span class="icon">
      <i :class="box.icon"/>
    </span>
    <span class="text">{{box.name}}</span>
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
      selectBox: 'selectBox'
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
  .selectBox:hover {
    background-color: #4a5868;
    cursor: pointer;
  }
  .selectBox {
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .icon {
      padding: 0 10px;
    }
    // .text {
    //   flex-grow: 2;
    // }
  }
  .active {
    background-color: #102846 !important;
  }
</style>
