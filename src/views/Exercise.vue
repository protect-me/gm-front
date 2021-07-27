<template>
  <div class="container">
    <!-- transition="dialog-bottom-transition" -->
    <!-- <v-dialog v-model="dialog" persistent max-width="300px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Open Dialog
        </v-btn>
      </template>
      <ExerciseForm @closeDialog="closeDialog"></ExerciseForm>
    </v-dialog> -->
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Category</th>
            <th class="text-left">Target</th>
            <th class="text-left">Note</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exercise in exercises" :key="exercise.id">
            <td>{{ exercise.name }}</td>
            <td>{{ exercise.category }}</td>
            <td>{{ exercise.target }}</td>
            <td>{{ exercise.note }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
// import ExerciseForm from "@/components/ExerciseForm";

export default {
  components: {
    // ExerciseForm,
  },
  created() {
    this.$http.get("/api/exercise").then((res) => {
      this.exercises = res.data;
    });
  },
  data() {
    return {
      exercises: [],
      dialog: false,
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>