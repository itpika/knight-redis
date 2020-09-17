<template>
  <div class="box radio-kgt">
    <div class="header">
      <div class="left bkg-radio-kgt">
        <div class="key-type greenColor">
          <span>{{this.current.keyDetail.type}}:</span>
        </div>
        <span class="key-name">
          <el-tooltip :content="keyName" effect="dark" offset="0" placement="top-start">
            <span class="key-name">{{keyName}}</span>
          </el-tooltip>
        </span>
      </div>
      <div class="right">
        <div class="reload radio-kgt" @click.stop="reload"><i class="el-icon-refresh-right"/><span v-html="'&nbsp;reload'"></span></div>
        <div class="rename bkg-radio-kgt"><span v-html="'&nbsp;rename'"></span></div>
        <div class="delete radio-kgt" @click.stop="deleteKey"><i class="el-icon-delete-solid"/><span v-html="'&nbsp;delete'"></span></div>
        <div class="ttl bkg-radio-kgt">TTL:<span v-html="'&nbsp;'+this.current.keyDetail.ttl"></span></div>
      </div>
    </div>
    <div class="body bkg-radio-kgt">
      <div class="detail-head radio-kgt">
        <div class="left"></div>
        <div class="right">
          <el-select v-model="keyViewType" size="mini">
            <el-option
              v-for="item in textType"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="detail-text radio-kgt">
        <div v-text="current.keyDetail.value" class="string-box bgdColor-radio-kgt" v-if="this.current.keyDetail.type === string" contenteditable="true">
        </div>
        <div class="hash-box" v-else-if="this.current.keyDetail.type === hash">
          <ul class="bgdColor-radio-kgt">
            <li class="radio-kgt">
              <div class="row greenColor">row</div>
              <div class="key greenColor">key</div>
              <div class="value greenColor">value</div>
            </li>
            <li class="radio-kgt select" v-for="(item, i) in this.current.keyDetail.value.keys" :key="i">
              <div class="row">{{i+1}}</div>
              <div class="key">{{item}}</div>
              <div class="value">{{current.keyDetail.value.values[i]}}</div>
            </li>
          </ul>
          <div class="select-key"></div>
          <div class="select-key-value"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { STRING, LIST, HASH, SET, ZSET } from '../../../lib/redis/singal'
export default {
  name: 'keyDetail',
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
      keyType: 'HASH',
      textType: [
        { value: 'text', key: 1 },
        { value: 'json', key: 2 },
        { value: 'hex', key: 3 }
      ],
      keyViewType: 1,
      string: STRING.upName,
      hash: HASH.upName,
      set: LIST.upName,
      zset: ZSET.upName
    }
  },
  methods: {
    // 重加载key详情
    reload() {
      this.$store.commit('redis/keyDetail', { time: this.current.time, key: this.current.keyDetail.keyName })
    },
    // 删除key
    deleteKey() {
      this.$emit('deleteKey', this.current.keyDetail.keyName)
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
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
        font-size: 13px;
        transition: background-color 0.3s;
      }
      .rename {
        margin-right: 5px;
        cursor: pointer;
        &:hover {
          background-color: #52789f;
        }
      }
      .ttl {
      }
      .reload {
        margin-right: 5px;
        background-color: #00de7e;
        cursor: pointer;
        &:hover {
          background-color: #01c671;
        }
      }
      .delete {
        margin-right: 5px;
        background-color: #fa4c4c;
        cursor: pointer;
        &:hover {
          background-color: #d54a4a;
        }
      }
    }
  }
  .body {
    box-sizing: border-box;
    margin-top: 10px;
    flex: 1;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    .detail-head {
      height: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #00de7e;
      .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        /deep/ .el-select {
          height: 100%;
        }
        /deep/ .el-input {
          width: 80px;
          height: 100%;
          input {
            text-align: center;
          }
        }
        /deep/ .el-input__inner {
          height: 100%;
          border: none;
          background-color: #152435;
          outline: none;
          color: #00de7e;
        }
      }
    }
    .detail-text {
      flex: 1;
      padding-top: 5px;
      box-sizing: border-box;
      position: relative;
      .string-box {
        position: absolute;
        overflow: auto;
        box-sizing: border-box;
        padding: 5px 5px;
        font-size: 15px;
        outline: none;
        text-align: left;
        color: #fff;
        height: 100%;
        width: 100%;
        background-color: #152435;
        white-space: pre-wrap;
        &::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          background: #152435;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        }
      }
      .hash-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        ul {
          height: 30%;
          margin: 0;
          padding: 5px 10px;
          list-style: none;
          .select {
            transition: background-color 0.3s;
            &:hover {
              background-color: #4f6d8c;
              cursor: pointer;
            }
          }
          
          li {
            font-size: 14px;
            color: #fff;
            display: flex;
            justify-content: space-between;
            height: 20px;
            .row {
              flex: 1;
            }
            .key {
              flex: 3;
            }
            .value {
              flex: 6;
            }
          }
        }
      }
    }
  }
}
</style>
