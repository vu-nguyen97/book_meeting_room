import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './components/Login.vue'
import Home from './components/Home.vue'
import RoomList from './components/RoomList.vue'

Vue.use(VueRouter)

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
  const token = localStorage.getItem("access_token");
  if (to.name !== 'login' && !token) next({ name: 'login' })
  else next()
})

export default router