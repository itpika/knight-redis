import Vue from 'vue'
// import Element from 'element-ui'
import {
  Button,
  Transfer,
  Form,
  FormItem,
  Select,
  Dialog,
  Input,
  InputNumber,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Drawer,
  Tooltip,
  Option,
  Loading,
  Switch,
  Message,
  Image
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// Vue.use(Element)
Vue.use(Image)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Loading)
Vue.use(Option)
Vue.use(Input)
Vue.use(Tooltip)
Vue.use(InputNumber)
Vue.use(Drawer)
Vue.use(Transfer)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Dialog)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.prototype.$message = Message
