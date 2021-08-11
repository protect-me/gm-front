<template>
  <v-container class="pt-0 px-2 pb-14">
    <v-row
      v-if="$store.state.isExistWorkoutBottomSheet"
      class="px-8"
      style="border-radius: 5px; background-color: #e0e0e0; diplay: flex"
    >
      <!-- justify-content: space-between; -->
      <!-- justify="center" -->
      <div
        class="notice pa-3 font-weight-medium"
        align="center"
        style="flex-grow: 1"
      >
        진행 중인 워크아웃이 있을 경우, <br />
        새 워크아웃을 시작하거나 <br />
        새 루틴을 만들 수 없습니다 🧙🏻‍♂️
      </div>
      <div style="display: flex; justify-content: center; align-items: center">
        <div class="text-h4">👆🏻</div>
      </div>
    </v-row>
    <v-row class="py-5">
      <v-btn
        block
        color="primary"
        large
        @click="makeNewRoutine"
        :disabled="$store.state.isExistWorkoutBottomSheet"
      >
        Make New Routine
      </v-btn>
    </v-row>
    <v-row>
      <v-divider class="pb-4"></v-divider>
    </v-row>

    <v-row
      v-if="!$store.state.userId"
      class="mt-4"
      style="border-radius: 5px; background-color: #e0e0e0"
      justify="center"
    >
      <div class="notice pa-3 font-weight-medium" align="center">
        ID와 PW만으로 간편하게 가입 🧙🏻‍♂️<br />
        로그인하시면 운동 루틴을 만들고 <br />
        기록할 수 있습니다!
      </div>
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
      if (!userUuid) return;
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
          // newGroup의 uuid와 roof의 uuid가 다를 경우
          if (newGroup.routineGroupUuid !== "") {
            // newGroup의 uuid가 있을 경우
            // => 기존에 만든 newGroup을 groupedRoutines에 push
            // => newGroup을 init(clone)
            // newGroup의 uuid가 없을 경우는 index가 0인 경우와 같으므로 init을 할 필요가 없음
            this.groupedRoutines.push(newGroup);
            newGroup = Object.assign({}, initGroup);
          }
          newGroup.routineGroupName = oneOfSet.routineGroupName;
          newGroup.routineGroupUuid = oneOfSet.routineGroupUuid;
          newGroup.exercises.push(oneOfSet);
        } else {
          // newGroup의 uuid와 roof의 uuid가 같은 경우 => newGroup에 push
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