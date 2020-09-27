<template>
  <div class="box radio-kgt">
    <div class="header">
      <div class="left bkg-radio-kgt">
        <div :class="['box', { 'displayHidden': rename }]">
          <div class="key-type greenColor">
            <span>{{this.current.keyDetail.type}}:</span>
          </div>
          <span class="key-name">
            <el-tooltip :content="keyName" effect="dark" offset="0" placement="top-start">
              <span>{{keyName}}</span>
            </el-tooltip>
          </span>
        </div>
        <div :class="['input-name', { 'displayHidden': !rename }]">
          <el-input v-model="newKeyName" size="mini" placeholder="key name" ref="rename"></el-input>
          <i @click.stop="renameKey" class="el-icon-circle-check"></i>
        </div>
      </div>
      <div class="right">
        <div @click.stop="reload" class="reload radio-kgt">
          <i class="el-icon-refresh-right"/>
          <span class="hidden-sm-and-down" v-html="'&nbsp;reload'"></span>
        </div>
        <div class="rename bkg-radio-kgt" @click.stop="renameClick">
          <i v-if="!current.keyDetail.rename" class="el-icon-edit"/>
          <span class="hidden-sm-and-down" v-html="!current.keyDetail.rename ? '&nbsp;rename' : '&nbsp;cancel'"></span>
        </div>
        <div class="delete radio-kgt" @click.stop="deleteKey">
          <i class="el-icon-delete-solid"/>
          <span class="hidden-sm-and-down" v-html="'&nbsp;delete'"></span>
        </div>
        <div class="ttl bkg-radio-kgt hidden-xs-only">
          TTL:<span v-html="'&nbsp;'+this.current.keyDetail.ttl"></span>
        </div>
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
        <div v-text="current.keyDetail.value" class="string-box bgdColor-radio-kgt" 
         @paste="filterText" v-if="this.current.keyDetail.type === string" contenteditable="true">
        </div>
        <HashDetail v-else-if="this.current.keyDetail.type === hash"/>
        <ListDetail v-else-if="this.current.keyDetail.type === list"/>
        <SetDetail v-else-if="this.current.keyDetail.type === set"/>
        <ZSetDetail v-else-if="this.current.keyDetail.type === zset"/>
      </div>
    </div>
  </div>
</template>
<script>
import { STRING, LIST, HASH, SET, ZSET } from '../../../lib/redis/singal'
import HashDetail from '@/front/components/host/keyTypeDetail/hash'
import ListDetail from '@/front/components/host/keyTypeDetail/list'
import SetDetail from '@/front/components/host/keyTypeDetail/set'
import ZSetDetail from '@/front/components/host/keyTypeDetail/zset'
export default {
  name: 'keyDetail',
  components: {
    HashDetail,
    ListDetail,
    SetDetail,
    ZSetDetail
  },
  computed: {
    current() {
      return this.$store.state.hostView.current
    },
    keyName() {
      return this.$store.state.hostView.current.keyDetail.keyName
    },
    renameStatus() {
      return this.$store.state.hostView.current.keyDetail.renameStatus
    },
    newKeyName: {
      get() {
        return this.$store.state.hostView.current.keyDetail.newKeyName
      },
      set(newVal) {
        this.$store.state.hostView.current.keyDetail.newKeyName = newVal
      }
    },
    rename() {
      return this.$store.state.hostView.current.keyDetail.rename
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
      list: LIST.upName,
      set: SET.upName,
      zset: ZSET.upName
    }
  },
  methods: {
    // 重加载key详情
    reload() {
      this.$store.commit('redis/keyDetail', { 
        time: this.current.time,
        key: this.current.keyDetail.keyName,
        index: this.current.selectDB 
      })
      if (this.current.keyDetail.rename) this.current.keyDetail.rename = !this.current.keyDetail.rename
    },
    // 删除key
    deleteKey() {
      this.$emit('deleteKey', this.current.keyDetail.keyName)
    },
    filterText(e) { // 过滤粘贴文本多余的样式
      e.preventDefault()
      const text = e.clipboardData.getData('Text')
      document.execCommand('insertText', false, text)
    },
    renameClick() { // 重命名key，ui展示
      this.current.keyDetail.rename = !this.current.keyDetail.rename
      this.current.keyDetail.newKeyName = this.keyName
      this.$nextTick(() => {
        this.$refs.rename.focus()
      })
    },
    renameKey() { // 重命名key，新名字不能已存在
      this.current.dbLoading = true
      this.$store.commit('redis/rename', {
        time: this.current.time,
        key: this.current.keyDetail.keyName,
        newKey: this.current.keyDetail.newKeyName,
        index: this.current.selectDB,
        realTime: this.current.realTime
      })
    }
  },
  watch: {
    renameStatus(newVal, old) {
      if (newVal === 0) return
      if (newVal === 1) {
        this.$notify.success({
          duration: 2000,
          customClass: 'notifyBox',
          message: 'Rename Success!'
        })
      } else if (newVal === -1) {
        this.$notify.error({
          duration: 2000,
          customClass: 'notifyBox',
          message: 'The Fail, Key already exists!'
        })
      }
      this.current.keyDetail.renameStatus = 0
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
      box-sizing: border-box;
      padding: 0 10px;
      margin-right: 5px;
      .box {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        justify-content: flex-start;
        flex-direction: row;
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
      .input-name {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-input {
          height: 100%;
          width: 95%;
          /deep/ .el-input__inner {
            font-size: 13px;
            height: 100%;
            border: none;
            background-color: #4f6d8c;
            outline: none;
            color: #00de7e;
          }
        }
        i {
          flex: 1;
          color: #909399;
          font-size: 18px;
          transition: color 0.2s;
          &:hover {
            color: #00de7e;
            cursor: pointer;
          }
        }
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
        background-color: #00de7e;
        &:hover {
          background-color: #01c671;
        }
        
      }
      .ttl {
      }
      .reload {
        margin-right: 5px;
        cursor: pointer;
        background-color: #5894cf;
        &:hover {
          background-color: #52789f;
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
    }
  }
}
</style>
