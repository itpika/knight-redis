<!-- 左侧项组件-->

<template>
  <div :class="[selectBox, {active: box.isActive, activeMenu: box.activeMenu} ]" @click="click" :id="box.id">
    <div class="left">
      <div :class="{iconActive: box.isActive, iconActiveMenu: box.activeMenu}">
        <i :class="box.icon"/>
      </div>
      {{box.label}}
    </div>
    <div v-if="box.close" class="closeIcon" @click="closeHost(box.time)">
      <i class="el-icon-close"/>
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
      selectBox: 'selectBox'
    }
  },
  methods: {
    click: function (event) {
      if (this.$props.box.type !== 'menu') {
        // 不是菜单项目才设置 isActive 属性
        this.$props.box.isActive = !this.$props.box.isActive
      }
      this.$emit('active', this.$props.box.time)
      this.$router.push(this.box.router)
    },
    closeHost(time) {
      this.$store.commit('host/closeHost', time)
    }
  }
}
</script>

<style lang="less" scoped>
  .selectBox {
    &:hover {
      background-color: #416080;
      cursor: pointer;
      color: #fff;
      .left > div {
        border-color: #fff;
      }
    }
    font-size: 14px;
    height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      .iconActive {
        border: solid 1px #02f32b !important;
      }
      .iconActiveMenu {
        border: solid 1px #fff !important;
      }
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      div {
        height: 25px;
        width: 25px;
        border-radius: 6px;
        border: solid 1px #a9a9a9;
        margin: 0 10px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      > i{
        font-size: 14px;
        height: 14px;
      }
    }
    .closeIcon:hover {
      background-color: #334460;
    }
    .closeIcon {
      height: 25px;
      width: 25px;
      border-radius: 6px;
      > i {
        font-size: 14px;
        height: 14px;
      }
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .active {
    background-color: #416080;
    color: #02f32b !important;
  }
  .activeMenu {
    background-color: #416080;
    color: #fff !important;
  }
</style>
