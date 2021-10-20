<template>
  <div class="wrapper_flex_border_780 m_0_auto flex fw_w ac_start">
    <div class="mw_200 mb_10 mr_10">
      <div class="mb_10 c_w b_b">Добавить запись</div>
      <div class="mb_10">Введите текст</div>
      <textarea
        v-model="post_data_text"
        class="input_square-border_1 mb_10 mr_10 fg_1"
      ></textarea>
      <button
        @click="post_data()"
        class="button_square-border_1 h_26-2 mb_10 mr_10"
      >
        Отправить
      </button>

      <div v-if="post_data_correct_request">Запрос выполнен успешно</div>
      <div class="mb_10" v-if="post_data_correct_request == false">
        {{ post_data_error_message }}
      </div>
    </div>

    <div class="mw_200 mb_10 mr_10">
      <div class="mb_10 c_w b_b">Изменить запись</div>

      <div class="mb_10">Введите id записи</div>
      <input
        v-model="put_data_id"
        class="input_square-border_1 h_26-2 mb_10 mr_10 fg_1"
      />

      <div class="mb_10">Введите текст</div>
      <textarea
        v-model="put_data_text"
        class="input_square-border_1 mb_10 mr_10 fg_1"
      >
      </textarea>
      <button @click="put_data()" class="button_square-border_1 h_26-2 mb_10 mr_10">
        Отправить
      </button>

      <div v-if="put_data_correct_request">Запрос выполнен успешно</div>
      <div class="mb_10" v-if="put_data_correct_request == false">
        {{ put_data_error_message }}
      </div>
    </div>

    <div class="mv_200 mb_10">
      <div class="mb_10 c_w b_b">Удалить запись</div>

      <div class="mb_10">Введите id записи</div>
      <input
        v-model="delete_data_id"
        class="input_square-border_1 h_26-2 mb_10 mr_10 fg_1"
      />
      <button @click="delete_data()" class="button_square-border_1 h_26-2 mb_10 mr_10">
        Отправить
      </button>

      <div v-if="delete_data_correct_request">Запрос выполнен успешно</div>
      <div class="mb_10" v-if="delete_data_correct_request == false">
        {{ delete_data_error_message }}
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/main.css";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      //user
      user_data: null,

      //data_functions
      post_data_text: "",

      put_data_id: "",
      put_data_text: "",

      delete_data_id: "",

      //data_request
      post_data_error_message: "",
      post_data_correct_request: null,

      put_data_error_message: "",
      put_data_correct_request: null,

      delete_data_error_message: "",
      delete_data_correct_request: null,
    };
  },
  methods: {
    post_data() {
      axios
        .post("/post/data", {
          authorization: {
            username: this.user_data.username,
            password: this.user_data.password
          },
          data: { text: this.post_data_text }
        })
        .then(() => {
          this.post_data_correct_request = true;
        })
        .catch((err) => {
          this.post_data_error_message =
            `Произошла ошибка при выполнении запроса (${err.response.data.message})`;
          this.post_data_correct_request = false;
        });
    },
    put_data() {
      axios
        .post("/put/data", {
          authorization: {
            username: this.user_data.username,
            password: this.user_data.password
          },
          data: { 
            id: this.put_data_id,
            text: this.put_data_text 
          }
        })
        .then(() => {
          this.put_data_correct_request = true;
        })
        .catch((err) => {
          this.put_data_error_message =
            `Произошла ошибка при выполнении запроса (${err.response.data.message})`;
          this.put_data_correct_request = false;
        });
    },
    delete_data() {
      axios
        .post("/delete/data", {
          authorization: {
            username: this.user_data.username,
            password: this.user_data.password
          },
          data: { 
            id: this.delete_data_id
          }
        })
        .then(() => {
          this.delete_data_correct_request = true;
        })
        .catch((err) => {
          this.delete_data_error_message =
            `Произошла ошибка при выполнении запроса (${err.response.data.message})`;
          this.delete_data_correct_request = false;
        });
    },
    checkPermission(permission_parameter) {
      for (let user_data_attributes_permission of this.user_data.attributes
        .permissions) {
        if (user_data_attributes_permission == permission_parameter)
          return true;
      }
      return false;
    },
  },
  mounted() {
    if ("user" in Cookies.get())
      this.user_data = JSON.parse(Cookies.get("user"));
  },
};
</script>

<style></style>
