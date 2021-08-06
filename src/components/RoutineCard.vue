<template>
  <v-card>
    <v-card-title
      class="pt-2 px-2"
      style="display: flex; width: 100%; flex-wrap: nowrap"
    >
      <div
        class="mr-2"
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        {{ routineGroup.routineGroupName }}
      </div>
      <v-spacer></v-spacer>
      <v-btn text min-width="40px" class="pa-0">
        <v-icon> mdi-dots-horizontal </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle class="pb-0 px-2">
      <div>총 {{ totalCountOfExercise }} 운동 · {{ totalCountOfSet }} 세트</div>
    </v-card-subtitle>
    <v-card-actions class="pb-0">
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text x-large @click="workoutStart">
        <span class="mr-2">START</span>
        <v-icon>mdi-arrow-right-circle-outline </v-icon>
      </v-btn>
    </v-card-actions>
    <!-- <v-card-subtitle> </v-card-subtitle> -->
    <!-- <v-card-title>{{ routineGroup.routineGroupUuid }}</v-card-title> -->
  </v-card>
</template>

<script>
export default {
  props: {
    routineGroup: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    totalCountOfExercise() {
      const lastIndex = this.routineGroup.dataOfSet.length - 1;
      return this.routineGroup.dataOfSet[lastIndex].countOfExercise;
    },
    totalCountOfSet() {
      return this.routineGroup.dataOfSet.length;
    },
  },
  methods: {
    workoutStart() {
      console.log("workout!!!");
      this.$store.dispatch("createWorkoutBottomSheet", "record");
      this.$store.dispatch("showWorkoutBottomSheet");
    },
  },
};
</script>

<style>
</style>