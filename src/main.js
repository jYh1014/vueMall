// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import store from '../src/store/index'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
Vue.use(infiniteScroll)
Vue.filter('currency',currency)
Vue.config.productionTip = false
Vue.use(vueLazyLoad,{
  loading:'../static/loading-svg'
})
const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识
  messages: {
      'zh-CN': require('./lang/zh'),   // 中文语言包
      'en-US': require('./lang/en')    // 英文语言包
  },
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
