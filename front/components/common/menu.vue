<template>
  <div class="box" @click.stop="showMenu" @mouseenter="mouseenter">
    <div :class="['name', {'menu-click': app.currentMenu === menuName}]">{{menuName}}</div>
    <ul @mouseenter.stop :class="['menu-list', 'hiddenClass', {'visibleClass': app.currentMenu === menuName}]" :style="'width:'+width">
      <li>aa</li>
      <li>bb</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    menuName: String,
    width: {
      type: String,
      default: () => '150px'
    }
  },
  data() {
    return {
    }
  },
  methods: {
    showMenu() {
      this.$store.commit('app/clickShowMenu', this.menuName)
    },
    mouseenter() {
      console.log(1)
      if (this.app.clickMenu) {
        this.$store.commit('app/hoverShowMenu', this.menuName)
      }
    }
  },
  computed: {
    app() {
      return this.$store.state.app
    }
  },
  created() {
    this.$store.commit('app/addMenu', { name: this.menuName, show: 0 })
  }
}
</script>
<style lang="less" scoped>
.menu-click {
  background-color: rgb(56, 70, 83);
  color: #dad9d9;
}
.box {
  .name {
    user-select: none;
    height: 100%;
    font-size: 13px;
    width: 50px;
    display: flex;
    color: #cccccc;
    justify-content: center;
    align-items: center;
    -webkit-app-region: no-drag;
    &:hover {
      background-color: rgb(56, 70, 83);
      color: #dad9d9;
      cursor: default;
    }
  }
  position: relative;
  > ul {
    z-index: 99999999999;
    position: absolute;
    // bottom: 0;
    transform: translateY(0);
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: #2e3336;
    box-shadow: 0.5px 2px 4px rgb(0, 0, 0);
    > li {
      &:hover {
        background-color: #1d3a55;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
