<template>
  <v-card>
    <v-card-title>
      {{ recordsGroup.routineGroupName }}
      <v-spacer></v-spacer>
      <v-btn
        text
        color="error"
        class="pa-0"
        min-width="40px"
        @click="closeRecordDetail"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle
      class="pt-1"
      style="display: flex; justify-content: space-between"
    >
      <div class="startTime">
        {{
          this.$moment(recordsGroup.startTime).format("YYYY.MM.DD (dd) HH:MM")
        }}
      </div>
      <div class="duration">
        <v-icon small>mdi-timer-outline</v-icon> {{ duration }}
      </div>
    </v-card-subtitle>
    <v-card-text class="pb-0">
      <v-divider></v-divider>
    </v-card-text>
    <v-card-text>
      <v-card flat v-for="(exercise, i) in exercises" :key="i">
        <v-card-title class="px-0 pb-1 subtitle-1 font-weight-bold">
          <v-chip class="mr-2" color="primary" outlined small>
            {{ exercise.target }} | {{ exercise.category }}
          </v-chip>
        </v-card-title>
        <v-card-title
          class="pt-0 px-0 subtitle-1 font-weight-bold"
          :class="{ 'pb-0': !exercise.note }"
        >
          <span>
            {{ exercise.name }}
          </span>
        </v-card-title>
        <v-card-subtitle class="px-0 pb-0" align="left" v-if="exercise.note">
          <span>
            {{ exercise.note }}
          </span>
        </v-card-subtitle>
        <v-card-text
          v-for="(oneOfSet, j) in exercise.dataOfSet"
          :key="j"
          class="py-0 px-0"
        >
          <span class="count-of-set pr-2">{{ oneOfSet.countOfSet }}</span>
          <span class="info-of-set">{{ displaySet(oneOfSet) }}</span>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["recordsGroup"],
  data() {
    return {
      exercises: [],
    };
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
  },
  mounted() {
    this.initExercisesData();
  },
  methods: {
    closeRecordDetail() {
      console.log("here");
      this.$emit("closeRecordDetail");
    },
    initExercisesData() {
      let initExercise = {
        countOfExercise: 0,
        exerciseUuid: "",
        name: "",
        category: "",
        target: "",
        note: "",
        admin: "",
        dataOfSet: [],
      };
      let newExercise = {
        countOfExercise: 0,
        exerciseUuid: "",
        name: "",
        category: "",
        target: "",
        note: "",
        admin: "",
        dataOfSet: [],
      };
      this.recordsGroup.exercises.forEach((oneOfSet, index) => {
        if (newExercise.countOfExercise !== oneOfSet.countOfExercise) {
          if (newExercise.countOfExercise !== 0) {
            this.exercises.push(newExercise);
            newExercise = Object.assign({}, initExercise);
            newExercise.dataOfSet = []; // Object.assign으로 deep clone이 안되기 때문
          }
          newExercise.countOfExercise = oneOfSet.countOfExercise;
          newExercise.countOfExercise = oneOfSet.countOfExercise;
          newExercise.exerciseUuid = oneOfSet.exerciseUuid;
          newExercise.name = oneOfSet.name;
          newExercise.category = oneOfSet.category;
          newExercise.target = oneOfSet.target;
          newExercise.note = oneOfSet.note;
          newExercise.admin = oneOfSet.admin;
          newExercise.status = oneOfSet.status;
          newExercise.dataOfSet.push(oneOfSet);
        } else {
          newExercise.dataOfSet.push(oneOfSet);
        }
        if (index === this.recordsGroup.exercises.length - 1) {
          this.exercises.push(newExercise);
        }
      });
    },
    displaySet(oneOfSet) {
      let text = "";
      if (oneOfSet.plusWeight) text += ` ${oneOfSet.plusWeight}kg`;
      if (oneOfSet.minusWeight) text += ` -${oneOfSet.minusWeight}kg`;
      if (oneOfSet.lap) text += ` x ${oneOfSet.lap}`;
      if (oneOfSet.timeMin) text += ` ${oneOfSet.timeMin}: ${oneOfSet.timeSec}`;
      if (oneOfSet.status == 2) text += ` (F)`;
      return text;
    },
  },
};
</script>

<style>
</style>