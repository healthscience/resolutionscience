import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import AsyncComputed from 'vue-async-computed'
import 'chart.js'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* if (process.env.NODE_ENV !== 'production') {
  require('vue-devtools').install()
} */
Vue.use(AsyncComputed)
export const kBus = new Vue()
export const sBus = new Vue()

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
