<template>
  <div class="host">
    <div class="header">
      <el-button type="primary" icon="el-icon-plus"
      @click="drawer = true" size="mini" round>NEW HOST</el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" round>NEW GROUP</el-button>
    </div>
    <div class="body">
      <div class="line" v-for="(item, index) of hosts"  :key="index">
        <div class="lineLeft">
          <div class="lineLeftIcon bgdColor"><i class="el-icon-s-platform"></i></div>
          <span>{{item.label}}</span>
        </div>
        <div class="lineRight">
          <div class="lineRightOper rotating90 connect" @click="connectionHost(item.id)">
            <i class="el-icon-sort"></i>
          </div>
          <div class="lineRightOper edit" @click="editHost(item.id)">
            <i class="el-icon-edit"></i>
          </div>
          <div class="lineRightOper delete" @click="deleteHost(item.id)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧From表单弹出抽屉 -->
    <el-drawer
      custom-class="pageColor"
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      :before-close="handleClose">
      <!-- 右侧抽屉头部 -->
      <div class="addHostHead">
        <div>
          <div class="closeLeft fontColor">
            <i class="el-icon-back" @click="leftBack"></i>
          </div>
          <div class="addTitle">addHost</div>
        </div>
        <div>
          <el-button @click="submitForm" type="success" size="mini" round>SAVE</el-button>
        </div>
      </div>
      <!-- 右侧抽屉主体 -->
      <div class="addHostBody">
        <el-form ref="host" label-position="left" label-width="80px" :model="host" :rules="rules">
          <el-form-item label="Lable" prop="label">
            <el-input v-model="host.label" clearable></el-input>
          </el-form-item>
          <el-form-item label="Address" prop="address" clearable>
            <el-input v-model="host.address" clearable></el-input>
          </el-form-item>
          <el-form-item label="Port" prop="port">
            <el-input v-model.number="host.port" clearable></el-input>
          </el-form-item>
          <el-form-item label="Passwd" prop="passwd">
            <el-input v-model="host.passwd" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'host',
  data () {
    return {
      drawer: false,
      saveType: 'info',
      fromOperation: 0,
      visible: false,
      host: {},
      rules: {
        address: [
          { required: true, message: 'Please enter the address', trigger: 'blur' }
        ],
        port: [
          { required: true, message: 'Please enter the port' },
          { type: 'number', message: 'The port must be number' }
        ]
      }
    }
  },
  computed: mapState({
    hosts: state => state.host.hosts
  }),
  components: {
  },
  methods: {
    handleClose (done) {
      this.$refs.host.resetFields()
      this.fromOperation = 0
      this.host = {}
      done()
    },
    leftBack () {
      this.$refs.host.resetFields()
      this.fromOperation = 0
      this.host = {}
      this.drawer = false
    },
    submitForm() {
      this.$refs.host.validate((valid) => {
        if (valid) {
          if (this.fromOperation === 0) { // add
            this.$data.hosts.push(Object.assign({ id: Date.now() + '' }, this.$data.host))
          } else { // edit
            for (let i = 0; i < this.hosts.length; i++) {
              if (this.hosts[i].id === this.host.id) {
                this.hosts[i] = Object.assign({}, this.host)
                break
              }
            }
          }
          this.$data.drawer = false
          this.$refs.host.resetFields()
          this.host = {}
        } else {
          return false
        }
      })
      this.fromOperation = 0
    },
    editHost(id) {
      this.fromOperation = 1
      this.drawer = true
      for (let i = 0; i < this.hosts.length; i++) {
        if (this.hosts[i].id === id) {
          this.host = Object.assign({}, this.hosts[i])
          break
        }
      }
    },
    deleteHost(id) {
      const arr = []
      for (let i = 0; i < this.hosts.length; i++) {
        if (this.hosts[i].id !== id) {
          arr.push(this.hosts[i])
        }
      }
      this.hosts = arr
    },
    // 连接host,打开一个页面
    connectionHost(id) {
      for (const h of this.hosts) {
        if (h.id === id) {
          this.$store.commit('host/connectionHost', {
            id: h.id,
            label: h.label,
            time: Date.now(),
            icon: 'el-icon-s-platform',
            isActive: false,
            close: true,
            router: '/hostView'
          })
          break
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.host {
  > .header {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 40px;
    background-color: rgb(208, 218, 226);
  }
  > .body {
    padding: 40px 0;
    .line {
      padding: 0 40px;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .lineLeft {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .lineLeftIcon {
          margin-right: 10px;
          border-radius: 50%;
          height: 40px;
          width: 40px;
          line-height: 40px;
          font-size: 20px;
          color: #fff;
        }
      }
      .lineRight {
        display: flex;
        .lineRightOper {
          margin-left: 10px;
          border-radius: 50%;
          height: 40px;
          width: 40px;
          line-height: 40px;
          font-size: 18px;
          background-color: rgb(208, 218, 226);
        }
        .lineRightOper {
          cursor: pointer;
        }
        .connect:hover {
          color: rgb(4, 209, 4);
        }
        .edit:hover {
          color: #409EFF;
        }
        .delete:hover {
          color: rgb(250, 76, 76);
        }
      }
      .lineRightOper:hover {
        background-color: #1c3046;
      }
    }
    .line:hover {
      background-color: rgb(94, 126, 189);
      color: #fff;
    }
  }
  .addHostHead {
    height: 60px;
    border-bottom: solid 1px #334460;
    background-color: #1c3046;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 25px;
    > div:first-child {
      width: 80%;
      display: flex;
      justify-content: flex-start;
      > .closeLeft:hover {
        background-color: #334460;
        cursor: pointer;
        color: #fff;
      }
      > .closeLeft {
        margin-right: 10px;
        height: 25px;
        width: 25px;
        border-radius: 6px;
        > i {
          font-size: 14px;
          height: 14px;
        }
        display: flex;
        justify-content: center;
        align-items: center;
      }
      > .addTitle {
        line-height: 25px;
      }
    }
    > div:last-child {
      width: 20%;
    }
  }
  .addHostBody {
    margin: 15px;
    background-color: #fff;
    border-radius: 6px;
    padding: 15px;
  }
}
</style>
