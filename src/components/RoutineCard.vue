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

      <v-menu offset-y left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            min-width="40px"
            class="pa-0"
            v-bind="attrs"
            v-on="on"
            :disabled="$store.state.isExistWorkoutBottomSheet"
          >
            <v-icon> mdi-dots-horizontal </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="workoutUpdate">
            <v-icon color="error">mdi-pencil</v-icon>
          </v-list-item>
          <v-list-item
            @click="$emit('deleteRoutine', routineGroup.routineGroupUuid)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle class="pb-0 px-2">
      <div>총 {{ totalCountOfExercise }} 운동 · {{ totalCountOfSet }} 세트</div>
    </v-card-subtitle>
    <v-card-actions class="pb-0">
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        x-large
        @click="workoutStart"
        :disabled="$store.state.isExistWorkoutBottomSheet"
      >
        <span class="mr-2">START</span>
        <v-icon>mdi-arrow-right-circle-outline </v-icon>
      </v-btn>
    </v-card-actions>
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
      const lastIndex = this.routineGroup.exercises.length - 1;
      return this.routineGroup.exercises[lastIndex].countOfExercise;
    },
    totalCountOfSet() {
      return this.routineGroup.exercises.length;
    },
  },
  methods: {
    workoutStart() {
      this.$store.dispatch("createWorkoutBottomSheet", "record");
      this.$store.dispatch("showWorkoutBottomSheet");
      this.$store.dispatch("setRoutine", this.routineGroup);
    },
    workoutUpdate() {
      this.$store.dispatch("createWorkoutBottomSheet", "update");
      this.$store.dispatch("showWorkoutBottomSheet");
      this.$store.dispatch("setRoutine", this.routineGroup);
    },
  },
};
</script>

<style>
</style>