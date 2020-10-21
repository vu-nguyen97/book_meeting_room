import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    alert: null,
    typeAlert: 'error'
  },
  mutations: {
    login(state, user) {
      state.user = user
    },
    logout(state) {
      state.user = null
    },
    setAlert(state, alert) {
      const isAlertObj = (typeof alert === 'string') ? false : true
      state.alert = isAlertObj ? alert.message : alert
      state.typeAlert = isAlertObj ? alert.type : 'error'

      setTimeout(() => {
        state.alert = null
      }, 3000);
    }
  },
  actions: {
    logoutAsync({commit}) {
      commit('logout');
    },
    setAlertAsync({commit}, payload) {
      commit('setAlert', payload);
    },
  }
})