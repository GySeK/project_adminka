<template>
  <div class="wrapper_border_780 flex fd_c">
    <div class="h_26-2 flex ai_c">
      <input
        v-model="search_string"
        placeholder="Поиск"
        class="input_square-border_1 h_26-2 mr_10 fg_1"
      />
      <button @click="load_list_records()" class="button_square-border_1 h_26-2 mr_10">Поиск</button>
      <router-link to="/login" class="mr_10 input_square-border"
        >Вход</router-link
      >
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
import axios from "axios";

export default {
  data() {
    return {
      list_records: [],
      search_string: "",
    };
  },
  methods: {
    load_list_records() {
      axios
        .post("/get/data", { data: { search_string: this.search_string } })
        .then((response) => (this.list_records = response.data));
    }
  },
  mounted() {
    /*axios
      .post("/get/data", { data: { search_string: this.search_string } })
      .then((response) => (this.list_records = response.data));*/
    this.load_list_records()
  },
};
</script>

<style>
.c_w {
  color: white;
}
.b_b {
  background: black;
}
* {
  box-sizing: border-box;
}
*::selection {
  color: white;
  background-color: black;
}
.button_square-border_1 {
  border: 1px solid;
  border-radius: 0;
  cursor: pointer;
}
.input_square-border_1 {
  padding: 0;
  border-radius: 0;
  border: 1px solid;
  outline: none;
}
.fg_1 {
  flex-grow: 1;
}
a {
  color: black;
}
.h_26-2 {
  height: 26.2px !important;
}
.ai_c {
  align-items: center !important;
}
.mr_10 {
  margin-right: 10px !important;
}
.mt_10 {
  margin-top: 10px !important;
}
.mb_10 {
  margin-bottom: 10px !important;
}
a:link {
  text-decoration: none;
}
a:visited {
  text-decoration: none;
}
a:active {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
.flex {
  display: flex !important;
}
.fd_c {
  flex-direction: column !important;
}
.mr_10 {
  margin-right: 10px !important;
}
.mb_10 {
  margin-bottom: 10px !important;
}
.bt_1 {
  border-top: 1px solid !important;
}
.bb_1 {
  border-bottom: 1px solid !important;
}
.bl_1 {
  border-left: 1px solid !important;
}
.br_1 {
  border-right: 1px solid !important;
}
.b_1 {
  border: 1px solid !important;
}
.wrapper_border_780 {
  max-width: 780px;
  margin: auto;
  padding: 10px 16.2px;
  min-height: 100vh;
  border: 1px solid;
}
</style>
