<template>
  <div class="text-center">
    <v-btn
      color="primary"
      @click="openBottomSheet"
      :disabled="
        !isExistWorkoutBottomSheet || workoutBottomSheetMode == 'create'
      "
    >
      WORKOUT 👆🏻
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

          <v-card-title
            v-if="workoutBottomSheetMode == 'record'"
            style="display: flex; width: 100%; flex-wrap: nowrap"
          >
            <div
              class="mr-2"
              style="
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ routineGroupName }}
            </div>

            <v-spacer></v-spacer>
            <span v-if="workoutBottomSheetMode == 'record'">
              <v-divider class="mx-3" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </span>

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
                @click="savePreProcessing"
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
        this.initData();
        return this.$store.state.workoutBottomSheetMode;
      },
    },
  },
  mounted() {
    this.initData(); // record mode
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
      routineGroupUuid: "", // record mode
      startTime: "",
    };
  },
  methods: {
    initData() {
      if (this.exercises.length > 0) return; // 이미 exercises가 있을 경우 return
      if (this.$store.state.workoutBottomSheetMode == "record") {
        this.routineGroupName = this.$store.state.routineGroup.routineGroupName;
        this.routineGroupUuid = this.$store.state.routineGroup.routineGroupUuid;
        this.initExercisesData();
        this.setStartTime();
      }
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
      this.$store.state.routineGroup.exercises.forEach((oneOfSet, index) => {
        if (index == 0) {
          // First Set
          newExercise.exerciseUuid = oneOfSet.exerciseUuid;
          newExercise.name = oneOfSet.name;
          newExercise.category = oneOfSet.category;
          newExercise.target = oneOfSet.target;
          newExercise.note = oneOfSet.note;
          newExercise.admin = oneOfSet.admin;
          newExercise.dataOfSet.push(oneOfSet);
          if (this.$store.state.routineGroup.length == 1) {
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
        if (index == this.$store.state.routineGroup.exercises.length - 1) {
          // Last Set
          this.exercises.push(newExercise); // push
        }
      });
    },
    setStartTime() {
      // this.startTime = new Date().toISOString().slice(0, 19).replace("T", " ");
      this.startTime = new Date().toISOString().slice(0, 19).replace("T", " ");
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
      if (this.workoutBottomSheetMode == "record") {
        if (!confirm("운동을 종료하시겠습니까? 🧙🏻‍♂️")) return;
      }
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
      this.save();
      // test print
      // this.newRoutine.forEach((item) => {
      //   console.log(item);
      // });
    },
    async save() {
      try {
        const reqData = {};
        reqData.newRoutine = this.newRoutine;
        reqData.startTime = this.startTime;
        reqData.endTime = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        let url = ``;
        if (this.workoutBottomSheetMode == "create") {
          url = `/api/routine/regist`;
        } else {
          url = `/api/records/regist`;
        }
        const res = await this.$http.post(url, { reqData });
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