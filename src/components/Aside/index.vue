<!-- 左侧边栏组件-->

<template>
  <div class="Aside">
    <SelectBox :box="host"></SelectBox>
    <div v-for="(item, i)  of openSelect" v-bind:key="i">
      <SelectBox :box="item" v-on:active="active"></SelectBox>
    </div>
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
        name: 'Host',
        icon: 'el-icon-s-platform'
      },
      openSelect: [{
        id: '1',
        name: '10.10.1.12',
        icon: 'el-icon-s-platform',
        isActive: false
      }, {
        id: '2',
        name: '10.10.1.13',
        icon: 'el-icon-s-platform',
        isActive: false
      }, {
        id: '3',
        name: '10.10.1.13',
        icon: 'el-icon-s-platform',
        isActive: false
      }, {
        id: '4',
        name: '10.10.1.13',
        icon: 'el-icon-s-platform',
        isActive: false
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
