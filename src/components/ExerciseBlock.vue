<template>
  <v-card class="elevation-1">
    <v-card-title class="pb-0 subtitle-1 font-weight-bold">
      <v-chip class="mr-2" color="primary" outlined small>
        {{ exercise.target }} | {{ exercise.category }}
      </v-chip>
      <v-spacer></v-spacer>
      <v-btn text min-width="40px" class="pa-0">
        <v-icon> mdi-dots-horizontal </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-title class="py-0 subtitle-1 font-weight-bold">
      {{ exercise.name }}
    </v-card-title>
    <v-card-text>
      <v-card-subtitle align="left" class="pa-0" v-if="exercise.note">
        {{ exercise.note }}
      </v-card-subtitle>
      <v-data-table
        :cKey="cKey"
        class="exercise-block-data-table"
        :headers="headers"
        :items="exercise.dataOfSet"
        mobile-breakpoint="1"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:[`item.setCount`]="{ item }">
          {{ exercise.dataOfSet.indexOf(item) + 1 }}
        </template>
        <template v-slot:[`item.plusWeight`]="{ item }">
          <v-text-field
            style="display: block; width: 60px; margin: 0 auto"
            outlined
            dense
            v-model.number="item.plusWeight"
            hide-details
            reverse
            type="number"
            @input="emitData"
          ></v-text-field>
        </template>
        <template v-slot:[`item.minusWeight`]="{ item }">
          <v-text-field
            v-model.number="item.minusWeight"
            style="display: block; width: 60px; margin: 0 auto"
            outlined
            dense
            reverse
            hide-details
            type="number"
            @input="emitData"
          ></v-text-field>
        </template>
        <template v-slot:[`item.time`]="{ item }">
          <div style="display: flex">
            <v-text-field
              v-model.number="item.timeMin"
              style="width: 12px; margin: 0 auto"
              outlined
              dense
              reverse
              hide-details
              type="number"
              @input="emitData"
            ></v-text-field>
            <div class="py-2 px-1">:</div>
            <v-text-field
              v-model.number="item.timeSec"
              style="width: 12px; margin: 0 auto"
              outlined
              dense
              reverse
              hide-details
              type="number"
              @input="emitData"
            ></v-text-field>
          </div>
        </template>
        <template v-slot:[`item.lap`]="{ item }">
          <v-text-field
            v-model.number="item.lap"
            style="display: block; width: 40px; margin: 0 auto"
            outlined
            dense
            reverse
            hide-details
            type="number"
            @input="emitData"
          ></v-text-field>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            color="error"
            small
            :disabled="exercise.dataOfSet.length == 1"
            @click="deleteSet(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <v-btn class="mt-3" block outlined small @click="addNewSet">
        세트 추가
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    exercise: {
      type: Object,
      default: () => ({}),
    },
    cKey: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    // 여기에서 userUuid, exerciseUuid를 들고 database에서 history를 뒤져서 가져와야할 듯
    this.initDataOfSet();
    this.initHeader();
  },
  watch: {
    cKey() {
      console.log("watch ckey updated");
      this.$forceUpdate;
    },
    exercise: {
      deep: true,
      handler() {
        console.log("watch datas => update parent");
        this.initHeader();
        this.$forceUpdate();
      },
    },
  },
  data() {
    return {
      exerciseType: [],
      headers: [],
    };
  },
  methods: {
    initDataOfSet() {
      this.exercise.dataOfSet = [];
      this.exercise.dataOfSet.push({
        prev: 0,
        plusWeight: 0,
        minusWeight: 0,
        lap: 0,
        timeMin: 0,
        timeSec: 0,
      });
    },
    checkExerciseCategory() {
      this.exerciseType.length = 0;
      switch (this.exercise.category) {
        case "바벨":
        case "덤벨":
        case "머신":
        case "기구":
        case "케이블":
        case "가중":
        case "바벨":
        case "기타":
          this.exerciseType.push("plusWeight");
          this.exerciseType.push("lap");
          break;

        case "보조":
          this.exerciseType.push("minusWeight");
          this.exerciseType.push("lap");
          break;

        case "시간":
          this.exerciseType.push("time");
          break;

        case "밴드":
        case "렙":
          this.exerciseType.push("lap");
          break;
      }
    },
    initHeader() {
      this.headers = [
        {
          text: "Set",
          align: "center", // start, center, end
          value: "setCount",
          sortable: false,
        },
        {
          text: "Prev",
          align: "center",
          value: "prev",
          sortable: false,
        },
        {
          text: "X",
          align: "center",
          value: "actions",
          sortable: false,
        },
      ];

      this.checkExerciseCategory();

      this.exerciseType.forEach((type) => {
        this.headers.splice(this.headers.length - 1, 0, {
          text: this.replacText(type),
          align: "center",
          value: type,
          sortable: false,
        });
      });
    },
    replacText(type) {
      if (type == "plusWeight") {
        return "+kg";
      } else if (type == "minusWeight") {
        return "-kg";
      } else {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    },
    addNewSet() {
      const lastOfDataOfSet = this.exercise.dataOfSet.length - 1;
      const newSet = Object.assign(
        {},
        this.exercise.dataOfSet[lastOfDataOfSet]
      );
      this.exercise.dataOfSet.push(newSet);
      const refresh = JSON.parse(JSON.stringify(this.exercise.dataOfSet));
      this.$emit("updateExerciseSet", refresh);
      this.$forceUpdate;
    },
    deleteSet(item) {
      if (this.exercise.dataOfSet.length == 1) return;
      const deleteIndex = this.exercise.dataOfSet.indexOf(item);
      this.exercise.dataOfSet.splice(deleteIndex, 1);
      const refresh = JSON.parse(JSON.stringify(this.exercise.dataOfSet));
      this.$emit("updateExerciseSet", refresh);
    },
    emitData() {
      this.$emit("updateExerciseSet", this.exercise.dataOfSet);
    },
  },
};
</script>

<style lang="scss">
.exercise-block-data-table {
  th {
    padding: 0px 10px !important;
  }
  td {
    padding: 0px 10px !important;
  }
  .v-input__slot {
    padding: 0 6px !important;
  }
  input {
    text-align: center !important;
  }
}
</style>