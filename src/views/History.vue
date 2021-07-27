<template>
  <div class="continaer">
    <v-card>
      <v-card-title> 득근 | 得筋 </v-card-title>
      <!-- <v-card-subtitle> 得 얻을 (득) 筋 힘줄 (근)</v-card-subtitle> -->
      <v-card-subtitle>
        <strong>점진적 과부하</strong>를 관리하고 득근을 경험하세요🧙🏻‍♂️
      </v-card-subtitle>
      <v-card-text>
        <ul>
          <li>중량 과부하</li>
          <li>반복 횟수 증가</li>
          <li>세트 수 증가</li>
          <li>쉬는 시간 단축</li>
          <li>종목 수 증가</li>
        </ul>
      </v-card-text>
      <v-card-actions v-if="!userInfo">
        <v-spacer></v-spacer>
        <v-btn
          :outlined="signUpExpand"
          color="primary"
          @click="openSignUpExpand"
        >
          가입
        </v-btn>
        <v-btn :outlined="loginExpand" color="primary" @click="openLoginExpand">
          로그인
        </v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="logout"> 로그아웃 </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="signUpExpand">
          <v-divider></v-divider>
          <SignUp @signUpSuccess="openLoginExpand"></SignUp>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div v-show="loginExpand">
          <v-divider></v-divider>
          <Login @loginSuccess="loginSuccess"></Login>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Login from "@/components/history/Login";
import SignUp from "@/components/history/SignUp";

export default {
  components: {
    Login,
    SignUp,
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  data() {
    return {
      signUpExpand: false,
      loginExpand: false,
    };
  },
  methods: {
    openSignUpExpand() {
      if (this.loginExpand) this.loginExpand = false;
      this.signUpExpand = !this.signUpExpand;
    },
    openLoginExpand() {
      if (this.signUpExpand) this.signUpExpand = false;
      this.loginExpand = !this.loginExpand;
    },
    async loginSuccess(id) {
      this.loginExpand = false;
      await this.$store.dispatch("setUserInfo", id);
    },
    async logout() {
      if (confirm("로그아웃하시겠습니까? 🧙🏻‍♂")) {
        await this.$store.dispatch("setUserInfo", null);
        alert("로그아웃되었습니다 🧙🏻‍♂");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>