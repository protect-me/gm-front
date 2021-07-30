<template>
  <v-card>
    <v-card-text class="ma-0 py-0">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
          <v-text-field
            v-model="form.userId"
            :rules="userIdRules"
            label="아이디 | ID"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            :rules="passwordRules"
            label="비밀번호 | Password"
            type="password"
            required
          ></v-text-field>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!valid" color="primary" @click="validate" align="right">
        로그인
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    form: {
      userId: "",
      password: "",
    },
    valid: true,
    userIdRules: [
      (v) => !!v || "아이디를 정확히 입력하지 않으면 근손실이 옵니다 🧙🏻‍♂",
      (v) =>
        (v && v.length >= 5 && v.length <= 15) ||
        "아이디는 5~15자로 입력 가능합니다 🧙🏻‍♂",
    ],
    passwordRules: [
      (v) => !!v || "비밀번호를 정확히 입력하지 않으면 근손실이 옵니다 🧙🏻‍♂",
      (v) =>
        (v && v.length >= 4 && v.length <= 20) ||
        "비밀번호는 4~20자로 입력 가능합니다 🧙🏻‍♂",
    ],
  }),
  watch: {
    form: {
      deep: true,
      handler() {
        this.$refs.form.resetValidation();
      },
    },
  },
  methods: {
    async validate() {
      await this.$refs.form.validate();
      if (!this.valid) {
        // alert("입력한 정보를 다시 확인해주세요 🧙🏻‍♂");
        this.$store.dispatch("popToast", {
          msg: `입력한 정보를 다시 확인해주세요 🧙🏻‍♂`,
          color: "error",
        });
      } else {
        this.login();
      }
    },
    async login() {
      try {
        const res = await this.$http.post("/api/users/login", {
          form: this.form,
        });
        if (res.data.success == true) {
          this.$store.dispatch("popToast", {
            msg: res.data.message,
            color: "primary",
          });
          this.$emit("loginSuccess", this.form.userId, res.data.userUuid);
          this.initForm();
        } else {
          this.$store.dispatch("popToast", {
            msg: res.data.message,
            color: "error",
          });
        }
      } catch (err) {
        this.$store.dispatch("popToast", {
          msg: `Login Failed(500) ${err}`,
          color: "error",
        });
        console.log(err);
      } finally {
        // this.$emit("closeDialog");
      }
    },
    initForm() {
      this.form.userId = "";
      this.form.password = "";
    },
  },
};
</script>