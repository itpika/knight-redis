<template>
  <div id="hostView" v-loading.lock="current.connectState === -1" element-loading-background="#4f6d8c" class="hostView bgkColor">
    <div :class="['content', {'hiddenClass': !(current.connectState === 0)}]">
      <div class="header">
        <div class="terminalBtn"><el-button type="info" size="small" round @click.stop="current.shellState.open = !current.shellState.open">Terminal</el-button></div>
      </div>
      <div class="body">
        <div v-loading.lock="current.dbLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.6)" class="dbBox bgdColor-radio-kgt">
          <!-- 头部操作栏 -->
          <div class="dbBoxHeader">
            <div class="selectBox">
              <el-select
              size="mini" @change="selectDBChange"
              v-model="current.selectDB" placeholder="SELECT DB">
                <el-option
                  v-for="item in dbs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span class="key-number fontColor2"><span>{{keyCount || ''}}</span></span>
            </div>
            <div class="opertionsBox bgkColor">
              <el-tooltip class="item" content="NEW KEY" placement="top">
                <i class="el-icon-plus add" @click.stop="addKey"></i>
              </el-tooltip>
              <el-tooltip class="item" content="REFRESH" placement="top">
                <i class="el-icon-refresh refresh" @click.stop="refreshDB"></i>
              </el-tooltip>
              <el-tooltip class="item" content="CLEAR ALL" placement="top">
                <i class="el-icon-delete delete"></i>
              </el-tooltip>
              <el-tooltip class="hidden-sm-and-down" :content="(current.realTime === '0' ? 'Enable':'Disable')+' Live Update'" placement="top">
                <el-switch
                  v-model="current.realTime"
                  active-color="#13ce66"
                  inactive-color="#152435"
                  active-value="1"
                  inactive-value="0">
                </el-switch>
              </el-tooltip>
            </div>
          </div>
          <!-- 数据展示body -->
          <div class="dbBoxBody bkg-radio-kgt" ref="dbBoxBody">
            <ul>
              <li v-for="(v, i) of current.dbData" :key="i" @click.stop="keyDetail(v)">
                <div class="left">
                  <i class="el-icon-key brightBlueColor"></i>
                  <span>{{ v }}</span>
                </div>
                <i class="el-icon-close" @click.stop="clientRemoveKey(v)"></i>
              </li>
            </ul>
          </div>
        </div>
        <div :class="['key-detail-box', 'bgdColor-radio-kgt',  { 'hiddenClass': keyDetailShow }]">
          <KeyDetail @deleteKey="deleteKey" />
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div :class="['mask', 'bgkColor', {'hiddenClass': current.connectState === 0}]">
      <!-- 错误提示框 -->
      <kdialog :show="current.connectState !== 0 && current.connectState !== -1" :label="current.label"
        :text="current.dialogState.promptTest" type="warning"
        rightOpertion="RECONNECT" leftOpertion="CANCEL"
        @leftCallback="cancelConnect" @rightCallback="reconnect"></kdialog>
    </div>
    <!-- 透明遮罩层 -->
    <div :class="['lucency-mask', {visibleClass: current.dialogState.lucencyMaskShow}]">
      <!-- 信息提示框 -->
      <kdialog :show="current.dialogState.lucencyMaskShow" :text="current.dialogState.infoShowTest" :label="current.dialogState.infoShowTitle"
        rightOpertion="OK" leftOpertion="CANCEL" rightType="warning" type="warning"
        @leftCallback="closeInfoDialog" @rightCallback="removeKey()"></kdialog>
    </div>
    <NewKey :drawer="drawer"/>
    <transition name="terminal" mode="out-in">
      <Terminal v-if="current.shellState.open" :address="`${current.conf.address}:${current.conf.port}`"/>
    </transition>
  </div>
</template>

<script>
import kdialog from '@/front/components/common/k-dialog.vue'
import NewKey from '@/front/components/host/newKey.vue'
import KeyDetail from '@/front/components/host/keyDetail.vue'
import Terminal from '@/front/components/host/terminal.vue'
export default {
  name: 'hostView',
  computed: {
    current() {
      return this.$store.state.hostView.current
    },
    keyDetailShow() {
      return !this.$store.state.hostView.current.keyDetailShow
    },
    hosts() {
      return this.$store.state.host.openHost
    },
    saveKeyOK() {
      return this.$store.state.newKey.ok
    },
    deleteKeyOK() {
      return this.$store.state.hostView.current.deleteKeyOK
    },
    keyCount() {
      return this.$store.state.hostView.current.dbData.length
    },
    drawer: {
      get () {
        return this.$store.state.newKey.drawer
      },
      set (value) {
        this.$store.state.newKey.drawer = value
      }
    }
  },
  data () {
    return {
      terminal: false,
      dbs: [
        { value: 0, label: 'DB0' }, { value: 1, label: 'DB1' },
        { value: 2, label: 'DB2' }, { value: 3, label: 'DB3' },
        { value: 4, label: 'DB4' }, { value: 5, label: 'DB5' },
        { value: 6, label: 'DB6' }, { value: 7, label: 'DB7' },
        { value: 8, label: 'DB8' }, { value: 9, label: 'DB9' },
        { value: 10, label: 'DB10' }, { value: 11, label: 'DB11' },
        { value: 12, label: 'DB12' }, { value: 13, label: 'DB13' },
        { value: 14, label: 'DB14' }, { value: 15, label: 'DB15' }
      ]
    }
  },
  components: {
    kdialog,
    NewKey,
    Terminal,
    KeyDetail
  },
  methods: {
    keyDetail(k) { // 点击查看key详情
      this.current.keyDetailShow = true
      this.current.keyDetail.keyName = k
      this.$store.commit('redis/keyDetail', { time: this.current.time, key: k })
      // 重置重命名key相关的状态
      this.current.keyDetail.renameStatus = 0
      this.current.keyDetail.rename = false
      this.current.keyDetail.newKeyName = ''
    },
    openTerminal() {
      this.terminal = true
    },
    addKey() {
      if (this.current.selectDB === null) {
        this.$notify.warning({
          duration: 2000,
          customClass: 'notifyBox',
          message: 'Please select the db first!'
        })
        return
      }
      this.drawer = true
    },
    // 连接失败后取消
    cancelConnect() {
      // 删除左侧host栏目项
      this.$store.commit('host/closeHost', this.current.time)
      // 删除右侧host栏目项数据
      this.$store.commit('hostView/closeHost', this.current.time)
      // host项被关闭了，选出激活显示的下一个host
      if (this.hosts.length === 0) { // 没有打开的host项了
        // 所有的host关闭了，设置host菜单栏为选中
        this.$store.commit('host/setHostState', true)
        // 跳转到host路由
        this.$router.push({ name: 'host' })
      } else {
        // 设置左侧host的激活项
        this.hosts[this.hosts.length - 1].isActive = true
        // 设置左侧host激活项的右侧页面数据
        this.$store.commit('hostView/restoreCurrentHost', this.hosts[this.hosts.length - 1].time)
      }
    },
    // 重连
    reconnect() {
      this.$store.commit('hostView/reconnect')
    },
    // 在key详情页面删除key
    deleteKey(data) {
      this.clientRemoveKey(data)
    },
    // 在key列表里面删除key
    clientRemoveKey: function (val) { // 点击删除key
      this.current.dialogState.infoShowTitle = 'Delete key' // 设置info提示框标题
      this.current.dialogState.infoShowTest = `Are you sure you want to delete this key ${val}?` // 设置info提示框内容
      this.current.dialogState.lucencyMaskShow = true // 弹出透明遮罩层
      this.toDeleteKey = val
    },
    refreshDB: function () {
      if (this.current.selectDB === null) return 0
      this.current.dbLoading = true
      this.$store.commit('redis/getAllKey', { index: this.current.selectDB, time: this.current.time })
    },
    removeKey: function () { // 删除key
      this.$store.commit('redis/removeKey', {
        time: this.current.time,
        index: this.current.selectDB,
        key: this.toDeleteKey,
        liveUpdate: this.current.realTime === '1'
      })
      // 重制key详情组件数据
      this.current.keyDetailShow = false
      this.current.keyDetail = {
        keyName: '',
        type: '-',
        ttl: -1,
        value: '',
        rename: false,
        renameStatus: 0,
        newKeyName: ''
      }
      this.current.dbData = this.current.dbData.filter(v => {
        return this.toDeleteKey !== v
      })
      if (this.current.realTime === '1') this.current.dbLoading = true
      this.current.dialogState.lucencyMaskShow = false // 关闭透明遮罩层
    },
    closeInfoDialog: function () { // 取消删除key
      this.current.dialogState.lucencyMaskShow = false // 关闭透明遮罩层
    },
    // 获取当前选择db的所有key
    selectDBChange: function (index) {
      // this.current.dbLoading = true
      this.current.dbData = []
      this.$store.commit('redis/getAllKey', { index, time: this.current.time })
    }
  },
  watch: {
    saveKeyOK(val, old) {
      if (val) {
        this.$notify.success({
          message: 'SAVE SUCCESS!',
          customClass: 'notifyBox',
          duration: 2000
        })
        this.$store.commit('newKey/setOk', false)
      }
    },
    deleteKeyOK(val, old) { // 删除key后，弹窗提示
      if (val === 1 && old === 0) {
        this.$notify.error({
          iconClass: 'el-icon-success',
          duration: 2000,
          customClass: 'notifyBox',
          message: 'DELETE SUCCESS'
        })
        this.current.deleteKeyOK = 0
      }
    }
  },
  created: function () {
  }
  // 改变中间内容块的背景颜色
  // beforeCreate: function() {
  //   this.$store.commit('app/setMainClass', 'menu_bgd_color')
  // }
}
</script>
<style scoped lang="less">
.hostView {
  padding: 10px 20px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .content {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 55px;
      padding-bottom: 10px;
      box-sizing: border-box;
      .terminalBtn {
        /deep/ .el-button--info {
          border: 0;
          background-color: #152435;
          transition: all 300ms;
          &:hover {
            color: #00de7e;
            background-color: #26405c;
          }
        }
      }
    }
    .body {
      // height: 90%;
      flex: 1;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .dbBox {
        padding: 10px;
        width: 35%;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .dbBoxHeader {
          height: 28px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          .opertionsBox {
            margin-left: 10px;
            padding: 0 10px;
            color: #fff;
            box-sizing: border-box;
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 5px;
            .add {
              transition: all 500ms;
              &:hover {
                cursor: pointer;
                color: #00de7e;
              }
            }
            .refresh {
              transition: all 500ms ease-out;
              &:hover {
                cursor: pointer;
                color: #00fff3;
              }
            }
            .delete {
              transition: all 200ms ease-out;
              &:hover {
                color: #fa4c4c;
                cursor: pointer;
              }
            }
          }
          .selectBox {
            height: 100%;
            width: 50%;
            /deep/ .el-input__inner {
              border: none;
              background-color: #4f6d8c;
              outline: none;
              color: #00de7e;
            }
            position: relative;
            .key-number {
              height: 100%;
              position: absolute;
              font-size: 10px;
              right: 30%;
              span {
                display: flex;
                align-items: center;
                height: 100%;
              }
            }
          }
        }
        .dbBoxBody {
          margin-top: 10px;
          box-sizing: border-box;
          overflow: auto;
          flex: 1;
          position: relative;
          > ul {
            position: absolute;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            padding: 10px 10px;
            margin: 0;
            list-style: none;
            li {
              display: flex;
              width: 100%;
              justify-content: space-between;
              align-items: center;
              color: #fff;
              padding: 0 6px 0 4px;
              box-sizing: border-box;
              font-size: 16px;
              border-radius: 5px;
              height: 25px;
              .left {
                display: flex;
                flex: 0.9;
                overflow: hidden;
                span {
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                i {
                  font-size: 18px;
                  margin-right: 2px;
                  color: #00de7e;
                }
              }
              > i {
                &:hover {
                  color: #ff0505;
                }
                visibility: hidden;
              }
              &:hover {
                background-color: #152435;
                transition: all 500ms;
                cursor: pointer;
                > i {
                  visibility: visible;
                }
              }
            }
          }
        }
      }
      .key-detail-box {
        padding: 10px;
        width: 63%;
        display: flex;
        box-sizing: border-box;
      }
    }
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .lucency-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    visibility: hidden;
    > div {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
  .terminal-enter-active, .terminal-leave-active {
    transition: all .5s ease;
  }
  .terminal-enter, .terminal-leave-to {
    transform: translateY(100%);
  }
}
</style>
