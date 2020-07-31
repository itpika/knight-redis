<template>
  <div class="Aside">
    <div v-for="(item, i)  of openSelect" v-bind:key="i">
      <SelectBox :val=item.name></SelectBox>
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
      openSelect: [{
        name: '10.10.1.12'
      }, {
        name: '10.10.1.13'
      }]
    }
  }
}
</script>

<style scoped lang="less">
</style>
