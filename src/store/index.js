import Vue from 'vue'
import Vuex from 'vuex'
import toast from "./toast"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: "admin", // admin test
    userUuid: "60ec2dda-ef8c-11eb-854b-65b767dc1df8", // admin test
    isShowWorkoutBottomSheet: false,
    isExistWorkoutBottomSheet: false,
    workoutBottomSheetMode: 'create', // create | record | update
    routineGroup: {}
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
    showWorkoutBottomSheet(state) {
      state.isShowWorkoutBottomSheet = true
    },
    hideWorkoutBottomSheet(state) {
      state.isShowWorkoutBottomSheet = false
    },
    createWorkoutBottomSheet(state, payload) {
      state.isExistWorkoutBottomSheet = true
      state.workoutBottomSheetMode = payload // create | record | update
    },
    removeWorkoutBottomSheet(state) {
      state.isExistWorkoutBottomSheet = false
    },
    setRoutine(state, payload) {
      state.routineGroup = payload
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
    showWorkoutBottomSheet({ commit }) {
      commit('showWorkoutBottomSheet')
    },
    hideWorkoutBottomSheet({ commit }) {
      commit('hideWorkoutBottomSheet')
    },
    createWorkoutBottomSheet({ commit }, payload) {
      commit('createWorkoutBottomSheet', payload)
    },
    removeWorkoutBottomSheet({ commit }) {
      commit('removeWorkoutBottomSheet')
    },
    setRoutine({ commit }, payload) {
      commit('setRoutine', payload)
    },
  },
  modules: {
    toast
  }
})
