<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        v-for="routineGroup in groupedRoutines"
        :key="routineGroup.routineGroupUuid"
        cols="12"
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
  // watch: {
  //   routines(nv) {
  //     console.log("watch routines", nv);
  //   },
  // },
  methods: {
    async loadRoutineData() {
      const userUuid = this.$store.state.userUuid;
      try {
        const res = await this.$http.get(`/api/routine/${userUuid}`);
        if (res.data.success == true) {
          this.routines = res.data.rows;
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
      // this.groupedRoutines = this.routines.reduce((acc, cur) => {
      //   let key = cur["routineGroupUuid"];
      //   if (!acc[key]) acc[key] = [];
      //   acc[key].push(cur);
      //   return acc;
      // }, {});
      let initGroup = {
        routineGroupName: "",
        routineGroupUuid: "",
        dataOfSet: [],
      };
      let newGroup = {
        routineGroupName: "",
        routineGroupUuid: "",
        dataOfSet: [],
      };
      this.routines.forEach((oneOfSet, index) => {
        if (newGroup.routineGroupUuid !== oneOfSet.routineGroupUuid) {
          if (newGroup.routineGroupUuid !== "") {
            this.groupedRoutines.push(newGroup);
            newGroup = Object.assign({}, initGroup);
          }
          newGroup.routineGroupName = oneOfSet.routineGroupName;
          newGroup.routineGroupUuid = oneOfSet.routineGroupUuid;
          newGroup.dataOfSet.push(oneOfSet);
        } else {
          newGroup.dataOfSet.push(oneOfSet);
        }

        if (index === this.routines.length - 1) {
          this.groupedRoutines.push(newGroup);
        }
      });

      console.log(this.groupedRoutines);

      // const newGroup = {
      //   routineGroupUuid: "",
      //   countOfExercise: 0,
      //   countOfSet: 0,
      // };
      // routine의 routineGroupUuid
      // routine의 마지막 index = countOfSet
      // routine의 마지막 index의 값 = countOfExercise

      // for (let routine in this.routines) {
      //   this.routines[routine];
      //   console.log("?", this.routines[routine]);
      // }
      // this.routines.forEach((routine, index) => {});
      //   routine.routineGroupUuid;
      //   countOf;

      // if (routine.routineUuid[0]) {
      //   newGroup.routineUuid = routine.routineUuid;
      //   routineTotalExerciseCount++;
      //   routineTotalSetCount++;
      // } else if (routine === routines[index - 1]) {
      //   routineTotalSetCount++;
      // } else if (routine !== routines[index - 1]) {
      //   routineTotalExerciseCount++;
      //   routineTotalSetCount++;
      // }
      // if (routine.routineUuid) this.groupedRoutines;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>