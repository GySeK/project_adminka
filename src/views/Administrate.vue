
<template>
  <div class="wrapper_flex_border_780 m_0_auto flex fw_w ac_start">
    <div class="mw_200 mb_10 mr_10">
      <div class="mb_10 c_w b_b">Создать пользователя</div>
      <div class="mb_10">Введите имя пользователя</div>
      <input
        v-model="post_user_username"
        class="input_square-border_1 h_26-2 mb_10 mr_10 fg_1"
      />
      <div class="mb_10">Введите пароль пользователя</div>
      <input
        v-model="post_user_password"
        class="input_square-border_1 h_26-2 mb_10 mr_10 fg_1"
      />
      <div class="mb_10">Введите атрибуты пользователя(json)</div>
      <input
        v-model="post_user_attributes"
        class="input_square-border_1 h_26-2 mb_10 mr_10 fg_1"
      />
      <button
        @click="post_user()"
        class="button_square-border_1 h_26-2 mb_10 mr_10"
      >
        Отправить
      </button>

      <div v-if="post_user_correct_request">Запрос выполнен успешно</div>
      <div class="mb_10" v-if="post_user_correct_request == false">
        {{ post_user_error_message }}
      </div>
    </div>

    <div class="mw_200 mb_10">
      <div class="mb_10 c_w b_b">Удалить пользователя</div>
      <div class="mb_10">Введите имя пользователя</div>
      <input
        v-model="delete_user_username"
        class="input_square-border_1 h_26-2 mb_10 mr_10 fg_1"
      />
      <button
        @click="delete_user()"
        class="button_square-border_1 h_26-2 mb_10 mr_10"
      >
        Отправить
      </button>

      <div v-if="delete_user_correct_request">Запрос выполнен успешно</div>
      <div class="mb_10" v-if="delete_user_correct_request == false">
        {{ delete_user_error_message }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      //user_functions
      post_user_username: "",
      post_user_password: "",
      post_user_attributes: "",
      delete_user_username: "",
      //user
      user_data: null,
      //user_requests
      post_user_error_message: "",
      post_user_correct_request: null,
      delete_user_error_message: "",
      delete_user_correct_request: null,
    };
  },
  methods: {
    post_user() {
      axios
        .post("/api/post/user", {
          authorization: {
            username: this.user_data.username,
            password: this.user_data.password,
          },
          data: {
            username: this.post_user_username,
            password: this.post_user_password,
            attributes: this.post_user_attributes,
          },
        })
        .then(() => {
          this.post_user_correct_request = true;
        })
        .catch((err) => {
          this.post_user_error_message = `Произошла ошибка при выполнении запроса (${err.response.data.message})`;
          this.post_user_correct_request = false;
        });
    },
    delete_user() {
      axios
        .post("/api/delete/user", {
          authorization: {
            username: this.user_data.username,
            password: this.user_data.password,
          },
          data: {
            username: this.delete_user_username,
          },
        })
        .then(() => {
          this.delete_user_correct_request = true;
        })
        .catch((err) => {
          this.delete_user_error_message = `Произошла ошибка при выполнении запроса (${err.response.data.message})`;
          this.delete_user_correct_request = false;
        });
    },
  },
  mounted() {
    if ("user" in Cookies.get())
      this.user_data = JSON.parse(Cookies.get("user"));
  },
};
</script>
