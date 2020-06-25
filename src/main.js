import 'babel-polyfill' //It is important to include the plugin as early as possible within your main index.js file.
import Vue from 'vue'
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import "awesome-notifications/dist/style.css"
import App from './App.vue'
import router from './routers'
import Router from 'vue-router'


Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.config.productionTip = false;
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app');
