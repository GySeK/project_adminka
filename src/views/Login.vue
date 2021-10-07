<template>
  <div class="wrapper_flex_border_250 flex m_auto fd_c">
    <span class="b_1" v-if="get_user_error_message != ''">{{
      get_user_error_message
    }}</span>

    <span class="mt_10 mb_10">Имя пользователя</span>
    <input v-model="username" class="input_square-border_1 h_26-2 mb_10" />

    <span class="mb_10">Пароль</span>
    <input v-model="password" class="input_square-border_1 h_26-2 mb_10" />

    <button
      @click="get_user()"
      class="button_square-border_1 h_26-2 mr_10 mb_10"
    >
      Далее
    </button>

    {{ user_data }}

    <!--<router-link to="/login" class="mr_10 input_square-border"
      >Вход</router-link
    >-->
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

      //user
      username: null,
      password: null,
      user_data: null,
      get_user_error_message: "",
    };
  },
  methods: {
    get_user() {
      if(this.username == null || this.password == null) {
        this.get_user_error_message = "Введите имя пользователя или пароль"
        return
      }
      axios
        .post("/get/user", {
          authorization: { username: this.username, password: this.password },
        })
        .then((response) => (this.user_data = response.data))
        .catch(() => {
          this.get_user_error_message =
            "Произошла ошибка при выполнении запроса";
        });
    },
  },
};
</script>

<style></style>
