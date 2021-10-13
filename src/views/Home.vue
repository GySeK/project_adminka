<template>
  <div class="wrapper_flex_border_780 m_0_auto">
    <div class="flex ai_c fw_w">
      <input
        v-model="search_string"
        class="input_square-border_1 h_26-2 mb_10 mr_10 fg_1"
      />
      <button
        @click="load_list_records()"
        class="button_square-border_1 h_26-2 mb_10 mr_10"
      >
        Поиск
      </button>
      <div v-if="user_data != null">
        <button
          @click="logout()"
          class="h_26-2 mb_10 mr_10 button_square-border_1"
        >
          Выход
        </button>
        <router-link v-if="checkPermission('write')" class="mr_10" to="/write"
          >Запись</router-link
        >
        <router-link
          v-if="checkPermission('administrate')"
          class="mr_10"
          to="/administrate"
          >Администрирование</router-link
        >
      </div>
      <router-link to="/login" v-if="user_data == null" class="mr_10 mb_10"
        >Вход</router-link
      >
    </div>

    <div v-if="list_records.length == 0">Нет записей</div>
    <div v-if="load_list_records_error_message != ''">
      {{ load_list_records_error_message }}
    </div>

    <div v-for="record in list_records" :key="record.id">
      <div class="b_1">
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
import Cookies from "js-cookie";

export default {
  data() {
    return {
      //data
      list_records: [],
      search_string: "",
      load_list_records_error_message: "",

      //user
      user_data: null,
    };
  },
  methods: {
    load_list_records() {
      axios
        .post("/get/data", { data: { search_string: this.search_string } })
        .then((response) => (this.list_records = response.data))
        .catch(() => {
          this.load_list_records_error_message =
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
    logout() {
      Cookies.remove("user")
      location.reload()
    }
  },
  mounted() {
    this.load_list_records();

    if ("user" in Cookies.get())
      this.user_data = JSON.parse(Cookies.get("user"));
  },
};
</script>

<style></style>
