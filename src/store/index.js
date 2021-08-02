import Vue from 'vue'
import Vuex from 'vuex'
import toast from "./toast"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: "admin",
    userUuid: "",
    exercises: []
  },
  mutations: { // commit
    updateState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetUserInfo(state) {
      state.userId = ""
      state.userUuid = ""
    }
  },
  actions: { // dispatch
    setUserInfo({ commit }, payload) {
      commit('updateState', {
        userId: payload.userId,
        userUuid: payload.userUuid
      })
    },
    resetUserInfo({ commit }) {
      commit('resetUserInfo')
    }
  },
  modules: {
    toast
  }
})
