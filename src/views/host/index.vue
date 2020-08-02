<template>
  <div class="host">
    <div class="header">
      <el-button type="primary" icon="el-icon-plus"
      @click="drawer = true" size="mini" round>NEW HOST</el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" round>NEW GROUP</el-button>
    </div>
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
            <i class="el-icon-back" @click="drawer = false"></i>
          </div>
          <div class="addTitle">addHost</div>
        </div>
        <div>
          <el-button @click="submitForm('host')" type="success" size="mini" round>SAVE</el-button>
        </div>
      </div>
      <!-- 右侧抽屉主体 -->
      <div class="addHostBody">
        <el-form ref="host" label-position="left" label-width="80px" :model="host" :rules="rules">
          <el-form-item label="Lable" prop="name">
            <el-input v-model="host.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="Address" prop="address" clearable>
            <el-input v-model="host.address" clearable></el-input>
          </el-form-item>
          <el-form-item label="Port" prop="port">
            <el-input v-model.number="host.port" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// import Header from '@/components/Header.vue'

export default {
  name: 'host',
  data () {
    return {
      drawer: false,
      saveType: 'info',
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
  components: {
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.$data.host)
          this.$data.drawer = false
        } else {
          return false
        }
      })
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
    background-color: rgb(180, 200, 216);
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
