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
            <span> Workout Title </span>
            <v-spacer></v-spacer>
            <v-btn @click="fullscreenToggle" outlined small color="secondary">
              <span v-if="isFullsreen">Minimize 👇🏻</span>
              <span v-else>Maximize 👆🏻</span>
            </v-btn>
          </v-card-title>
          <v-card-subtitle align="left"> 00:00 </v-card-subtitle>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12"> hell</v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-text>
            <v-btn color="primary" block outlined> 종목 추가 </v-btn>
            <v-btn class="mt-5" color="error" block outlined> 운동 종료 </v-btn>
          </v-card-text>
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
export default {
  created() {},
  destroye() {},
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
      test: "basic",
      sheet: false,
      isFullsreen: true,
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
  },
};
</script>

<style lang="scss">
</style>