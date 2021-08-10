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
      {{ this.$moment(recordsGroup.startTime).format("YYYY.MM.DD dddd HH:MM") }}
    </v-card-subtitle>
    <v-card-subtitle class="pt-0 pb-0">
      {{ duration }}
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
    duration() {
      const startTime = this.$moment(this.recordsGroup.startTime);
      const endTime = this.$moment(this.recordsGroup.endTime);
      const diff = endTime.diff(startTime, "minutes");
      const displayHH = Math.floor(diff / 60);
      const displayMM = diff % 60;

      return displayHH == 0
        ? `${displayMM}분`
        : `${displayHH}시간 ${displayMM}분`;
    },
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