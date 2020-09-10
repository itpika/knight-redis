<template>
  <div class="box radio-kgt">
    <div class="header">
      <div class="left bkg-radio-kgt">
        <div class="key-type greenColor">
          <span>{{this.current.keyDetail.type}}:</span>
          <!-- <span>HASH:</span> -->
          <!-- <span>STRING:</span> -->
        </div>
        <span class="key-name">
          <el-tooltip :content="keyName" effect="dark" offset="0" placement="top-start">
            <span class="key-name">{{keyName}}</span>
          </el-tooltip>
        </span>
      </div>
      <div class="right bkg-radio-kgt">right</div>
    </div>
    <div class="body bkg-radio-kgt">body</div>
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
  display: flex;
  flex-flow: column;
  .header {
    height: 10%;
    max-height: 40px;
    min-height: 25px;
    display: flex;
    justify-content: space-between;
    .left {
      width: 40%;
      font-size: 14px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 10px;
      justify-content: flex-start;
      margin-right: 10px;
      .key-type {
        margin-right: 5px;
      }
      .key-name {
        color: #fff;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
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
