import Vue from 'vue'
import Vuex from 'vuex'
import toast from "./toast"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: "admin",
    userUuid: "60ec2dda-ef8c-11eb-854b-65b767dc1df8",
    exercises: [],
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
    },
    setExercises(state, payload) {
      state.exercises.push(...payload)
    },
    setExercise(state, { value, key }) {
      state.exercises[key] = value
    },
    setDataOfSet(state, payload) {
      const { refreshData, key } = payload
      state.exercises[key].dataOfSet = refreshData
    },
    updateDataOfSet(state, payload) {
      // const { refreshData, key } = payload
      // state.exercises[key].dataOfSet = refreshData
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
    },
    setExercises({ commit }, payload) {
      commit('setExercises', payload)
    },
    setExercise({ commit }, payload) {
      commit('setExercise', payload)
    },
    setDataOfSet({ commit }, payload) {
      commit('setDataOfSet', payload)
    },
    updateDataOfSet({ commit }, payload) {
      commit('setDataOfSet', payload)
    },
  },
  modules: {
    toast
  }
})
