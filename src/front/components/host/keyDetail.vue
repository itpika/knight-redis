<template>
  <div class="box">
    <div class="header">
      <div class="left">
        <div class="key-type greenColor">
          <!-- <span>{{this.current.keyDetail.type}}:</span> -->
          <!-- <span>hash:</span> -->
          <span>STRING:</span>
        </div>
        <span class="key-name">{{keyName}}</span>
      </div>
      <div class="right">right</div>
    </div>
    <div class="body">body</div>
  </div>
</template>
<script>
export default {
  name: 'keyDetail',
  props: {
    keyName: String
  },
  computed: {
    current() {
      return this.$store.state.hostView.current
    }
  },
  data: function () {
    return {
      keyType: 'HASH'
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
  border-radius: 6px;
  display: flex;
  flex-flow: column;
  > div {
    background-color: #416080;
    border-radius: 6px;
  }
  .header {
    height: 10%;
    > div {
      background-color: #416080;
      border-radius: 6px;
    }
    display: flex;
    justify-content: space-between;
    .left {
      width: 40%;
      font-size: 14px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 10px;
      .key-type {
        width: 35%;
        display: flex;
        justify-content: flex-start;
        span {
          float: left;
          margin-right: 5px;
        }
      }
      .key-name {
        color: #fff;
      }
    }
    .right {
      flex-grow: 1;
    }
  }
  .body {
    margin-top: 10px;
    flex-grow: 1;
  }
}
</style>
