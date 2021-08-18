<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <span v-on="on">{{ displayTime }}</span>
    </template>
    <span>{{ time.toLocaleString() }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ["time"],
  computed: {
    displayTime() {
      const createdTime = this.$moment(this.time);
      const curruentTime = this.$moment();
      const diff = curruentTime.diff(createdTime, "days");
      if (diff > 0) return createdTime.toDate().toLocaleDateString();
      return createdTime.fromNow();
    },
  },
};
</script>

<style></style>
