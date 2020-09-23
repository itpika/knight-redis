import send from '../../lib/channel/send.js'
export default {
  namespaced: true,
  state: {
    mainClass: 'main_bgd_color',
    winMax: false,
    menus: [], // 菜单栏
    currentMenu: '', // 当前显示的菜单栏
    clickMenu: false, // 是否单击了菜单栏的某一项
    headMenuMouse: false // 光标是否在菜单栏上
  },
  mutations: {
    setMainClass(state, Class) {
      state.mainClass = Class
    },
    addMenu(state, item) {
      state.menus.push(item)
    },
    clickShowMenu(state, name) {
      for (const item of state.menus) {
        if (item.name === name) {
          if (state.currentMenu === name) {
            state.currentMenu = ''
            state.clickMenu = false
          } else {
            state.currentMenu = name
            state.clickMenu = true
          }
          break
        }
      }
    },
    hoverShowMenu(state, name) {
      for (const item of state.menus) {
        if (item.name === name) {
          state.currentMenu = name
          break
        }
      }
    },
    resetMenu(state) {
      state.currentMenu = ''
      state.clickMenu = false
    },
    openDevelopTool() { // 打开开发者工具
      send.openDevelopTool()
    },
    openBrowserUri(state, uri) { // 打开浏览器访问一个地址
      send.openBrowserUri(uri)
    }
  },
  actions: {
  },
  modules: {
  }
}
