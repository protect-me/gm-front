<template>
  <div class="text-center">
    <v-btn
      color="primary"
      @click="openBottomSheet"
      :disabled="
        !isExistWorkoutBottomSheet ||
        workoutBottomSheetMode == 'create' ||
        workoutBottomSheetMode == 'update'
      "
    >
      WORKOUT
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
          <v-card-title
            v-if="
              workoutBottomSheetMode == 'create' ||
              workoutBottomSheetMode == 'update'
            "
          >
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
                @deleteExercise="deleteExercise(exerciseIndex)"
              ></ExerciseCard>
            </draggable>
            <div style="display: flex; flex-direction: column" class="py-4">
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
              <div
                v-if="workoutBottomSheetMode == 'record'"
                style="display: flex; width: 100%"
              >
                <div style="width: 100%">
                  <v-btn
                    class="mt-3"
                    color="error"
                    block
                    outlined
                    @click="eraseWorkoutSheet"
                  >
                    운동 취소
                  </v-btn>
                </div>
                <v-divider class="mx-3" inset vertical></v-divider>
                <div style="width: 100%">
                  <v-btn
                    class="mt-3"
                    color="error"
                    block
                    outlined
                    @click="savePreProcessing"
                  >
                    운동 종료
                  </v-btn>
                </div>
              </div>
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
import { BUS } from "@/plugins/EventBus";

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
        return this.$store.state.workoutBottomSheetMode; // create | record | update
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
      routineGroupUuid: "", // record | update
      startTime: "",
    };
  },
  methods: {
    initData() {
      if (this.exercises.length > 0) return; // 이미 exercises가 있을 경우 return
      if (this.$store.state.workoutBottomSheetMode !== "create") {
        // udpate || record
        if (this.$store.state.routineGroup !== null) {
          this.routineGroupName = this.$store.state.routineGroup.routineGroupName;
          this.routineGroupUuid = this.$store.state.routineGroup.routineGroupUuid;
          this.initExercisesData();
        }
      }
      if (this.$store.state.workoutBottomSheetMode == "record") {
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
        oneOfSet.status = 0;
        oneOfSet.color = "grey";
        if (newExercise.countOfExercise !== oneOfSet.countOfExercise) {
          if (newExercise.countOfExercise !== 0) {
            this.exercises.push(newExercise);
            newExercise = Object.assign({}, initExercise);
            newExercise.dataOfSet = []; // Object.assign으로 deep clone이 안되기 때문
          }
          newExercise.countOfExercise = oneOfSet.countOfExercise;
          newExercise.exerciseUuid = oneOfSet.exerciseUuid;
          newExercise.name = oneOfSet.name;
          newExercise.category = oneOfSet.category;
          newExercise.target = oneOfSet.target;
          newExercise.note = oneOfSet.note;
          newExercise.admin = oneOfSet.admin;
          newExercise.dataOfSet.push(oneOfSet);
          if (this.$store.state.workoutBottomSheetMode == "update") {
            newExercise.routineUuid = oneOfSet.routineUuid;
          }
        } else {
          newExercise.dataOfSet.push(oneOfSet);
        }
        if (index === this.$store.state.routineGroup.exercises.length - 1) {
          this.exercises.push(newExercise);
        }
      });
    },
    setStartTime() {
      this.startTime = this.$moment().format("YYYY-MM-DD H:mm:ss");
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
      if (this.exercises.length > 0) {
        if (
          confirm(
            "입력/수정된 데이터가 모두 초기화됩니다. 그래도 닫으시겠어요? 🧙🏻‍♂"
          )
        ) {
          this.$store.dispatch("removeWorkoutBottomSheet");
          this.removeData();
        }
      } else {
        this.$store.dispatch("removeWorkoutBottomSheet");
        this.removeData();
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
    deleteExercise(exerciseIndex) {
      this.exercises.splice(exerciseIndex, 1);
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
        for (const oneOfSet in dataOfSet) {
          // create mode => true
          // update mode => true
          // record mode && status == 1or2 => true
          // record mode && status == 0 => false
          if (
            this.workoutBottomSheetMode == "create" ||
            this.workoutBottomSheetMode == "update" ||
            (this.workoutBottomSheetMode == "record" &&
              dataOfSet[oneOfSet].status !== 0 &&
              (dataOfSet[oneOfSet].lap !== 0 ||
                dataOfSet[oneOfSet].timeMin !== 0 ||
                dataOfSet[oneOfSet].timeSec !== 0))
          ) {
            const newLine = [];
            newLine.push(
              routineGroupName,
              userUuid,
              exercise.exerciseUuid,
              countOfExercise,
              ++countOfSet,
              dataOfSet[oneOfSet].plusWeight,
              dataOfSet[oneOfSet].minusWeight,
              dataOfSet[oneOfSet].lap,
              dataOfSet[oneOfSet].timeMin,
              dataOfSet[oneOfSet].timeSec
            );
            if (this.workoutBottomSheetMode == "record") {
              newLine.push(dataOfSet[oneOfSet].status);
            }
            if (this.workoutBottomSheetMode == "update") {
              newLine.push(this.routineGroupUuid);
            }
            this.newRoutine.push(newLine);
          }
        }
      });
      if (this.newRoutine.length > 0) {
        this.save();
      } else {
        this.$store.dispatch("removeWorkoutBottomSheet");
        this.removeData();
        this.$store.dispatch("popToast", {
          msg: `수행한 세트가 없기 때문에 운동이 취소되었습니다 🧙🏻‍♂️`,
          color: "error",
        });
      }
    },
    async save() {
      try {
        const reqData = {};
        reqData.newRoutine = this.newRoutine;
        reqData.startTime = this.startTime;
        reqData.routineGroupUuid = this.routineGroupUuid;
        reqData.endTime = this.$moment().format("YYYY-MM-DD H:mm:ss");
        let url = ``;
        if (this.workoutBottomSheetMode == "create") {
          url = `/api/routine/regist`;
        } else if (this.workoutBottomSheetMode == "record") {
          url = `/api/records/regist`;
        } else if (this.workoutBottomSheetMode == "update") {
          url = `/api/routine/update`;
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
        this.$store.dispatch("removeWorkoutBottomSheet");
        this.$store.dispatch("setRoutine", null);
        this.removeData();
        if (
          this.workoutBottomSheetMode == "create" ||
          this.workoutBottomSheetMode == "update"
        ) {
          BUS.$emit("reloadRoutineData");
        }
      }
    },
    removeData() {
      this.cKey = 0;
      this.exercises = [];
      this.newRoutine = [];
      this.editIndex = -1;
      this.routineGroupName = "New Routine";
      this.routineGroupUuid = "";
      this.startTime = "";
    },
  },
};
</script>

<style lang="scss">
</style>