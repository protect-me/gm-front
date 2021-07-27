<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">New Exsercise</span>
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
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
      <v-btn color="blue darken-1" text @click="regist">Regist</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        category: "",
        target: "",
        note: "",
      },
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
    async regist() {
      const form = this.form;
      try {
        const res = await this.$http.post("/api/exercise/regist", { form });
        if (res.data.success == true) {
          alert(res.data.message); // 성공
        } else {
          alert(res.data.message); // 실패
        }
      } catch (err) {
        alert("Regist Failed(500)", err);
        console.log(err);
      } finally {
        this.$emit("closeDialog");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>