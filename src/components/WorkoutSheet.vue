<template>
  <div class="text-center">
    <v-btn
      color="primary"
      @click="openBottomSheet"
      :disabled="
        !isExistWorkoutBottomSheet || workoutBottomSheetMode == 'create'
      "
    >
      Workout
    </v-btn>

    <v-bottom-sheet
      v-if="isExistWorkoutBottomSheet"
      v-model="isShowWorkoutBottomSheet"
      scrollable
      persistent
      fullscreen
      hide-overlay
    >
      <v-sheet class="text-center">
        <v-card>
          <v-card-title v-if="workoutBottomSheetMode == 'create'">
            <v-btn
              text
              color="error"
              class="pa-0"
              min-width="40px"
              @click="eraseWorkoutSheet"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-spacer></v-spacer>
            <v-divider class="mx-3" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-text-field
              label="Routine Name"
              v-model="routineGroupName"
              hide-details
              required
            ></v-text-field>

            <v-spacer></v-spacer>
            <v-divider class="mx-3" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-btn
              color="primary"
              :disabled="!exercises.length"
              @click="savePreProcessing"
            >
              저장
            </v-btn>
          </v-card-title>

          <v-card-title v-if="workoutBottomSheetMode == 'record'">
            <span>Routine Title</span>

            <v-spacer></v-spacer>
            <v-divider class="mx-3" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-btn
              @click="$store.dispatch('hideWorkoutBottomSheet')"
              outlined
              color="secondary"
            >
              HIDE 👇🏻
            </v-btn>
          </v-card-title>

          <v-card-subtitle
            align="left"
            v-if="workoutBottomSheetMode == 'record'"
          >
            <StopWatch></StopWatch>
          </v-card-subtitle>

          <v-card-text style="overflow-y: scroll; height: calc(100vh - 80px)">
            <draggable
              v-model="exercises"
              :options="{ handle: '.grab-area' }"
              @change="updateCKey"
              @start="tableVisiblity = false"
              @end="tableVisiblity = true"
            >
              <ExerciseCard
                v-for="(exercise, exerciseIndex) in exercises"
                :key="exerciseIndex"
                :exercise="exercise"
                :cKey="cKey"
                :tableVisiblity="tableVisiblity"
                @updateExerciseSet="updateExerciseSet($event, exerciseIndex)"
              ></ExerciseCard>
            </draggable>
            <div style="display: flex; flex-direction: column">
              <v-dialog v-model="exerciseDialog" fullscreen persistant>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mt-3"
                    color="primary"
                    block
                    outlined
                    @click="openExerciseDialog"
                    v-bind="attrs"
                    v-on="on"
                  >
                    종목 추가
                  </v-btn>
                </template>
                <v-card>
                  <Exercise
                    v-if="exerciseDialog"
                    mode="select"
                    @selectExerciseComplete="addSelectedExercises"
                    @closeExerciseDialog="closeExerciseDialog"
                  ></Exercise>
                </v-card>
              </v-dialog>
              <v-btn
                v-if="workoutBottomSheetMode == 'record'"
                class="mt-3"
                color="error"
                block
                outlined
              >
                운동 종료
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import Exercise from "@/views/Exercise";
import ExerciseCard from "@/components/ExerciseCard";
import StopWatch from "@/utils/StopWatch";
import draggable from "vuedraggable";
import { mapState } from "vuex";

export default {
  components: {
    StopWatch,
    Exercise,
    ExerciseCard,
    draggable,
  },
  computed: {
    ...mapState(["isShowWorkoutBottomSheet", "isExistWorkoutBottomSheet"]),
    workoutBottomSheetMode: {
      get() {
        this.initExercises();
        return this.$store.state.workoutBottomSheetMode;
      },
    },
  },
  mounted() {
    this.initExercises(); // record mode
  },
  data() {
    return {
      cKey: 0,
      tableVisiblity: true,
      exercises: [],
      newRoutine: [],
      exerciseDialog: false,
      editIndex: -1,
      routineGroupName: "New Routine",
    };
  },
  methods: {
    initExercises() {
      console.log("init!!!!!!!!!");
      if (this.$store.state.workoutBottomSheetMode == "record") {
        console.log("record!!!!!");
        // this.exercises = this.$store.state.exercises;
        // console.log("init Data", this.$store.state.routineGroup);
      } else {
        console.log("create!!!!!");
      }
    },
    updateCKey() {
      this.cKey++;
    },
    openBottomSheet() {
      this.$store.dispatch("createWorkoutBottomSheet", "record");
      this.$store.dispatch("showWorkoutBottomSheet");
      this.isFullsreen = true;
    },
    eraseWorkoutSheet() {
      if (this.exercises > 0) {
        if (confirm("데이터가 모두 삭제됩니다. 그래도 닫으시겠어요? 🧙🏻‍♂")) {
          this.$store.dispatch("removeWorkoutBottomSheet");
          this.exercises = [];
        }
      } else {
        this.$store.dispatch("removeWorkoutBottomSheet");
        this.exercises = [];
      }
    },
    closeBottomSheet() {
      this.$store.dispatch("hideWorkoutBottomSheet");
    },
    openExerciseDialog() {
      this.exerciseDialog = true;
    },
    closeExerciseDialog() {
      this.exerciseDialog = false;
    },
    addSelectedExercises(selectedExercises) {
      this.exercises.push(...selectedExercises);
      this.closeExerciseDialog();
    },
    updateExerciseSet($event, exerciseIndex) {
      this.exercises[exerciseIndex].dataOfSet = $event;
      this.updateCKey();
    },
    savePreProcessing() {
      const userUuid = this.$store.state.userUuid;
      const routineGroupName = this.routineGroupName;
      let countOfExercise = 0;
      this.exercises.forEach((exercise) => {
        ++countOfExercise;
        let countOfSet = 0;
        const dataOfSet = exercise.dataOfSet;
        for (const item in dataOfSet) {
          const newLine = [];
          newLine.push(
            routineGroupName,
            userUuid,
            exercise.exerciseUuid,
            countOfExercise,
            ++countOfSet,
            dataOfSet[item].plusWeight,
            dataOfSet[item].minusWeight,
            dataOfSet[item].lap,
            dataOfSet[item].timeMin,
            dataOfSet[item].timeSec
          );
          this.newRoutine.push(newLine);
        }
      });
      // test print
      this.newRoutine.forEach((item) => {
        console.log(item);
      });
      this.save();
    },
    async save() {
      try {
        const newRoutine = this.newRoutine;
        const res = await this.$http.post(`/api/routine/regist`, {
          newRoutine,
        });
        if (res.data.success == true) {
          this.$store.dispatch("popToast", {
            msg: res.data.message,
            color: "primary",
          });
          console.log(res.data.message);
          this.exercises = [];
          this.eraseWorkoutSheet();
        } else {
          this.$store.dispatch("popToast", {
            msg: res.data.message,
            color: "error",
          });
          console.log(res.data.message);
        }
      } catch (err) {
        this.$store.dispatch("popToast", {
          msg: `Regist Failed(500) ${err}`,
          color: "error",
        });
        console.log(err);
      } finally {
        this.newRoutine = [];
      }
    },
  },
};
</script>

<style lang="scss">
</style>