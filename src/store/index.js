import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: ""
  },
  mutations: { // commit
    updateState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
  },
  actions: { // dispatch
    setUserInfo({ commit }, payload) {
      commit('updateState', { userInfo: payload })
    },
  },
  modules: {
  }
})
