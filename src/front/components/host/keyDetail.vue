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
      <div class="right">
        <div class="reload radio-kgt"><i class="el-icon-refresh-right"/><span v-html="'&nbsp;reload'"></span></div>
        <div class="rename bkg-radio-kgt"><span v-html="'&nbsp;rename'"></span></div>
        <div class="delete radio-kgt"><i class="el-icon-delete-solid"/><span v-html="'&nbsp;delete'"></span></div>
        <div class="ttl bkg-radio-kgt">TTL:-1</div>
      </div>
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
  components: {
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 5px;
      color: #fff;
      > div {
        height: 100%;
        box-sizing: border-box;
        align-items: center;
        display: flex;
        justify-content: center;
        flex: 1;
        font-size: 14px;
      }
      .rename {
        margin-right: 5px;
        cursor: pointer;
      }
      .ttl {
        }
      .reload {
        margin-right: 5px;
        background-color: #00de7e;
        cursor: pointer;
      }
      .delete {
        margin-right: 5px;
        background-color: #fa4c4c;
        cursor: pointer;
      }
    }
  }
  .body {
    margin-top: 10px;
    flex-grow: 1;
  }
}
</style>
