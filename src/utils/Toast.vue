<template>
  <v-snackbar
    :color="$store.state.toast.color"
    v-model="$store.state.toast.act"
    :timeout="$store.state.toast.timeout"
  >
    {{ $store.state.toast.msg }}
    <v-btn text @click="closeToast"> 닫기 </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  methods: {
    closeToast() {
      this.$store.dispatch("closeToast");
    },
  },
};
</script>

<style>
</style>