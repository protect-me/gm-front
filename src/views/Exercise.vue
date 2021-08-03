<template>
  <v-data-table
    class="exercise-data-table"
    :class="{ 'pt-3': isSelectMode }"
    v-model="selectedExercises"
    :show-select="showSelect"
    item-key="exerciseUuid"
    :headers="headers"
    :items="exercisesDisplay"
    :search="search"
    sort-by="target"
    hide-default-footer
    mobile-breakpoint="1"
    disable-pagination
  >
    <!-- :loading="loading"
    :loading-text="loadingText" -->
    <template v-slot:top>
      <!-- 상단 : 검색 / NEW -->
      <v-toolbar flat class>
        <v-btn
          v-if="mode == 'select'"
          text
          color="error"
          class="pa-0"
          min-width="40px"
          @click="$emit('closeExerciseDialog')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-spacer v-if="mode == 'select'"></v-spacer>
        <v-divider
          v-if="mode == 'select'"
          class="mx-3"
          inset
          vertical
        ></v-divider>
        <v-spacer v-if="mode == 'select'"></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-divider class="mx-3" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog
          v-if="mode == 'view'"
          v-model="dialog"
          max-width="500px"
          persistant
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New
            </v-btn>
          </template>
          <ExerciseForm
            :form="editedItem"
            :formMode="formMode"
            @initData="initData"
            @closeDialog="closeDialog"
            @editProcessFinished="editUserScreenData"
          ></ExerciseForm>
        </v-dialog>

        <v-btn
          v-if="mode == 'select'"
          color="primary"
          @click="$emit('selectExerciseComplete', selectedExercises)"
        >
          선택완료({{ selectedExercises.length }})
        </v-btn>

        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
          <v-card>
            <v-card-title class="text-h6">
              복구가 불가능합니다. <br />그래도 삭제하시겠습니까?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDeleteDialog">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <!-- 상단 : 카테고리 / 타겟-->
      <v-toolbar flat class="mb-2">
        <v-select
          :items="categories"
          v-model="selectedCategory"
          outlined
          dense
          hide-details
          label="Category"
        ></v-select>
        <v-spacer></v-spacer>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-select
          :items="targets"
          v-model="selectedTarget"
          outlined
          hide-details
          dense
          label="Targets"
        ></v-select>
      </v-toolbar>
    </template>

    <template v-slot:[`item.name`]="{ item }">
      <div>
        {{ item.name }}
      </div>
      <div style="color: gray">
        {{ item.note }}
      </div>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        :disabled="item.defualt"
        small
        class="mr-2"
        @click="editItem(item)"
        color="error"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        :disabled="item.defualt"
        color="error"
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>

    <template v-slot:no-data> 데이터가 없습니다 🧙🏻‍♂️ </template>
  </v-data-table>
</template>

<script>
import ExerciseForm from "@/components/ExerciseForm";

export default {
  components: {
    ExerciseForm,
  },
  props: {
    mode: {
      type: String,
      default: "view", // view || select
    },
  },
  data: () => ({
    exercises: [],
    selectedExercises: [],
    showSelect: false,
    dialog: false,
    dialogDelete: false,
    loading: false,
    loadingText: "Loading... Please wait",
    search: "",
    headers: [
      {
        text: "Name",
        align: "start", // start, center, end
        value: "name",
      },
      { text: "Category", value: "category" },
      { text: "Target", value: "target" },
      // { text: "Actions", value: "actions", sortable: false },
    ],
    selectedCategory: "전체",
    categories: [
      "전체",
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
    selectedTarget: "전체",
    targets: [
      "전체",
      "가슴",
      "등",
      "어깨",
      "팔",
      "하체",
      "코어",
      "전신",
      "기타",
    ],
    editedIndex: -1,
    editedItem: {
      exerciseUuid: "",
      userUuid: "",
      name: "",
      category: "",
      target: "",
      note: "",
      admin: 0,
    },
    defaultItem: {
      exerciseUuid: "",
      userUuid: "",
      name: "",
      category: "",
      target: "",
      note: "",
      admin: 0,
    },
  }),

  computed: {
    isSelectMode() {
      if (this.mode == "select") return true;
    },
    formMode() {
      return this.editedIndex === -1 ? "regist" : "edit";
    },
    exercisesDisplay() {
      if (this.selectedCategory == "전체" && this.selectedTarget == "전체") {
        return this.exercises;
      } else if (
        this.selectedCategory != "전체" &&
        this.selectedTarget == "전체"
      ) {
        const result = this.exercises.filter((item) => {
          return item.category == this.selectedCategory;
        });
        return result;
      } else if (
        this.selectedCategory == "전체" &&
        this.selectedTarget != "전체"
      ) {
        const result = this.exercises.filter((item) => {
          return item.target == this.selectedTarget;
        });
        return result;
      } else {
        const result = this.exercises.filter((item) => {
          return (
            item.category == this.selectedCategory &&
            item.target == this.selectedTarget
          );
        });
        return result;
      }
    },
  },

  // watch: {
  //   dialog(val) {
  //     val || this.initData("edit");
  //   },
  //   dialogDelete(val) {
  //     val || this.initData("delete");
  //   },
  // },

  created() {
    this.addAdminAction();
    this.initialize();
    if (this.mode == "select") {
      this.showSelect = true;
    }
  },

  methods: {
    addAdminAction() {
      if (this.$store.state.userId == "admin") {
        this.headers.push({
          text: "Actions",
          value: "actions",
          sortable: false,
        });
      }
    },
    initialize() {
      this.$http.get("/api/exercise").then((res) => {
        this.exercises = res.data;
      });
    },

    // 등록 및 수정
    editItem(item) {
      this.editedIndex = this.exercises.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    editUserScreenData(newExerciseUuid) {
      if (this.editedIndex > -1) {
        Object.assign(this.exercises[this.editedIndex], this.editedItem); // edit
      } else {
        this.editedItem.exerciseUuid = newExerciseUuid;
        this.exercises.push(this.editedItem); // regist
      }
      this.initData("edit");
    },

    // 삭제
    deleteItem(item) {
      this.editedIndex = this.exercises.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      try {
        const res = await this.$http.delete(
          `/api/exercise/delete/${this.editedItem.exerciseUuid}`
        );
        if (res.data.success == true) {
          // alert(res.data.message); // 성공
          this.$store.dispatch("popToast", {
            msg: res.data.message,
            color: "error",
          });
          this.exercises.splice(this.editedIndex, 1);
        } else {
          // alert(res.data.message); // 실패
          this.$store.dispatch("popToast", {
            msg: `Regist Failed(500) ${err}`,
            color: "error",
          });
        }
      } catch (err) {
        // alert("Delete Failed(500)", err);
        this.$store.dispatch("popToast", {
          msg: `Delete Failed(500) ${err}`,
          color: "error",
        });
        console.log(err);
      } finally {
        this.initData("delete");
      }
    },

    // 후처리
    initData(mode) {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      if (mode == "edit") {
        this.closeDialog();
      } else {
        this.closeDeleteDialog();
      }
    },
    closeDialog() {
      this.dialog = false;
    },
    closeDeleteDialog() {
      this.dialogDelete = false;
    },
  },
};
</script>

<style lang="scss">
.exercise-data-table {
  th {
    padding: 0px 10px !important;
  }
  td {
    padding: 0px 10px !important;
  }
}
</style>