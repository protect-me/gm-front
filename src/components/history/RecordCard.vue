<template>
  <v-card>
    <!-- class="pt-2 px-2" -->
    <v-card-title style="display: flex; width: 100%; flex-wrap: nowrap">
      <div
        class="mr-2"
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        {{ recordsGroup.routineGroupName }}
      </div>
      <v-spacer></v-spacer>
      <v-btn text min-width="40px" class="pa-0">
        <v-icon> mdi-dots-horizontal </v-icon>
      </v-btn>
    </v-card-title>
    <!-- class="pb-0 px-2" -->
    <v-card-subtitle class="pb-0">
      <!-- <DisplayTime :time="recordsGroup.startTime"></DisplayTime>
      <DisplayTime :time="recordsGroup.endTime"></DisplayTime> -->

      <!-- <div>{{ recordsGroup.startTime }}</div>
      <div>{{ this.$moment(recordsGroup.startTime).toDate() }}</div>
      <div>
        {{ this.$moment(recordsGroup.startTime).toDate().toLocaleDateString() }}
      </div> -->
      <div>
        {{ this.$moment(recordsGroup.startTime).format("YYYY.MM.DD. dddd") }}
      </div>
    </v-card-subtitle>
    <v-card-subtitle class="pt-0">
      <div>총 {{ totalCountOfExercise }} 운동 · {{ totalCountOfSet }} 세트</div>
    </v-card-subtitle>
    <!-- <v-card-actions class="pb-0">
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
    </v-card-actions> -->
    <!-- <v-card-subtitle> </v-card-subtitle> -->
    <!-- <v-card-title>{{ routineGroup.routineGroupUuid }}</v-card-title> -->
  </v-card>
</template>

<script>
import DisplayTime from "@/components/DisplayTime";

export default {
  components: {
    DisplayTime,
  },
  props: {
    recordsGroup: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    totalCountOfExercise() {
      const lastIndex = this.recordsGroup.exercises.length - 1;
      return this.recordsGroup.exercises[lastIndex].countOfExercise;
    },
    totalCountOfSet() {
      return this.recordsGroup.exercises.length;
    },
  },
  methods: {
    // workoutStart() {
    //   console.log("workout!!!");
    //   this.$store.dispatch("createWorkoutBottomSheet", "record");
    //   this.$store.dispatch("showWorkoutBottomSheet");
    //   this.$store.dispatch("setRoutine", this.routineGroup);
    // },
  },
};
</script>

<style>
</style>