<template>
  <div class="box radio-kgt">
    <div class="header">
      <div class="left bkg-radio-kgt">
        <div :class="['box', { 'displayHidden': rename }]">
          <div class="key-type greenColor">
            <span>{{this.keyType}}:</span>
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
        <div :class="[{'save': !saveDrop}, 'bkg-radio-kgt', 'hidden-xs-only', {'no-drop': saveDrop}]" @click.stop="saveKey">
          <i class="el-icon-document-checked"/>
          <span class="hidden-sm-and-down" v-html="'&nbsp;save'"></span>
        </div>
      </div>
    </div>
    <div class="body bkg-radio-kgt">
      <div class="detail-head radio-kgt">
        <div class="left">
          <div class="ttl ttl-box bgdColor" v-show="current.keyDetail.ttlShow" @click="editTTL"><div class="text" v-html="'TTL :'+'&nbsp;'+this.current.keyDetail.ttl"></div></div>
          <div class="ttl ttl-input" v-show="!current.keyDetail.ttlShow" @click="editTTL">
            <el-input ref="ttl-input" @keyup.esc.native="esclTTL" v-model="this.ttlValue" placeholder="TTL" size="mini">
            </el-input>
            <div class="ttl-save bgdColor" @click.stop="ttlKeep"><i class="el-icon-check"/></div>
          </div>
          <!-- <div class="ttl bgdColor" v-html="'TTL :'+'&nbsp;'+this.current.keyDetail.ttl">></div> -->
        </div>
        <div class="right">
          <el-select v-model="keyViewType" size="mini" @change="keyShowTypechange">
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
        <div id="string-input" v-text="current.keyDetail.value" class="string-box bgdColor-radio-kgt" 
         @paste="filterText" v-if="this.keyType === string" contenteditable="true">
        </div>
        <HashDetail v-else-if="this.keyType === hash"/>
        <ListDetail v-else-if="this.keyType === list"/>
        <SetDetail v-else-if="this.keyType === set"/>
        <ZSetDetail v-else-if="this.keyType === zset"/>
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
import send from '@/front/lib/channel/send.js'
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
      return this.current.keyDetail.keyName
    },
    keyType() {
      return this.current.keyDetail.type
    },
    renameStatus() {
      return this.$store.state.hostView.current.keyDetail.renameStatus
    },
    saveKeyCode() {
      return this.$store.state.hostView.current.keyDetail.saveKeyCode
    },
    saveDrop() {
      return this.$store.state.hostView.current.keyDetail.saveDrop
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
    },
    ttlSave() {
      return this.$store.state.hostView.current.keyDetail.ttlSave
    }
  },
  data: function () {
    return {
      textType: [
        { value: 'text', key: 1 },
        { value: 'hex', key: 3 }
      ],
      keyViewType: 1,
      string: STRING.upName,
      hash: HASH.upName,
      list: LIST.upName,
      set: SET.upName,
      zset: ZSET.upName,
      ttlValue: 0
    }
  },
  methods: {
    ttlKeep() { // save ttl
      const ttl = parseInt(this.current.keyDetail.ttl)
      if (isNaN(ttl)) {
        this.$notify.error({
          duration: 2000,
          customClass: 'notifyBox',
          message: 'Invalid value!'
        })
        return
      }
      send.sendEvent('saveTTL', { 
        time: this.current.time,
        key: this.current.keyDetail.keyName,
        ttl,
        index: this.current.selectDB 
      })
    },
    editTTL() { // ttl编辑
      // if (this.current.keyDetail.ttlTimer) clearInterval(this.current.keyDetail.ttlTimer) // 停掉ttl定时器具
      this.ttlValue = this.current.keyDetail.ttl
      this.current.keyDetail.ttlShow = false
      this.$nextTick(() => {
        this.$refs['ttl-input'].focus()
      })
    },
    esclTTL() { // esc按键 取消ttl修改
      this.current.keyDetail.ttlShow = true
    },
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
    },
    keyShowTypechange(val) { // key展示类型变化
      // this.keyShowType = val
    },
    saveKey() {
      if (this.current.keyDetail.saveDrop) return // 是否允许保存
      let value
      switch (this.keyType) {
        case this.string:
          this.$store.commit('saveKey/string', {
            time: this.current.time, index: this.current.selectDB,
            key: this.keyName, value: document.querySelector('#string-input').textContent
          })
          break
        case this.hash:
          const hkey = document.querySelector('#hash-key-input').textContent
          const hvalue = document.querySelector('#hash-value-input').textContent.trim()
          this.$store.commit('saveKey/hash', {
            time: this.current.time, index: this.current.selectDB, type: 1, // type=1, hset是修改原来的key
            realTime: this.current.realTime, key: this.keyName, hkey, hvalue
          })
          break
        case this.list:
          value = document.querySelector('#list-input').textContent.trim()
          const listIndex = document.querySelector('#list-index-input').textContent.trim()
          this.$store.commit('saveKey/list', {
            time: this.current.time, index: this.current.selectDB,
            realTime: this.current.realTime, key: this.keyName, value, listIndex: parseInt(listIndex)
          })
          break
        case this.set:
          value = document.querySelector('#set-input').textContent.trim()
          const oldValue = document.querySelector('#set-old-input').textContent
          this.$store.commit('saveKey/set', {
            time: this.current.time, index: this.current.selectDB, 
            realTime: this.current.realTime, key: this.keyName, value, oldValue
          })
          break
        case this.zset:
          const score = document.querySelector('#zset-score-input').textContent.trim()
          value = document.querySelector('#zset-value-input').textContent.trim()
          this.$store.commit('saveKey/zset', {
            time: this.current.time, index: this.current.selectDB, 
            realTime: this.current.realTime, key: this.keyName, value, score, 
            oldValue: document.querySelector('#zset-old-input').textContent.trim()
          })
          break
        default:
          break
      }
    }
  },
  watch: {
    ttlSave(newVal, old) {
      if (!newVal) return
      if (newVal) {
        this.$notify.success({
          duration: 2000,
          customClass: 'notifyBox',
          message: 'SUCCESS'
        })
      }
      this.current.keyDetail.ttlSave = false
    },
    renameStatus(newVal, old) { // 重命名key状态提示通知
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
    },
    saveKeyCode(newVal, old) { // 保存key值状态提示通知
      if (newVal === 0) return
      if (newVal === 1) {
        this.$notify.success({
          duration: 2000,
          customClass: 'notifyBox',
          message: 'SAVE SUCCESS!'
        })
      } else if (newVal === -1) {
        this.$notify.error({
          duration: 4000,
          customClass: 'notifyBox',
          message: 'FAIL!'
        })
      } else if (newVal === -2) {
        this.current.keyDetailShow = false // 关闭key详情窗口
        this.$notify.error({
          duration: 3000,
          customClass: 'notifyBox',
          message: 'The key doesn\'t exist!'
        })
        // 刷新key列表
        this.current.dbLoading = true
        this.$store.commit('redis/getAllKey', { index: this.current.selectDB, time: this.current.time })
      } else if (newVal === -3) { // key的长度发生变化，操作中断, 针对list
        this.$notify.error({
          duration: 5000,
          customClass: 'notifyBox',
          message: 'The key length changes!'
        })
        this.current.keyDetail.saveDrop = true
        this.current.keyDetail.ketData.list = ''
        this.reload() // 重载key
      }
      this.current.keyDetail.saveKeyCode = 0
    },
    keyType(newVal, old) { // key类型变化，数据展示形式变化
      if (newVal === STRING.upName) {
        this.textType = [
          { value: 'text', key: 1 },
          { value: 'hex', key: 3 }
        ]
      } else if (newVal === HASH.upName) {
        this.textType = [
          { value: 'text', key: 1 },
          { value: 'json', key: 2 },
          { value: 'hex', key: 3 }
        ]
      } else if (newVal === LIST.upName) {
        this.textType = [
          { value: 'text', key: 1 },
          { value: 'json', key: 2 },
          { value: 'hex', key: 3 }
        ]
      } else if (newVal === SET.upName) {
        this.textType = [
          { value: 'text', key: 1 },
          { value: 'hex', key: 3 }
        ]
      } else if (newVal === ZSET.upName) {
        this.textType = [
          { value: 'text', key: 1 },
          { value: 'json', key: 2 },
          { value: 'hex', key: 3 }
        ]
      }
    }
  },
  created() {
    if (this.keyType === STRING.upName) {
      this.textType = [
        { value: 'text', key: 1 },
        { value: 'hex', key: 3 }
      ]
    } else if (this.keyType === HASH.upName) {
      this.textType = [
        { value: 'text', key: 1 },
        { value: 'json', key: 2 },
        { value: 'hex', key: 3 }
      ]
    } else if (this.keyType === LIST.upName) {
      this.textType = [
        { value: 'text', key: 1 },
        { value: 'json', key: 2 },
        { value: 'hex', key: 3 }
      ]
    } else if (this.keyType === SET.upName) {
      this.textType = [
        { value: 'text', key: 1 },
        { value: 'hex', key: 3 }
      ]
    } else if (this.keyType === ZSET.upName) {
      this.textType = [
        { value: 'text', key: 1 },
        { value: 'json', key: 2 },
        { value: 'hex', key: 3 }
      ]
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
    // height: 10%;
    flex: 1;
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
        background-color: #E6A23C;
        &:hover {
          background-color: #c58e3b;
        }
      }
      .save {
        margin-right: 5px;
        cursor: pointer;
        background-color: #00de7e;
        &:hover {
          background-color: #01c671;
        }
      }
      .no-drop {
        margin-right: 5px;
        background-color: #6fb899;
        cursor: no-drop;
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
        display: flex;
        align-items: center;
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
    flex: 12;
    padding: 5px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    .detail-head {
      height: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #00de7e;
      .left {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        flex: 6;
        .ttl {
          box-sizing: border-box;
          width: 15%;
          border-radius: 15px;
          height: 100%;
        }
        .ttl-input {
          width: 20%;
          /deep/ .el-input__inner {
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            border: 0;
            background-color: #152435;
            color: #fff;
            height: 100%;
          }
          /deep/ .el-input {
            height: 100%;
          }
          display: flex;
          .ttl-save {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
            width: 30px;
            color: #fff;
            &:hover {
              cursor: pointer;
              color: #00de7e;
            }
          }
        }
        .ttl-box {
          color: #C0C4CC;
          &:hover {
            cursor: pointer;
            color: #fff;
          }
          .text {
            padding: 0 5px;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            position: relative;
            transform: translateY(-50%);
            top: 50%;
          }
        }
      }
      .right {
        flex: 1;
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
