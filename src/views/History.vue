<template>
  <div class="continaer">
    <v-card>
      <v-card-title> 득근 | 得筋 </v-card-title>
      <!-- <v-card-subtitle> 得 얻을 (득) 筋 힘줄 (근)</v-card-subtitle> -->
      <v-card-subtitle
        ><strong>점진적 과부하</strong>를 관리하고 득근을 경험하세요🧙🏻‍♂️
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
      <v-card-actions>
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
      <v-expand-transition>
        <div v-show="signUpExpand">
          <v-divider></v-divider>
          <SignUp></SignUp>
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div v-show="loginExpand">
          <v-divider></v-divider>
          <v-card-text> Login </v-card-text>
          <!-- <LoginCard></LoginCard> -->
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
// import LoginCard from "@/components/LoginCard";
import SignUp from "@/components/SignUp";

export default {
  components: {
    // LoginCard,
    SignUp,
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
  },
};
</script>

<style lang="scss" scoped>
</style>