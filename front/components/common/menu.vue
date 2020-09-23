<template>
  <div class="box" @click.stop="showMenu" @mouseenter="mouseenter">
    <div :class="['name', {'menu-click': app.currentMenu === menu.name}]">{{menu.name}}</div>
    <ul @mouseenter.stop :class="['menu-list', 'hiddenClass', {'visibleClass': app.currentMenu === menu.name}]" :style="'width:'+width">
      <li v-for="(item, i) in menu.child" :key="i" @click.stop="menuItemClick(item.click)">
        {{item.name}}
        <div v-if="item.icon" class="icon">
          <el-image
          style="width: 15px; height: 100%"
          :src="require(`@/public/image/${item.icon}`)"
          fit="fit"></el-image>
        </div>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    menu: Object,
    width: {
      type: String,
      default: () => '200px'
    }
  },
  data() {
    return {
    }
  },
  methods: {
    showMenu() {
      this.$store.commit('app/clickShowMenu', this.menu.name)
    },
    mouseenter() {
      if (this.app.clickMenu) {
        this.$store.commit('app/hoverShowMenu', this.menu.name)
      }
    },
    menuItemClick(func) {
      func()
      this.$store.commit('app/resetMenu')
    }
  },
  computed: {
    app() {
      return this.$store.state.app
    }
  },
  created() {
    this.$store.commit('app/addMenu', { name: this.menu.name, show: 0 })
  }
}
</script>
<style lang="less" scoped>
.box {
  .name {
    user-select: none;
    height: 100%;
    font-size: 13px;
    width: 50px;
    display: flex;
    color: #a9a9a9;
    justify-content: center;
    align-items: center;
    -webkit-app-region: no-drag;
    &:hover {
      background-color: rgb(56, 70, 83);
      color: #dbdada;
      cursor: default;
    }
  }
  .menu-click {
    background-color: rgb(56, 70, 83);
    color: #dbdada;
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
    > :first-child {
      margin-top: 5px;
    }
    > li {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      align-items: center;
      height: 25px;
      padding: 2px 10px;
      color: rgb(219, 218, 218);
      box-sizing: border-box;
      margin-bottom: 5px;
      &:hover {
        background-color: #1d3a55;
        cursor: pointer;
        color: #fff;
      }
      .icon {
        div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
