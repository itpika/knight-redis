<template>
  <div class="button">
    <button :class="[size, type]" >{{val}}</button>
  </div>
</template>
<script>
export default {
  props: {
    val: String,
    size: String,
    type: String
  }
}
</script>
<style lang="less" scoped>
.button {
  > button {
    color: #fff;
    border: 0;
    border-radius: 5px;
    cursor: pointer;
    padding: 10px;
    box-sizing: border-box;
  }
}
.nomal {
  min-width: 80px;
  height: 40px;
}
.info {
  background-color: #909399;
  &:hover {
    background-color: #a2a7b0;
  }
}
.success {
  background-color: #03c974;
  &:hover {
    background-color: #03d77b;
  }
}
</style>
