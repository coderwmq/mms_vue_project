import Vue from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store";
// 引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
Vue.config.productionTip = false;

// 引入权限拦截
import './permission'


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
