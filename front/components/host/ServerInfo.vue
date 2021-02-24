<template>
  <div class="box radio-kgt">
    server info
  </div>
</template>
<script>
// import send from '@/front/lib/channel/send.js'
export default {
  name: 'serverInfo',
  components: {
  },
  computed: {
    current() {
      return this.$store.state.hostView.current
    }
  },
  data: function () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.box {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  .header {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
}
</style>
