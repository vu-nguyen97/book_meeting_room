<template>
  <v-app id="app">
    <Header />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import RoomList from './components/RoomList.vue'
import Header from './components/Header.vue'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueMoment from 'vue-moment'

// import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
// Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons)

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMoment)

const store = new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    login(state, user) {
      state.user = user
    },
    logout(state) {
      state.user = null
    }
  }
})

const routes = [
  { name: 'home', path: '/home', component: Home },
  { name: 'room-list', path: '/room-list', component: RoomList },
  { name: 'room-list', path: '/room-list/meeting/:meeting_id', component: RoomList },
  { name: 'login', path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !store.state.user) next({ name: 'login' })
  else next()
})

export default {
  name: 'App',
  store,
  router,
  components: {
    Header
  },
}
</script>

<style lang="scss">
  @import './scss/index.scss';
</style>
