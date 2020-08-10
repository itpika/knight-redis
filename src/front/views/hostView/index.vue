<template>
  <div class="hostView bgkColor">
    <div :class="['content', {'hiddenClass': !(current.connectState === 0)}]">
      <div class="header">
        <div class="terminalBtn"><el-button type="info" size="small" round>Terminal</el-button></div>
      </div>
      <div class="body">
        <div class="dbBox">
          <!-- 头部操作栏 -->
          <div class="dbBoxHeader">
            <div class="selectBox">
              <el-select size="mini" v-model="current.selectDB" placeholder="SELECT DB">
                <el-option
                  v-for="item in dbs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="opertionsBox bgkColor">
              <el-tooltip class="item" effect="light" content="NEW KEY" placement="top">
                <i class="el-icon-plus add"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="REFRESH" placement="top">
                <i class="el-icon-refresh refresh"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="CLEAR ALL" placement="top">
                <i class="el-icon-delete delete"></i>
              </el-tooltip>
            </div>
          </div>
          <!-- 数据展示body -->
          <div class="dbBoxBody bgkColor">
            <ul>
              <li v-for="(k, i) of current.dbData" :key="i">
                <span>{{ k }}</span>
                <i class="el-icon-close"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div :class="['mask', 'bgkColor', {'hiddenClass': current.connectState === 0}]">
      <!-- loader加载圈 -->
      <div :class="['loader_1', {'visibleClass': current.connectState === -1}]"></div>
      <!-- 错误提示框 -->
      <div :class="['promptBox', {'hiddenClass': (current.connectState === 0 || current.connectState === -1)}]">
        <div class="header">
          <p>{{current.label}}</p>
          <i class="el-icon-close"></i>
        </div>
        <div class="body">{{promptBodyTest}}</div>
        <div class="bottom">
          <kbutton size="nomal" val="CANCEL" type="info" @click.native="cancelConnect"/>
          <kbutton size="nomal" val="RECONNECT" type="success" @click.native="reconnect"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import kbutton from '@/front/components/common/k-button.vue'
export default {
  name: 'hostView',
  computed: {
    current() {
      return this.$store.state.hostView.current
    },
    promptBodyTest() {
      return this.$store.state.hostView.promptBodyTest
    },
    hosts() {
      return this.$store.state.host.openHost
    }
  },
  data () {
    return {
      dbs: [
        { value: 0, label: 'DB0' },
        { value: 1, label: 'DB1' },
        { value: 2, label: 'DB2' },
        { value: 3, label: 'DB3' },
        { value: 4, label: 'DB4' },
        { value: 5, label: 'DB5' },
        { value: 6, label: 'DB6' },
        { value: 7, label: 'DB7' },
        { value: 8, label: 'DB8' },
        { value: 9, label: 'DB9' },
        { value: 10, label: 'DB10' },
        { value: 11, label: 'DB11' },
        { value: 12, label: 'DB12' },
        { value: 13, label: 'DB13' },
        { value: 14, label: 'DB14' },
        { value: 15, label: 'DB15' }
      ]
    }
  },
  components: {
    kbutton
  },
  methods: {
    // 连接失败后取消
    cancelConnect() {
      console.log('11')
      // 删除左侧host栏目项
      this.$store.commit('host/closeHost', this.current.time)
      // 删除右侧host栏目项数据
      this.$store.commit('hostView/closeHost', this.current.time)
      // host项被关闭了，选出激活显示的下一个host
      if (this.hosts.length === 0) { // 没有打开的host项了
        // 所有的host关闭了，设置host菜单栏为选中
        this.selectActiveMenu()
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
    }
  },
  // 改变中间内容块的背景颜色
  beforeCreate: function() {
    this.$store.commit('app/setMainClass', 'menu_bgd_color')
  }
}
</script>
<style scoped lang="less">
.hostView {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .content {
    .header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 10%;
      padding-bottom: 20px;
      box-sizing: border-box;
      .terminalBtn {
        /deep/ .el-button--info {
          border: 0;
          background-color: #1c3046;
          transition: all 300ms;
          &:hover {
            color: #02f32b;
            background-color: #26405c;
          }
        }
      }
    }
    .body {
      height: 90%;
      box-sizing: border-box;
      .dbBox {
        padding: 10px;
        width: 25%;
        height: 80%;
        border-radius: 6px;
        background-color: #1c3046;
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
            width: 50%;
            color: #fff;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 5px;
            .add {
              transition: all 500ms;
              &:hover {
                cursor: pointer;
                color: #02f32b;
                transform: rotate(90deg);
              }
            }
            .refresh {
              transition: all 500ms ease-out;
              &:hover {
                cursor: pointer;
                color: #00fff3;
                transform: rotate(180deg);
              }
            }
            .delete {
              transition: all 200ms ease-out;
              &:hover {
                color: #fa4c4c;
                cursor: pointer;
                transform: rotate(45deg);
              }
            }
          }
          .selectBox {
            width: 50%;
            /deep/ .el-input__inner {
              border: none;
              background-color: #416080;
              outline: none;
              color: #02f32b;
            }
          }
        }
        .dbBoxBody {
          // height: 100%;
          flex: 1;
          margin-top: 10px;
          border-radius: 5px;
          box-sizing: border-box;
          overflow: scroll;
          overflow-x: visible;
          > ul {
            box-sizing: border-box;
            height: 100%;
            padding: 10px 10px;
            margin:0;
            list-style:none;
            li {
              display: flex;
              width: 100%;
              justify-content: space-between;
              align-items: center;
              color: #fff;
              padding: 0 10px;
              box-sizing: border-box;
              font-size: 16px;
              border-radius: 5px;
              height: 25px;
              > i {
                &:hover {
                  color: #f30202;
                }
                visibility: hidden;
              }
              &:hover {
                background-color: #1c3046;
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
    .loader_1 {
      visibility: hidden;
      font-size: 8px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
    .promptBox {
      width: 45%;
      height: 35%;
      border-radius: 5px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      > div {
        padding: 0 5%;
      }
      .header {
        height: 34%;
        color: #fff;
        font-size: 17px;
        background-color: #ff6262;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        i {
          &:hover {
            cursor: pointer;
          }
        }
      }
      .body {
        height: 33%;
        display: flex;
        align-items: center;
      }
      .bottom {
        height: 33%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        > :last-child {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
