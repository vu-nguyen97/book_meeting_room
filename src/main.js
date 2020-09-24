import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import api from './api'

Vue.config.productionTip = false
Vue.prototype.$appName = 'Book meeting'

Vue.prototype.$http = api;
api.defaults.timeout = 10000

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          alert("session expired");
          //xoa data global, redirect login
          break;

        case 404:
          alert('page not exist');
          break;
      }
      return Promise.reject(error.response);
    }
  }
);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
