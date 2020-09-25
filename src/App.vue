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

import Vue from 'vue'
import VueMoment from 'vue-moment'

import store from './store'
import router from './router'
import Header from './components/Header.vue'

// import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
// Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons)

Vue.use(VueMoment)

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
