<template>
  <!-- 右侧From表单弹出抽屉 -->
  <el-drawer
    custom-class="pageColor"
    :visible.sync="drawer"
    direction="rtl"
    :with-header="false"
    :before-close="handleClose">
    <!-- 右侧抽屉头部 -->
    <div class="addValueHead bgdColor">
      <div>
        <div class="closeLeft radio-kgt fontColor">
          <i class="el-icon-back" @click.stop="leftBack"></i>
        </div>
        <div class="addTitle">addValue</div>
      </div>
      <div>
        <el-button @click.stop="submitForm" type="primary" size="mini" round>SAVE</el-button>
      </div>
    </div>
    <!-- 右侧抽屉主体 -->
    <div class="addValueBody radio-kgt">
      <el-form ref="row" label-position="left" label-width="80px" :model="row" :rules="rules">
        <el-form-item v-show="secondaryKey" label="key" prop="key">
          <el-input v-model="row.key" clearable placeholder="key"></el-input>
        </el-form-item>
        <el-form-item v-show="secondaryScore" label="score" prop="score">
          <el-input v-model.number="row.score" clearable placeholder="score"></el-input>
        </el-form-item>
        <el-form-item label="value" prop="value" clearable>
          <el-input type="textarea" v-model="row.value" clearable placeholder="value"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import { LIST, HASH, SET, ZSET } from '../../../../lib/redis/singal'
export default {
  name: 'KeyNewValue',
  props: {
    drawer: Boolean
  },
  data() {
    return {
      row: {
        key: '',
        value: ''
      },
      rules: {
        value: [
          { required: true, message: 'Please enter the value', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    current() {
      return this.$store.state.hostView.current
    },
    secondaryKey() {
      return this.current.keyDetail.type === HASH.upName
    },
    secondaryScore() {
      return this.current.keyDetail.type === ZSET.upName
    },
    secondary() {
      switch (this.current.keyDetail.type) {
        case HASH.upName:
          break
        case ZSET.upName:
          break
        default:
          return false
      }
      return true
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeNewValueDrawer')
    },
    leftBack() {
      this.$emit('closeNewValueDrawer')
    },
    submitForm() {
      if (this.secondaryKey) {
        delete this.$data.rules.score
        this.$data.rules.key = [
          { required: true, message: 'Please enter the key', trigger: 'blur' }
        ]
      }
      if (this.secondaryScore) {
        delete this.$data.rules.key
        this.$data.rules.score = [
          { required: true, message: 'Please enter the score' },
          { type: 'number', message: 'The score must be number' }
        ]
      }
      this.$refs.row.validate((valid) => {
        if (valid) {
          this.$store.commit('saveKey/addRow', {
            time: this.current.time,
            key: this.current.keyDetail.keyName,
            index: this.current.selectDB,
            type: this.current.keyDetail.type,
            realTime: this.current.realTime,
            data: this.row
          })
          
          if (this.current.realTime !== '1') {
            switch (this.current.keyDetail.type) {
              case LIST.upName:
                console.log('1', this.current.keyDetail.value)
                this.current.keyDetail.value.push(this.row.value)
                console.log('2', this.current.keyDetail.value)
                break
              case SET.upName:
                this.current.keyDetail.value.push(this.row.value)
                break
              case HASH.upName:
                this.current.keyDetail.value.push(this.row.value)
                break
              case ZSET.upName:
                this.current.keyDetail.value.push(this.row.value)
                break
              default:
                break
            }
          }
          this.handleClose()
          this.$refs.row.resetFields()
          this.row = {}
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.addValueHead {
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
.addValueBody {
  margin: 15px;
  background-color: #fff;
  padding: 15px;
}
</style>
