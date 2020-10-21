import axios from 'axios'
import store from './store'
import router from './router'

const api = axios.create({
  baseURL: process.env.VUE_APP_HOST_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.defaults.timeout = 10000

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
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
        case 400:
          {
            const message = error.response.data.message || error.response.data[0].message
            if (message) {
              store.dispatch('setAlertAsync', message)
            }
          }
          break;

        case 401:
          {
            localStorage.removeItem('access_token')
            alert("session expired");
            store.dispatch('logoutAsync')
            router.push({
              path: '/login'
            })
          }
          break;

        case 404:
          alert('page not exist');
          break;
      }
      // return Promise.reject(error.response);
    }
  }
);

export default api