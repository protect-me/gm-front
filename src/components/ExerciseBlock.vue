<template>
  <v-card>
    <v-card-title>
      {{ exercise.name }}
    </v-card-title>
    <v-card-subtitle align="left"> hell </v-card-subtitle>
    <v-card-text align="left"> hellhell </v-card-text>
    <!-- <v-container>
              <v-row>
                <v-col cols="12"></v-col>
              </v-row>
            </v-container> -->
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