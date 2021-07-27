<template>
  <v-app>
    <v-app-bar color="white" app flat>
      <div class="title">💪🏻💪🏼💪🏽💪🏾💪🏿</div>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-bottom-navigation :value="value" color="primary">
      <v-btn v-for="item in nav" :key="item.title" :to="item.to">
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
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
          to: "/workout",
        },
        {
          title: "exercise",
          icon: "mdi-dumbbell",
          to: "/exercise",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.v-app-bar {
  /* display: none !important; */
}
</style>
