<!-- 左侧边栏组件-->

<template>
  <div class="Aside">
    <SelectBox :box="host" v-on:active="active"></SelectBox>
    <SelectBox v-for="(item, i)  of openSelect" v-bind:key="i" :box="item" v-on:active="active"></SelectBox>
  </div>
</template>

<script>
import SelectBox from './SelectBox'
export default {
  name: 'Aside',
  components: {
    SelectBox
  },
  data: () => {
    return {
      host: {
        id: '0',
        name: 'Host',
        icon: 'el-icon-s-platform',
        isActive: false,
        router: '/host'
      },
      openSelect: [{
        id: '1',
        name: '10.10.1.12',
        icon: 'el-icon-s-platform',
        isActive: false,
        close: true,
        router: '/hostView'
      }]
    }
  },
  methods: {
    active: function (id) {
      for (let i = 0; i < this.$data.openSelect.length; i++) {
        if (this.$data.openSelect[i].id === id) {
          this.$data.openSelect[i].isActive = true
        } else {
          this.$data.openSelect[i].isActive = false
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
