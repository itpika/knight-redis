<template>
  <div class="zset-box">
    <ul class="bgdColor-radio-kgt">
      <li class="radio-kgt">
        <div class="row greenColor">row</div>
        <div class="value greenColor">value</div>
        <div class="score greenColor">score</div>
      </li>
      <li class="radio-kgt select" v-for="(item, i) in this.current.keyDetail.value.values" :key="i" @click.stop="keyShow(item, i)">
        <div class="row">{{i+1}}</div>
        <div class="value">{{item}}</div>
        <div class="score">{{current.keyDetail.value.scores[i]}}</div>
      </li>
    </ul>
    <span id="zset-old-input" style="visibility: hidden; height: 0;">{{this.current.keyDetail.ketData.zset.value}}</span>
    <div id="zset-score-input" @paste="filterText" class="select-key-score bgdColor-radio-kgt" contenteditable="true">{{this.current.keyDetail.ketData.zset.score}}</div>
    <div id="zset-value-input" @paste="filterText" class="select-key bgdColor-radio-kgt" contenteditable="true">{{this.current.keyDetail.ketData.zset.value}}</div>
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
  methods: {
    keyShow(key, index) { // key数据展示
      this.current.keyDetail.ketData.zset.score = this.current.keyDetail.value.scores[index]
      this.current.keyDetail.ketData.zset.value = this.current.keyDetail.value.values[index]
      this.current.keyDetail.saveDrop = false
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
      padding: 0 5px;
      .row {
        flex: 2;
        text-align: left;
        color: rgb(202, 202, 202);
      }
      .value {
        flex: 9;
        color: #00de7e;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .score {
        flex: 3;
        color: #f56c6c;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .select-key-score {
    font-size: 12px;
    margin-bottom: 5px;
    flex: 1;
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
  .select-key {
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
