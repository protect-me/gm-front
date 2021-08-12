<template>
  <v-card>
    <v-card-title> {{ recordsGroup.routineGroupName }} </v-card-title>
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
    <v-card-text>
      <v-card flat v-for="(exercise, i) in exercises" :key="i">
        <v-card-title>{{ exercise.name }} </v-card-title>
        <v-card-text
          v-for="(oneOfSet, j) in exercise.dataOfSet"
          :key="j"
          class="py-0"
        >
          {{ oneOfSet.countOfSet }} - {{ oneOfSet.plusWeight }} -
          {{ oneOfSet.lap }}
        </v-card-text>
      </v-card>
      <!-- {{ exercises }} -->
      {{ recordsGroup }}
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
        if (index == 0) {
          // First Set
          newExercise.exerciseUuid = oneOfSet.exerciseUuid;
          newExercise.name = oneOfSet.name;
          newExercise.category = oneOfSet.category;
          newExercise.target = oneOfSet.target;
          newExercise.note = oneOfSet.note;
          newExercise.admin = oneOfSet.admin;
          newExercise.dataOfSet.push(oneOfSet);
          if (this.exercises.length == 1) {
            // length가 1일 경우 push
            this.exercises.push(newExercise); // push
          }
        } else {
          // etc Set
          if (newExercise.countOfExercise == oneOfSet.countOfExercise) {
            // 앞의 count와 같을 경우
            newExercise.dataOfSet.push(oneOfSet);
          } else {
            // 앞의 count와 다를 경우 => push && init
            this.exercises.push(newExercise); // push
            newExercise = Object.assign({}, initExercise); // init
            newExercise.exerciseUuid = oneOfSet.exerciseUuid;
            newExercise.name = oneOfSet.name;
            newExercise.category = oneOfSet.category;
            newExercise.target = oneOfSet.target;
            newExercise.note = oneOfSet.note;
            newExercise.admin = oneOfSet.admin;
            newExercise.dataOfSet.push(oneOfSet);
          }
        }
        if (index == this.recordsGroup.exercises.length - 1) {
          // Last Set
          this.exercises.push(newExercise); // push
        }
      });
      console.log(this.exercises);
    },
  },
};
</script>

<style>
</style>