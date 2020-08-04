<template>
  <div class="hostView">
    <div class="header">
      <el-button type="primary" size="mini">主要按钮</el-button>
      <el-button type="success" size="mini">成功按钮</el-button>
    </div>
    <div class="body">
      <div class="dbBox">
        <!-- 头部操作栏 -->
        <div class="dbBoxHeader">
          <div class="selectBox">
            <el-select size="mini" v-model="selectDB" placeholder="SELECT DB">
              <el-option
                v-for="item in dbs"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="opertionsBox">
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
            <li v-for="(k, i) of keys" :key="i">
              <span>{{ k }}</span>
              <div>
                <i class="el-icon-close"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Header from '@/front/components/Header.vue'

export default {
  name: 'hostView',
  data () {
    return {
      selectDB: '',
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
      ],
      keys: ['pika', '1000', 20002, 20003, 'name', '1000', 20002, 20003, '1000', 20002, 20003, '1000', 20002, 20003, '1000', 20002, 20003, '1000', 20002, 20003, '1000', 20002, 20003, '1000', 20002, 20003]
    }
  },
  components: {
  },
  methods: {
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
  background-color: #416080;
  .header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 40px;
    margin-bottom: 20px;
  }
  .body {
    height: 100%;
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
          // color: #a9a9a9;
          color: #fff;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #416080;
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
            // margin-bottom: 2px;
            height: 25px;
            > div {
              height: 18px;
              line-height: 18px;
              width: 18px;
              border-radius: 50%;
              font-size: 10px;
              &:hover {
                background-color: #416080;
                color: #02f32b;
              }
            }
            &:hover {
              background-color: #1c3046;
              transition: all 500ms;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
