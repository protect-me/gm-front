<template>
  <div class="text-center">
    <v-btn color="primary" dark @click="openBottomSheet"> workout </v-btn>

    <v-bottom-sheet
      v-model="sheet"
      :fullscreen="isFullsreen"
      scrollable
      persistent
      hide-overlay
      class="here"
      style="z-index: 1"
    >
      <v-sheet class="text-center" :height="bottomSheetHeight">
        <v-card height="100%">
          <v-card-title>
            <span v-if="mode == 'record'">Workout Title</span>
            <span v-else>
              <v-text-field
                label="Routine name"
                v-model="form.name"
                required
              ></v-text-field>
            </span>
            <v-spacer></v-spacer>
            <v-btn @click="fullscreenToggle" outlined small color="secondary">
              <span v-if="isFullsreen">Minimize 👇🏻</span>
              <span v-else>Maximize 👆🏻</span>
            </v-btn>
          </v-card-title>
          <v-card-subtitle align="left">
            <StopWatch v-if="mode == 'record'"></StopWatch>
          </v-card-subtitle>
          <v-card-text>
            <div v-for="exercise in exercises" :key="exercise.exerciseUuid">
              <ExerciseBlock :exercise="exercise"></ExerciseBlock>
            </div>
            <!-- <v-container>
              <v-row>
                <v-col cols="12"></v-col>
              </v-row>
            </v-container> -->
          </v-card-text>
          <v-card-actions style="display: flex; flex-direction: column">
            <v-dialog v-model="exerciseDialog" fullscreen persistant>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
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

            <v-btn class="mt-5" color="error" block outlined> 운동 종료 </v-btn>
          </v-card-actions>
          <v-card-text>
            This is a bottom sheet using the controlled by v-model instead of
            activator This is a bottom sheet using the controlled by v-model
            instead of activator This is a bottom sheet using the controlled by
            v-model instead of activator This is a bottom sheet using the
            controlled by v-model instead of activator This is a bottom sheet
            using the controlled by v-model instead of activator This is a
            bottom sheet using the controlled by v-model instead of activator
            This is a bottom sheet using the controlled by v-model instead of
            activator This is a bottom sheet using the controlled by v-model
            instead of activator This is a bottom sheet using the controlled by
            v-model instead of activator This is a bottom sheet using the
            controlled by v-model instead of activator This is a bottom sheet
            using the controlled by v-model instead of activator This is a
            bottom sheet using the controlled by v-model instead of activator
            This is a bottom sheet using the controlled by v-model instead of
            activator This is a bottom sheet using the controlled by v-model
            instead of activator This is a bottom sheet using the controlled by
            v-model instead of activator This is a bottom sheet using the
            controlled by v-model instead of activator This is a bottom sheet
            using the controlled by v-model instead of activator This is a
            bottom sheet using the controlled by v-model instead of activator
            This is a bottom sheet using the controlled by v-model instead of
            activator This is a bottom sheet using the controlled by v-model
            instead of activator This is a bottom sheet using the controlled by
            v-model instead of activator This is a bottom sheet using the
            controlled by v-model instead of activator This is a bottom sheet
            using the controlled by v-model instead of activator This is a
            bottom sheet using the controlled by v-model instead of activator
            This is a bottom sheet using the controlled by v-model instead of
            activator This is a bottom sheet using the controlled by v-model
            instead of activator This is a bottom sheet using the controlled by
            v-model instead of activator This is a bottom sheet using the
            controlled by v-model instead of activator This is a bottom sheet
            using the controlled by v-model instead of activator This is a
            bottom sheet using the controlled by v-model instead of activator
            This is a bottom sheet using the controlled by v-model instead of
            activator This is a bottom sheet using the controlled by v-model
            activator This is a bottom sheet using the controlled by v-model
            instead of activator This is a bottom sheet using the controlled by
            v-model instead of activator This is a bottom sheet using the
            controlled by v-model instead of activator This is a bottom sheet
            using the controlled by v-model instead of activator This is a
            bottom sheet using the controlled by v-model instead of activator
            This is a bottom sheet using the controlled by v-model instead of
            activator This is a bottom sheet using the controlled by v-model
            instead of activator This is a bottom sheet using the controlled by
            v-model instead of activator This is a bottom sheet using the
            controlled by v-model instead of activator This is a bottom sheet
            using the controlled by v-model instead of activator This is a
            bottom sheet using the controlled by v-model instead of activator
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

export default {
  components: {
    StopWatch,
    Exercise,
    ExerciseBlock,
  },
  created() {},
  destroyed() {},
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
      exercises: [],
      exerciseDialog: false,
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
      this.isFullsreen = true;
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
  },
};
</script>

<style lang="scss">
</style>