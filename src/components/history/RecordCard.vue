<template>
  <v-card>
    <!-- class="pt-2 px-2" -->
    <v-card-title style="display: flex; width: 100%; flex-wrap: nowrap">
      <div
        class="mr-2"
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        {{ recordsGroup.routineGroupName }}
      </div>
      <v-spacer></v-spacer>
      <v-menu offset-y left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text min-width="40px" class="pa-0" v-bind="attrs" v-on="on">
            <v-icon> mdi-dots-horizontal </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="initRecordTime">
            <v-icon color="error">mdi-pencil</v-icon>
          </v-list-item>
          <v-list-item
            @click="$emit('deleteRecord', recordsGroup.recordsGroupUuid)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-dialog
        v-if="updateRecordTimeDialog"
        v-model="updateRecordTimeDialog"
        transition="dialog-top-transition"
        max-width="350"
      >
        <v-card>
          <v-card-title class="title"> 운동 시간 수정 </v-card-title>

          <v-card-text class="pt-5">
            <v-container>
              <v-row class="subtitle"> 시작 시간 </v-row>
              <v-row class="pb-5">
                <v-col
                  class="pa-0"
                  v-for="(item, index) in editedStartTime"
                  :key="index"
                >
                  <v-text-field
                    v-model.number="item.value"
                    :hint="item.key"
                    type="number"
                    class="px-1 centered-input"
                    @click="$event.target.select()"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="subtitle"> 종료 시간 </v-row>
              <v-row>
                <v-col
                  class="pa-0"
                  v-for="(item, index) in editedEndTime"
                  :key="index"
                >
                  <v-text-field
                    v-model.number="item.value"
                    :hint="item.key"
                    type="number"
                    class="px-1 centered-input"
                    @click="$event.target.select()"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="error" outlined @click="removeUpdateRecordTimeDialog">
              취소
            </v-btn>

            <v-btn
              color="green darken-1"
              outlined
              @click="validateEditedTimeData"
            >
              수정
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-card-subtitle class="pb-0">
      {{ this.$moment(recordsGroup.startTime).format("YYYY.MM.DD (dd) HH:mm") }}
    </v-card-subtitle>
    <v-card-subtitle class="pt-0 pb-0">
      <v-icon small>mdi-timer-outline</v-icon> {{ duration }}
    </v-card-subtitle>
    <v-card-subtitle class="pt-0">
      <div>총 {{ totalCountOfExercise }} 운동 · {{ totalCountOfSet }} 세트</div>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import DisplayTime from "@/components/DisplayTime";

export default {
  components: {
    DisplayTime,
  },
  props: {
    recordsGroup: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      updateRecordTimeDialog: false,
      startTime: [],
      endTime: [],
      editedStartTime: [],
      editedEndTime: [],
    };
  },
  computed: {
    duration() {
      const startTime = this.$moment(this.recordsGroup.startTime);
      const endTime = this.$moment(this.recordsGroup.endTime);
      const diff = endTime.diff(startTime, "minutes");
      const displayHH = Math.floor(diff / 60);
      const displayMM = diff % 60;

      return displayHH == 0
        ? `${displayMM}분`
        : `${displayHH}시간 ${displayMM}분`;
    },
    totalCountOfExercise() {
      const lastIndex = this.recordsGroup.exercises.length - 1;
      return this.recordsGroup.exercises[lastIndex].countOfExercise;
    },
    totalCountOfSet() {
      return this.recordsGroup.exercises.length;
    },
  },
  methods: {
    initRecordTime() {
      const startTime = this.$moment(this.recordsGroup.startTime);
      const endTime = this.$moment(this.recordsGroup.endTime);
      this.startTime = [
        { key: "year", value: startTime.year() },
        { key: "month", value: startTime.month() + 1 },
        { key: "date", value: startTime.date() },
        { key: "hour", value: startTime.hour() },
        { key: "minute", value: startTime.minute() },
        { key: "second", value: startTime.second() },
      ];
      this.endTime = [
        { key: "year", value: endTime.year() },
        { key: "month", value: endTime.month() + 1 },
        { key: "date", value: endTime.date() },
        { key: "hour", value: endTime.hour() },
        { key: "minute", value: endTime.minute() },
        { key: "second", value: endTime.second() },
      ];
      this.initEditedRecordTime();
    },
    initEditedRecordTime() {
      this.editedStartTime = JSON.parse(JSON.stringify(this.startTime));
      this.editedEndTime = JSON.parse(JSON.stringify(this.endTime));
      this.updateRecordTimeDialog = true;
    },
    modifyToMomentTimeFormat(edidtedTime) {
      const modifiedTime = {};
      edidtedTime.forEach((item) => {
        if (
          item.key == "month" &&
          String(item.value).length <= 2 &&
          String(item.value).length > 0
        ) {
          modifiedTime[item.key] = item.value - 1;
        } else if (
          (item.key == "year" && String(item.value).length == 4) ||
          (item.key !== "year" &&
            String(item.value).length <= 2 &&
            String(item.value).length > 0)
        ) {
          modifiedTime[item.key] = item.value;
        } else {
          throw err;
        }
      });
      return this.$moment().set(modifiedTime).format("YYYY-MM-DD HH:mm:ss");
    },
    validateEditedTimeData() {
      try {
        const modifiedStartTime = this.modifyToMomentTimeFormat(
          this.editedStartTime
        );
        const modifiedEndTime = this.modifyToMomentTimeFormat(
          this.editedEndTime
        );
        this.updateRecordsGroupTime(modifiedStartTime, modifiedEndTime);
      } catch (err) {
        this.$store.dispatch("popToast", {
          msg: "운동 시간을 형식에 맞게 입력해주세요 🧙🏻‍♂️",
          color: "error",
        });
      }
    },
    async updateRecordsGroupTime(modifiedStartTime, modifiedEndTime) {
      const recordsGroupInfo = {};
      recordsGroupInfo.recordsGroupUuid = this.recordsGroup.recordsGroupUuid;
      recordsGroupInfo.modifiedStartTime = modifiedStartTime;
      recordsGroupInfo.modifiedEndTime = modifiedEndTime;
      try {
        const res = await this.$http.put(`/api/records`, { recordsGroupInfo });
        if (res.data.success == true) {
          this.$store.dispatch("popToast", {
            msg: `성공적으로 수정되었습니다 🧙🏻‍♂️`,
            color: "primary",
          });
          this.recordsGroup.startTime = modifiedStartTime;
          this.recordsGroup.endTime = modifiedEndTime;
          this.removeUpdateRecordTimeDialog();
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
    removeUpdateRecordTimeDialog() {
      this.updateRecordTimeDialog = false;
      this.editedStartTime = [];
      this.editedEndTime = [];
    },
  },
};
</script>

<style>
.centered-input input {
  text-align: center;
}
</style>