<!-- 左侧边栏组件-->

<template>
  <div class="Aside">
    <SelectBox :box="host" @active="active"></SelectBox>
    <SelectBox v-for="(item, i)  of hosts" v-bind:key="i" :box="item" @active="active"></SelectBox>
  </div>
</template>

<script>
import SelectBox from './SelectBox'
import { mapState } from 'vuex'
export default {
  name: 'Aside',
  components: {
    SelectBox
  },
  computed: mapState({
    hosts: state => state.host.openHost
  }),
  data: () => {
    return {
      host: {
        id: '0',
        type: 'menu', // 菜单项
        label: 'Host',
        icon: 'el-icon-s-platform',
        activeMenu: false, // 菜单是否被点击激活
        router: '/host' // 跳转路由
      }
    }
  },
  methods: {
    active: function (time) {
      for (let i = 0; i < this.hosts.length; i++) {
        if (this.hosts[i].time === time) {
          this.hosts[i].isActive = true // 选中项设为选中状态
          this.host.activeMenu = false // 同时把host项目取消选中状态
        } else {
          this.hosts[i].isActive = false
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
