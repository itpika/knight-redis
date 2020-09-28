<template>
  <div class="hash-box">
    <ul class="bgdColor-radio-kgt">
      <li class="radio-kgt">
        <div class="row greenColor">row</div>
        <div class="key greenColor">key</div>
        <div class="value greenColor">value</div>
      </li>
      <li class="radio-kgt select" v-for="(item, i) in this.current.keyDetail.value.keys" :key="i" @click.stop="keyShow(item, i)">
        <div class="row">{{i+1}}</div>
        <div class="key">{{item}}</div>
        <div class="value">{{current.keyDetail.value.values[i]}}</div>
      </li>
    </ul>
    <div @paste="filterText" class="select-key bgdColor-radio-kgt" contenteditable="true">{{key}}</div>
    <div @paste="filterText" class="select-key-value bgdColor-radio-kgt" contenteditable="true">{{value}}</div>
  </div>
</template>
<script>
export default {
  name: 'HashDetail',
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
      key: '',
      value: ''
    }
  },
  methods: {
    keyShow(key, index) { // key数据展示
      this.key = key
      this.value = this.current.keyDetail.value.values[index]
    },
    filterText(e) {
      e.preventDefault()
      const text = e.clipboardData.getData('Text')
      document.execCommand('insertText', false, text)
    }
  }
}
</script>
<style lang="less" scoped>
.hash-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  ul {
    flex: 8;
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
        text-align: left;
        color: rgb(202, 202, 202);
        padding: 0 5px;
      }
      .key {
        flex: 3;
        color: #f56c6c;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .value {
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
  .select-key-value {
    font-size: 12px;
    color: #00de7e;
    flex: 6;
    margin: 0;
    text-align: left;
    align-items: center;
    box-sizing: border-box;
    padding: 0 5px;
    white-space: pre-wrap;
    overflow: auto;
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      background: #152435;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
