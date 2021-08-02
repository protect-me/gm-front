<template>
  <v-app>
    <v-app-bar color="white" app flat>
      <div class="title">💪🏻💪🏼💪🏽💪🏾💪🏿</div>
      <v-spacer></v-spacer>
      <WorkoutSheet
        @fullscreen="BottomNavToMiddle"
        @halfscreen="BottomNavToTop"
      ></WorkoutSheet>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-bottom-navigation
      :value="value"
      color="primary"
      fixed
      :style="bottomNavStyle"
    >
      <v-btn v-for="item in nav" :key="item.title" :to="item.to">
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <Toast></Toast>
  </v-app>
</template>

<script>
import WorkoutSheet from "@/components/WorkoutSheet";
import Toast from "@/utils/Toast";

export default {
  components: {
    WorkoutSheet,
    Toast,
  },
  data() {
    return {
      workoutSheetDialog: false,
      value: 1,
      nav: [
        {
          title: "history",
          icon: "mdi-history",
          to: "/history",
        },
        {
          title: "workout",
          icon: "mdi-plus",
          to: "/",
        },
        {
          title: "exercise",
          icon: "mdi-dumbbell",
          to: "/exercise",
        },
      ],
      bottomNavStyle: {
        zIndex: "6",
      },
    };
  },
  methods: {
    BottomNavToMiddle() {
      this.bottomNavStyle.zIndex = "6";
    },
    BottomNavToTop() {
      this.bottomNavStyle.zIndex = "300 !important";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
