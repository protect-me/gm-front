<template>
  <v-card>
    <v-card-title>
      {{ exercise.name }}
    </v-card-title>
    <v-card-subtitle align="left"> hell </v-card-subtitle>
    <v-card-text align="left"> hellhell </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    exercise: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style>
</style>