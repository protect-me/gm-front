<template>
  <v-container class="pt-0 px-2 pb-14">
    <v-row class="py-5">
      <v-btn block color="primary" large @click="makeNewRoutine">
        Make New Routine
      </v-btn>
    </v-row>
    <v-row>
      <v-divider class="pb-4"></v-divider>
    </v-row>
    <v-row>
      <v-col
        class="pa-1"
        v-for="routineGroup in groupedRoutines"
        :key="routineGroup.routineGroupUuid"
        cols="6"
      >
        <!-- :cols="card.flex" -->
        <RoutineCard :routineGroup="routineGroup"> </RoutineCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RoutineCard from "@/components/RoutineCard";

export default {
  components: {
    RoutineCard,
  },
  data() {
    return {
      routines: [],
      groupedRoutines: [],
    };
  },
  created() {
    this.loadRoutineData();
  },
  methods: {
    async loadRoutineData() {
      const userUuid = this.$store.state.userUuid;
      try {
        const res = await this.$http.get(`/api/routine/${userUuid}`);
        if (res.data.success == true) {
          this.routines = res.data.rows;
          console.log(this.routines);
          this.groupingRoutines();
        } else {
          this.$store.dispatch("popToast", {
            msg: `데이터를 가져오는데 실패했습니다.(401) ${err}`,
            color: "error",
          });
          console.log(err);
        }
      } catch (err) {
        this.$store.dispatch("popToast", {
          msg: `데이터를 가져오는데 실패했습니다.(500) ${err}`,
          color: "error",
        });
        console.log(err);
      }
    },
    groupingRoutines() {
      let initGroup = {
        routineGroupName: "",
        routineGroupUuid: "",
        exercises: [],
      };
      let newGroup = {
        routineGroupName: "",
        routineGroupUuid: "",
        exercises: [],
      };
      this.routines.forEach((oneOfSet, index) => {
        if (newGroup.routineGroupUuid !== oneOfSet.routineGroupUuid) {
          if (newGroup.routineGroupUuid !== "") {
            this.groupedRoutines.push(newGroup);
            newGroup = Object.assign({}, initGroup);
          }
          newGroup.routineGroupName = oneOfSet.routineGroupName;
          newGroup.routineGroupUuid = oneOfSet.routineGroupUuid;
          newGroup.exercises.push(oneOfSet);
        } else {
          newGroup.exercises.push(oneOfSet);
        }

        if (index === this.routines.length - 1) {
          this.groupedRoutines.push(newGroup);
        }
      });
      console.log(this.groupedRoutines);
    },
    makeNewRoutine() {
      this.$store.dispatch("createWorkoutBottomSheet", "create");
      this.$store.dispatch("showWorkoutBottomSheet");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>