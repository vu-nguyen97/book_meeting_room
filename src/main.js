import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import api from './api'

Vue.config.productionTip = false
Vue.prototype.$appName = 'Book meeting'
Vue.prototype.$http = api;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
