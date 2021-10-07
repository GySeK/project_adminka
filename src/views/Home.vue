<template>
  <div class="wrapper_flex_border_780 jc_start m_0_auto">
    <div class="h_26-2 flex ai_c mb_10">
      <input
        v-model="search_string"
        class="input_square-border_1 h_26-2 mr_10 fg_1"
      />
      <button
        @click="load_list_records()"
        class="button_square-border_1 h_26-2 mr_10"
      >
        Поиск
      </button>
      <router-link to="/login" class="mr_10 input_square-border"
        >Вход</router-link
      >
    </div>

    <div v-if="list_records.length == 0">Нет записей</div>
    <div v-if="load_list_records_error_message != ''">
      {{ load_list_records_error_message }}
    </div>

    <div v-for="record in list_records" :key="record.id">
      <div class="mt_10 b_1">
        <div class="date">
          <span class="c_w b_b">Время публикации:</span>
          {{ record.time }}
        </div>
        <div class="username">
          <span class="c_w b_b">Автор:</span>
          {{ record.username }}
        </div>
        <div>
          <span class="c_w b_b">id:</span>
          {{ record.id }}
        </div>
        <div>
          <span class="c_w b_b">Изменялясь ли запись:</span>
          {{ record.is_edited }}
        </div>
        <div class="username">
          <span class="c_w b_b">Текст:</span>
          {{ record.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/main.css";
import axios from "axios";

export default {
  data() {
    return {
      //data
      list_records: [],
      search_string: "",
      load_list_records_error_message: ""
    };
  },
  methods: {
    load_list_records() {
      axios
        .post("/get/data", { data: { search_string: this.search_string } })
        .then((response) => (this.list_records = response.data))
        .catch(() => {this.load_list_records_error_message = "Произошла ошибка при выполнении запроса"})
    },
  },
  mounted() {
    this.load_list_records();
  },
};
</script>

<style></style>
