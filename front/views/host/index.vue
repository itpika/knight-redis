<template>
  <div class="host">
    <div class="header">
      <el-button type="primary" icon="el-icon-plus"
      @click.stop="addHost" size="mini" round>NEW HOST</el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" round>NEW GROUP</el-button>
    </div>
    <div class="body">
      <div class="line" v-for="(item, index) of host.hosts"  :key="index">
        <div class="lineLeft">
          <div class="lineLeftIcon bgdColor"><i class="el-icon-s-platform"></i></div>
          <span>{{item.label}}</span>
        </div>
        <div class="lineRight">
          <div class="lineRightOper rotating90 connect" @click.stop="connectionHost(item.id)">
            <i class="el-icon-sort"></i>
          </div>
          <div class="lineRightOper edit" @click.stop="editHost(item.id)">
            <i class="el-icon-edit"></i>
          </div>
          <div class="lineRightOper delete" @click.stop="deleteHost(item.id)">
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
      <div class="addHostHead bgdColor">
        <div>
          <div class="closeLeft radio-kgt fontColor">
            <i class="el-icon-back" @click.stop="leftBack"></i>
          </div>
          <div class="addTitle">{{hostDrawerTitle}}</div>
        </div>
        <div>
          <el-button @click.stop="submitForm" type="primary" size="mini" round>SAVE</el-button>
        </div>
      </div>
      <!-- 右侧抽屉主体 -->
      <div class="addHostBody radio-kgt">
        <el-form ref="hostForm" label-position="left" label-width="80px" :model="hostForm" :rules="rules">
          <el-form-item label="Lable" prop="label">
            <el-input v-model="hostForm.label" clearable placeholder="label"></el-input>
          </el-form-item>
          <el-form-item label="Address" prop="address" clearable>
            <el-input v-model="hostForm.address" clearable placeholder="host address"></el-input>
          </el-form-item>
          <el-form-item label="Port" prop="port">
            <el-input v-model.number="hostForm.port" clearable placeholder="port"></el-input>
          </el-form-item>
          <el-form-item label="Passwd" prop="passwd">
            <el-input v-model="hostForm.passwd" clearable placeholder="password"></el-input>
          </el-form-item>
          <el-form-item label="TLS" prop="tls">
            <el-switch v-model="hostForm.tls" active-color="#13ce66" @change="tlsChange"></el-switch>
          </el-form-item>
          <el-form-item v-for="(item, i) in formTlsFile" :key="i" v-show="hostForm.tls" :label="item.name" :prop="item.name">
            <div class="ssl-file">
                <el-tooltip class="item" effect="dark" :content="hostForm[item.name] || item.name" :key="host.hostFormRenderKey[item.name]" placement="top-start">
                  <span :class="host.addHost.fontColor">
                    <span>{{hostForm[item.name] || item.name}}</span>
                    <i @click="resetSelectFile(item.name)" v-show="hostForm[item.name]" class="el-icon-close"></i>
                  </span>
                </el-tooltip>
              <el-button type="success" size="medium" round @click="upFile(item.name)"><i class="el-icon-upload"></i></el-button>
            </div>
          </el-form-item>
          <!-- <el-form-item v-show="hostForm.tls" label="Cert" prop="cert">
            <div class="ssl-file">
                <el-tooltip class="item" effect="dark" :content="hostForm.clientCert || 'clientCert'" :key="host.hostFormRenderKey.clientCert" placement="top-start">
                  <span :class="host.addHost.fontColor">
                    <span>{{hostForm.clientCert || 'clientCert'}}</span>
                    <i v-show="hostForm.clientCert" class="el-icon-close"></i>
                  </span>
                </el-tooltip>
              <el-button type="success" size="medium" round @click="upFile('clientCert')"><i class="el-icon-upload"></i></el-button>
            </div>
          </el-form-item>
          <el-form-item v-show="hostForm.tls" label="Key" prop="key">
            <div class="ssl-file">
              <el-tooltip class="item" effect="dark" :content="hostForm.clientKey || 'clientKey'" :key="host.hostFormRenderKey.clientKey" placement="top-start">
                <span :class="host.addHost.fontColor">
                  <span>{{hostForm.clientKey || 'clientKey'}}</span>
                  <i v-show="hostForm.clientKey" class="el-icon-close"></i>
                </span>
              </el-tooltip>
              <el-button type="success" size="medium" round @click="upFile('clientKey')"><i class="el-icon-upload"></i></el-button>
            </div>
          </el-form-item>
          <el-form-item v-show="hostForm.tls" label="Cacert" prop="cacert">
            <div class="ssl-file">
              <el-tooltip class="item" effect="dark" :content="hostForm.clientCacert || 'clientCacert'" :key="host.hostFormRenderKey.clientCacert" placement="top-start">
                <span :class="host.addHost.fontColor">
                  <span>{{hostForm.clientCacert || 'clientCacert'}}</span>
                  <i v-show="hostForm.clientCacert" class="el-icon-close"></i>
                </span>
              </el-tooltip>
              <el-button type="success" size="medium" round @click="upFile('clientCacert')"><i class="el-icon-upload"></i></el-button>
            </div>
          </el-form-item> -->
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import send from '@/front/lib/channel/send.js'
export default {
  name: 'host',
  data () {
    return {
      drawer: false,
      saveType: 'info',
      fromOperation: 0,
      visible: false,
      hostDrawerTitle: 'addHost',
      rules: {
        address: [
          { required: true, message: 'Please enter the address', trigger: 'blur' }
        ],
        port: [
          { required: true, message: 'Please enter the port' },
          { type: 'number', message: 'The port must be number' }
        ]
      },
      formTlsFile: [
        { name: 'clientCert' },
        { name: 'clientKey' },
        { name: 'clientCacert' }
      ]
    }
  },
  computed: {
    host () {
      return this.$store.state.host
    },
    clientKey () {
      return this.$store.state.host.hostForm.clientKey
    },
    hostForm: {
      get() {
        return this.$store.state.host.hostForm
      },
      set(val) {
        console.log(val)
        this.$store.state.host.hostForm = val
      }
    }
  },
  methods: {
    // 移除选择的文件
    resetSelectFile (name) {
      this.hostForm[name] = ''
    },
    tlsChange (val) {
      if (!val) {
        this.hostForm.clientCert = ''
        this.hostForm.clientKey = ''
        this.hostForm.clientCacert = ''
      }
    },
    // 选择本地文件
    upFile (fileType) {
      send.sendEvent('selectSystemFile', {
        type: fileType
      })
    },
    handleClose (done) {
      this.$refs.hostForm.resetFields()
      this.fromOperation = 0
      this.hostForm = {}
      done()
    },
    leftBack () {
      this.$refs.hostForm.resetFields()
      this.fromOperation = 0
      this.hostForm = {}
      this.drawer = false
    },
    submitForm() {
      this.$refs.hostForm.validate((valid) => {
        if (valid) {
          if (this.hostForm.tls) {
            if (!this.hostForm.clientCacert && !this.hostForm.clientCert && !this.hostForm.clientKey) {
              this.hostForm.tls = false
            }
          }
          if (this.fromOperation === 0) { // add
            this.$store.commit('host/addHost', Object.assign({ id: Date.now() + '' }, this.hostForm))
          } else { // edit
            this.$store.commit('host/editHost', Object.assign({ id: Date.now() + '' }, Object.assign({}, this.hostForm)))
          }
          this.$data.drawer = false
          this.$refs.hostForm.resetFields()
          this.hostForm = {}
        } else {
          return false
        }
      })
      this.fromOperation = 0
    },
    editHost(id) {
      this.fromOperation = 1
      this.drawer = true
      this.hostDrawerTitle = 'editHost'
      for (let i = 0; i < this.host.hosts.length; i++) {
        if (this.host.hosts[i].id === id) {
          this.hostForm = Object.assign({}, this.host.hosts[i])
          break
        }
      }
    },
    deleteHost(id) {
      this.$store.commit('host/deleteHost', id)
    },
    addHost () {
      this.drawer = true
      this.hostDrawerTitle = 'addHost'
    },
    // 连接host,打开一个页面
    connectionHost(id) {
      const host = {
        time: Date.now() + '',
        icon: 'el-icon-coin',
        isActive: false,
        close: true,
        router: 'hostView'
      }
      const conf = {}
      for (const h of this.host.hosts) {
        if (h.id === id) {
          host.id = h.id
          host.label = h.label
          // 配置信息获取
          conf.address = h.address
          conf.port = h.port
          conf.passwd = h.passwd
          // 初始化左侧host栏目显示状态
          this.$store.commit('host/connectionHost', host)
          break
        }
      }
      // 初始化右侧hostView页状态数据
      this.$store.commit('hostView/initHost', { time: host.time, conf, label: host.label })
      // 跳转到hostView详情页
      this.$router.push('/hostView')
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
    background-color: #d0dae2;
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
          background-color: #d0dae2;
        }
        .lineRightOper {
          cursor: pointer;
        }
        .connect:hover {
          color: #04d104;
        }
        .edit:hover {
          color: #409EFF;
        }
        .delete:hover {
          color: #fa4c4c;
        }
      }
      .lineRightOper:hover {
        background-color: #152435;
      }
    }
    .line:hover {
      background-color: rgb(94, 126, 189);
      color: #fff;
    }
  }
  .addHostHead {
    height: 10%;
    border-bottom: solid 1px #334460;
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
    padding: 15px;
    .el-switch {
      position: absolute;
      left: 0;
      transform: translateY(50%);
    }
    div.ssl-file {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        width: 100%;
        padding-right: 10px;
        align-items: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: flex;
        justify-content: space-between;
        i {
          &:hover {
            color: red;
          }
        }
      }
    }
  }
}
</style>
