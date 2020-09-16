<template>
  <!-- 对话框 -->
  <div :class="['dialog', {hiddenClass: !show}]">
    <div :class="['header', type]">
      <p>{{label}}</p>
      <i class="el-icon-close"></i>
    </div>
    <div class="body">{{text}}</div>
    <div class="bottom">
      <kbutton size="nomal" :val="leftOpertion" :type="leftType" @click.native.stop="leftClick"/>
      <kbutton size="nomal" :val="rightOpertion" :type="rightType" @click.native.stop="rightClick"/>
    </div>
  </div>
</template>

<script>
import kbutton from '@/front/components/common/k-button.vue'
export default {
  props: {
    label: String, // 对话框标题
    text: String, // 对话框内容
    leftOpertion: String, // 左边按钮内容
    rightOpertion: String, // 右边按钮内容
    leftType: { // 左边按钮类型
      type: String,
      default: function () {
        return 'info'
      }
    },
    rightType: { // 右边按钮类型
      type: String,
      default: function () {
        return 'success'
      }
    },
    show: {
      type: Boolean,
      default: function () {
        return true
      }
    }, // 是否显示
    type: { // 弹窗类型，info，warning
      type: String,
      default: function () {
        return 'info'
      }
    }
  },
  components: {
    kbutton
  },
  methods: {
    leftClick () {
      this.$emit('leftCallback')
    },
    rightClick () {
      this.$emit('rightCallback')
    }
  }
}
</script>

<style lang="less" scoped>
.dialog {
  box-sizing: border-box;
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
    width: 100%;
    color: #fff;
    font-size: 17px;
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
.warning {
  background-color: #ff6262;
}
.info {
  background-color: #03c974;
}
.public {
  background-color: #152435;
}
</style>
