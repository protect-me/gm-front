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
          <v-text-field
            v-model="form.passwordCheck"
            label="비밀번호 확인 | Password Check"
            type="password"
            :rules="passwordRules"
            required
          ></v-text-field>
          <v-checkbox
            v-model="form.checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            label="위 정보는 회원 검증/구분 외에 다른 용도로 이용되지 않습니다 🧙🏻‍♂️"
            required
          ></v-checkbox>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!valid" color="primary" @click="validate" align="right">
        가입
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
      passwordCheck: "",
      checkbox: false,
    },
    valid: true,
    userIdRules: [
      // To Do : id, password 검증 추가('admin', '관리자', 한글, 기호 등 입력 막기)
      (v) => !!v || "필수 항목입니다 🧙🏻‍♂",
      (v) =>
        (v && v.length >= 5 && v.length <= 15) ||
        "아이디는 5~15자로 입력 가능합니다 🧙🏻‍♂",
    ],
    passwordRules: [
      (v) => !!v || "필수 항목입니다 🧙🏻‍♂",
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
      if (this.form.password !== this.form.passwordCheck) {
        alert("비밀번호가 일치하지 않습니다 🧙🏻‍♂");
        this.valid = false;
      } else if (!this.valid) {
        alert("입력한 정보를 다시 확인해주세요 🧙🏻‍♂");
      } else {
        this.signUp();
      }
    },
    async signUp() {
      const form = this.form;
      try {
        const res = await this.$http.post("/api/users/signUp", { form });
        if (res.data.success == true) {
          alert(res.data.message); // 성공
          this.$emit("signUpSuccess");
        } else {
          alert(res.data.message); // 실패
        }
      } catch (err) {
        alert("Sign Up Failed(500)", err);
        console.log(err);
      } finally {
        // this.$emit("closeDialog");
      }
    },
    initForm() {
      this.form.userId = "";
      this.form.password = "";
      this.form.passwordCheck = "";
      this.form.checkbox = "";
      this.$refs.form.reset();
    },
  },
};
</script>