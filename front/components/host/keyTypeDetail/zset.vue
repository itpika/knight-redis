<template>
  <div class="zset-box">
    <ul class="bgdColor-radio-kgt">
      <li class="radio-kgt">
        <div class="row greenColor">row</div>
        <div class="value greenColor">value</div>
      </li>
      <li class="radio-kgt select" v-for="(item, i) in this.current.keyDetail.value" :key="i" @click.stop="keyShow(item, i)">
        <div class="row">{{i+1}}</div>
        <div class="value" v-html="current.keyDetail.value[i]"></div>
      </li>
    </ul>
    <div @paste="filterText" class="select-key bgdColor-radio-kgt" contenteditable="true">{{value}}</div>
  </div>
</template>
<script>
export default {
  name: 'ZSetDetail',
  components: {
  },
  computed: {
    current() {
      return this.$store.state.hostView.current
    },
    keyName() {
      return this.$store.state.hostView.current.keyDetail.keyName
    }
  },
  data: function () {
    return {
      value: ''
    }
  },
  methods: {
    keyShow(key, index) { // key数据展示
      this.value = this.current.keyDetail.value[index]
    },
    filterText(e) {
      e.preventDefault();
      const text = e.clipboardData.getData('Text')
      document.execCommand('insertText', false, text)
    }
  }
}
</script>
<style lang="less" scoped>
.zset-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  ul {
    flex: 4;
    margin: 0;
    margin-bottom: 5px;
    padding: 5px 10px;
    list-style: none;
    .select {
      transition: background-color 0.3s;
      &:hover {
        background-color: #434e5a;
        cursor: pointer;
      }
    }
    li {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      height: 20px;
      .row {
        flex: 1;
        color: rgb(202, 202, 202);
      }
      .value {
        width: 100%;
        flex: 6;
        color: #00de7e;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .select-key {
    font-size: 12px;
    margin-bottom: 5px;
    flex: 2;
    text-align: left;
    align-items: center;
    box-sizing: border-box;
    padding: 0 5px;
    white-space: pre-wrap;
    overflow: auto;
    color: #f56c6c;
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      background: #152435;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
