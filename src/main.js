import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

var TogglClient = require("toggl-api");
Vue.prototype.$toggl = new TogglClient({
  apiToken: process.env.VUE_APP_TOGGL_API
});


const init = async () => {
  const module = await import('./router')
  const router = await module.default
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
};

init()