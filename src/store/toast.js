export default {
  state: {
    msg: "hello",
    color: "",
    act: false,
    timeout: 2000,
  },
  getters: {
  },
  mutations: { // commit
    popToast(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
      state.act = true
    },
    closeToast(state) {
      state.act = false
    }
  },
  actions: { // dispatch
    popToast({ commit }, payload) {
      if (!payload.msg) return
      if (!payload.color) payload.color = ""
      if (!payload.timeout) payload.timeout = 2000
      commit("popToast", payload);
    },
    closeToast({ commit }) {
      commit("closeToast");
    }
  },
}

// 사용 예제
// this.$store.dispatch("popToast", {
//   msg: "테스트",
//   color: "error",
//   timeout: 3000,
// });

// this.$store.dispatch("popToast", { msg: whatwhat, color: "primary" });
// this.$store.dispatch("popToast", { msg: whatwhat, color: "error" });

