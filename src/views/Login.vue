<template>
  <div class="wrapper_flex_border_250 flex m_auto fd_c">
    <span class="b_1" v-if="get_user_error_message != ''">{{
      get_user_error_message
    }}</span>

    <span class="mt_10 mb_10">Имя пользователя</span>
    <input v-model="username" class="input_square-border_1 h_26-2 mb_10" />

    <span class="mb_10">Пароль</span>
    <input
      type="password"
      v-model="password"
      class="input_square-border_1 h_26-2 mb_10"
    />

    <button
      @click="get_user_set_cookie()"
      class="button_square-border_1 h_26-2 mr_10 mb_10"
    >
      Далее
    </button>

    <div v-if="user_data != null">
      <router-link class="mr_10" to="/">Поиск</router-link>
      <router-link v-if="checkPermission('write')" class="mr_10" to="/write"
        >Запись</router-link
      >
      <router-link v-if="checkPermission('administrate')" to="/administrate"
        >Администрирование</router-link
      >
    </div>
    <!--{{ user_data }}-->
  </div>
</template>

<script>
import "@/assets/main.css";
import axios from "axios";
import Cookies from 'js-cookie'

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
    get_user_set_cookie() {
      if (this.username == null || this.password == null) {
        this.get_user_error_message = "Введите имя пользователя или пароль";
        return;
      }
      axios
        .post("/get/user", {
          authorization: { username: this.username, password: this.password },
        })
        .then((response) => {
          this.user_data = response.data;
          Cookies.set("user", JSON.stringify(this.user_data))
          //const user = JSON.parse(Cookies.get('user'))
          //console.log(user.attributes.permissions)
          this.get_user_error_message = "";
        })
        .catch(() => {
          this.get_user_error_message =
            "Произошла ошибка при выполнении запроса";
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
};
</script>

<style></style>
