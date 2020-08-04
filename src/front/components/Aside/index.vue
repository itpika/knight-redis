<!-- 左侧边栏组件-->

<template>
  <div class="Aside">
    <SelectBox :box="host" v-on:active="active"></SelectBox>
    <SelectBox v-for="(item, i)  of hosts" v-bind:key="i" :box="item" v-on:active="active"></SelectBox>
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
        label: 'Host',
        icon: 'el-icon-s-platform',
        isActive: false,
        router: '/host'
      }
    }
  },
  methods: {
    active: function (time) {
      for (let i = 0; i < this.hosts.length; i++) {
        if (this.hosts[i].time === time) {
          this.hosts[i].isActive = true
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
