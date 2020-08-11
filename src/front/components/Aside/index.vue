<!-- 左侧边栏组件-->

<template>
  <div class="Aside">
    <SelectBox :box="host" @active="active(0)"></SelectBox>
    <SelectBox v-for="(item, i)  of hosts" v-bind:key="i" :box="item" @active="active" @removeHost="removeHost"></SelectBox>
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
    hosts: state => state.host.openHost,
    hostState: state => state.host.hostState
  }),
  data: () => {
    return {
      host: {
        id: '0',
        type: 'menu', // 菜单项
        label: 'Host',
        icon: 'el-icon-s-platform',
        activeMenu: false, // 菜单是否被点击激活
        router: 'host' // 跳转路由
      }
    }
  },
  watch: {
    // 监听 host 菜单项的状态变化，同步显示
    hostState: function(val, oldValue) {
      this.host.activeMenu = val
    }
  },
  methods: {
    active (time) {
      if (time === 0) {
        this.$store.commit('host/setHostState', true)
      }
      for (let i = 0; i < this.hosts.length; i++) {
        if (this.hosts[i].time === time) {
          this.hosts[i].isActive = true // 选中项设为选中状态
          this.host.activeMenu = false // 同时把host项目取消选中状态
        } else {
          this.hosts[i].isActive = false
        }
      }
    },
    // host项被关闭了，选出激活显示的下一个host
    removeHost() {
      if (this.hosts.length === 0) { // 没有打开的host项了
        this.$router.push({ name: 'host' })
        // 所有的host关闭了，设置host菜单栏为选中
        this.$store.commit('host/setHostState', true)
      } else {
        // 设置左侧host的激活项
        this.hosts[this.hosts.length - 1].isActive = true
        // 设置左侧host激活项的右侧页面数据
        this.$store.commit('hostView/restoreCurrentHost', this.hosts[this.hosts.length - 1].time)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
