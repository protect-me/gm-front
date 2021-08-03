<template>
  <div class="text-center">
    <v-btn color="primary" dark @click="openBottomSheet"> Workout </v-btn>

    <v-bottom-sheet
      v-if="existence"
      v-model="sheet"
      :fullscreen="isFullsreen"
      scrollable
      persistent
      hide-overlay
      class="here"
      style="z-index: 1"
    >
      <v-sheet class="text-center" :height="bottomSheetHeight">
        <v-card>
          <v-card-title v-if="mode == 'create'">
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
              label="Routine name"
              v-model="form.name"
              hide-details
              required
            ></v-text-field>

            <v-spacer></v-spacer>
            <v-divider class="mx-3" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-btn
              color="primary"
              :disabled="!exercises.length"
              @click="saveRoutine"
            >
              저장
            </v-btn>
          </v-card-title>

          <v-card-title v-if="mode == 'record'">
            <span>Routine Title</span>

            <v-spacer></v-spacer>
            <v-divider class="mx-3" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-btn @click="fullscreenToggle" outlined small color="secondary">
              <span v-if="isFullsreen">Minimize 👇🏻</span>
              <span v-else>Maximize 👆🏻</span>
            </v-btn>
          </v-card-title>

          <v-card-subtitle align="left" v-if="mode == 'record'">
            <StopWatch></StopWatch>
          </v-card-subtitle>

          <v-card-text style="overflow-y: scroll; height: calc(100vh - 80px)">
            <draggable
              v-model="exercises"
              :options="{ group: 'exerciseBlock' }"
            >
              <div
                v-for="(exercise, exerciseIndex) in exercises"
                :key="exerciseIndex"
              >
                <ExerciseBlock
                  :exercise="exercise"
                  @updateExerciseSet="updateExerciseSet($event, exerciseIndex)"
                ></ExerciseBlock>
              </div>
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
                v-if="mode == 'record'"
                class="mt-3"
                color="error"
                block
                outlined
              >
                운동 종료
              </v-btn>
            </div>
          </v-card-text>

          <!-- <v-card-actions>
          </v-card-actions> -->
        </v-card>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import StopWatch from "@/utils/StopWatch";
import Exercise from "@/views/Exercise";
import ExerciseBlock from "@/components/ExerciseBlock";
import draggable from "vuedraggable";

export default {
  components: {
    StopWatch,
    Exercise,
    ExerciseBlock,
    draggable,
  },
  watch: {
    isFullsreen() {
      if (this.isFullsreen) {
        this.$emit("fullscreen");
      } else {
        this.$emit("halfscreen");
      }
    },
  },
  computed: {
    bottomSheetHeight() {
      if (this.isFullsreen) {
        return "100vh";
      } else {
        return "200px";
      }
    },
  },
  data() {
    return {
      mode: "create", // record || create
      existence: false,
      exercises: [],
      newRoutine: [],
      exerciseDialog: false,
      editIndex: -1,
      sheet: false,
      isFullsreen: true,
      form: {
        name: "New Routine",
      },
    };
  },
  methods: {
    openBottomSheet() {
      this.sheet = true;
      this.existence = true;
      this.isFullsreen = true;
    },
    eraseWorkoutSheet() {
      if (this.exercises > 0) {
        if (confirm("데이터가 모두 삭제됩니다. 그래도 닫으시겠어요? 🧙🏻‍♂")) {
          this.existence = false;
          this.exercises = [];
        }
      } else {
        this.existence = false;
        this.exercises = [];
      }
    },
    closeBottomSheet() {
      this.sheet = false;
    },
    fullscreenToggle() {
      this.isFullsreen = !this.isFullsreen;
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
    },
    saveRoutine() {
      this.exercises.forEach((exercise) => {
        let count = 0;
        const dataOfSet = exercise.dataOfSet;
        for (const item in dataOfSet) {
          const newLine = {
            exerciseUuid: exercise.exerciseUuid,
            count: ++count,
            minusWeight: dataOfSet[item].minusWeight,
            plusWeight: dataOfSet[item].plusWeight,
            time: dataOfSet[item].time,
            lap: dataOfSet[item].lap,
          };
          this.newRoutine.push(newLine);
        }
      });
      this.saveProcess();
      this.newRoutine.forEach((item) => {
        console.log(item);
      });
    },
    async saveProcess() {
      // this.newRoutine;
    },
  },
};
</script>

<style lang="scss">
</style>