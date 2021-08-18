<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name"
              required
              v-model="form.name"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              :items="categories"
              label="Category"
              v-model="form.category"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              :items="targets"
              label="Target"
              v-model="form.target"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Note"
              hint="Focus Target, Grip, ..."
              v-model="form.note"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="userId">
          <v-col align="right"> by {{ userId }} </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["userId", "userUuid"]),
    formTitle() {
      return this.formMode === "regist" ? "New Exercise" : "Edit Exercise";
    },
  },
  mounted() {},
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
    formMode: {
      type: String,
      default: "regist",
    },
  },
  destroyed() {
    console.log("ExerciseForm Destroyed");
  },
  data() {
    return {
      categories: [
        "바벨",
        "덤벨",
        "머신",
        "기구",
        "케이블",
        "밴드",
        "보조",
        "가중",
        "시간",
        "렙",
        "기타",
      ],
      targets: ["가슴", "등", "어깨", "팔", "하체", "코어", "전신", "기타"],
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async save() {
      let newExerciseUuid = "";
      const form = this.form;
      form.userId = this.$store.state.userId;
      form.userUuid = this.$store.state.userUuid;
      if (form.userId == "admin") {
        form.admin = 1;
      }
      try {
        let res = null;
        if (this.formMode == "regist") {
          res = await this.$http.post("/api/exercise/regist", { form });
        } else {
          res = await this.$http.post("/api/exercise/edit", { form });
        }
        if (res.data.success == true) {
          // alert(res.data.message); // 성공
          this.$store.dispatch("popToast", {
            msg: res.data.message,
            color: "primary",
          });
          newExerciseUuid = res.data.exerciseUuid;
          this.$emit("editProcessFinished", newExerciseUuid);
        } else {
          // alert(res.data.message); // 실패
          this.$store.dispatch("popToast", {
            msg: res.data.message,
            color: "error",
          });
          this.$emit("initData", "edit");
        }
      } catch (err) {
        if (this.formMode == "regist") {
          this.$store.dispatch("popToast", {
            msg: `Regist Failed(500) ${err}`,
            color: "error",
          });
        } else {
          // alert("Edit Failed(500)", err);
          this.$store.dispatch("popToast", {
            msg: `Edit Failed(500) ${err}`,
            color: "error",
          });
        }
        console.log(err);
        this.$emit("initData", "edit");
      } finally {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>