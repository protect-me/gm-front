<template>
  <div class="wrapper">
    <v-card>
      <v-card-title> 득근 | 得筋 </v-card-title>
      <v-card-subtitle>
        <strong>점진적 과부하</strong>를 관리하고 득근을 경험하세요 🧙🏻‍♂️
      </v-card-subtitle>
      <v-card-text v-if="!$store.state.userId">
        <ul>
          <li>중량 과부하</li>
          <li>반복 횟수 증가</li>
          <li>세트 수 증가</li>
          <li>쉬는 시간 단축</li>
          <li>종목 수 증가</li>
        </ul>
      </v-card-text>
      <v-card-actions v-if="!userUuid">
        <!-- <v-spacer></v-spacer> -->
        <div style="display: flex; width: 100%">
          <div style="width: 100%">
            <v-btn
              block
              :outlined="signUpExpand"
              color="primary"
              @click="openSignUpExpand"
            >
              가입
            </v-btn>
          </div>
          <v-divider class="mx-3" inset vertical></v-divider>
          <div style="width: 100%">
            <v-btn
              block
              :outlined="loginExpand"
              color="primary"
              @click="openLoginExpand"
            >
              로그인
            </v-btn>
          </div>
        </div>
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

    <v-container class="pb-14">
      <v-row
        v-if="!$store.state.userId && !loginExpand"
        class="mt-1"
        style="border-radius: 5px; background-color: #e0e0e0"
        justify="center"
      >
        <div class="notice pa-3 font-weight-medium" align="center">
          ID와 PW만으로 간편하게 가입 🧙🏻‍♂️<br />
          로그인하시면 운동 기록이 나타납니다:)
        </div>
      </v-row>
      <v-row>
        <v-col
          class="pa-1"
          v-for="recordsGroup in groupedRecords"
          :key="recordsGroup.recordsGroupUuid"
          cols="12"
        >
          <RecordCard :recordsGroup="recordsGroup"> </RecordCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Login from "@/components/history/Login";
import SignUp from "@/components/history/SignUp";
import RecordCard from "@/components/history/RecordCard";

export default {
  components: {
    Login,
    SignUp,
    RecordCard,
  },
  computed: {
    ...mapState(["userId", "userUuid"]),
  },
  data() {
    return {
      signUpExpand: false,
      loginExpand: false,
      records: [],
      groupedRecords: [],
    };
  },
  created() {
    this.loadRecordsData();
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
    async loginSuccess(userId, userUuid) {
      this.loginExpand = false;
      const payload = {};
      payload.userId = userId;
      payload.userUuid = userUuid;
      await this.$store.dispatch("setUserInfo", payload);
      this.loadRecordsData();
    },
    async logout() {
      if (confirm("로그아웃하시겠습니까? 🧙🏻‍♂")) {
        await this.$store.dispatch("resetUserInfo");
        await this.$store.dispatch("popToast", {
          msg: "로그아웃되었습니다 🧙🏻‍♂",
          color: "primary",
        });
        this.records = [];
        this.groupedRecords = [];
      }
    },
    async loadRecordsData() {
      const userUuid = this.$store.state.userUuid;
      if (!userUuid) return;
      try {
        const res = await this.$http.get(`/api/records/${userUuid}`);
        if (res.data.success == true) {
          this.records = res.data.rows;
          console.log("records", this.records);
          this.groupingRecords();
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
    groupingRecords() {
      let initGroup = {
        routineGroupName: "",
        recordsGroupUuid: "",
        startTime: "",
        endTime: "",
        exercises: [],
      };
      let newGroup = {
        routineGroupName: "",
        recordsGroupUuid: "",
        startTime: "",
        endTime: "",
        exercises: [],
      };
      this.records.forEach((oneOfSet, index) => {
        if (newGroup.recordsGroupUuid !== oneOfSet.recordsGroupUuid) {
          if (newGroup.recordsGroupUuid !== "") {
            this.groupedRecords.push(newGroup);
            newGroup = Object.assign({}, initGroup);
          }
          newGroup.routineGroupName = oneOfSet.routineGroupName;
          newGroup.recordsGroupUuid = oneOfSet.recordsGroupUuid;
          newGroup.startTime = oneOfSet.startTime;
          newGroup.endTime = oneOfSet.endTime;
          newGroup.exercises.push(oneOfSet);
        } else {
          newGroup.exercises.push(oneOfSet);
        }

        if (index === this.records.length - 1) {
          this.groupedRecords.push(newGroup);
        }
      });
      console.log("groupedRecords", this.groupedRecords);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>