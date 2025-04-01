<template>
  <div class="profile">
    <h1>Профиль</h1>
    <div v-if="user">
      <img :src="user.avatar_url" alt="Аватар" v-if="user.avatar_url">
      <p>Имя: {{ user.first_name }} {{ user.last_name }}</p>
      <p>Username: {{ user.username }}</p>
      <p>Описание: {{ user.description }}</p>

      <h2>Редактировать профиль</h2>
      <form @submit.prevent="updateProfile">
        <div>
          <label for="description">Описание:</label>
          <textarea id="description" v-model="description"></textarea>
        </div>
        <div>
          <label for="avatar_url">URL Аватара:</label>
          <input type="text" id="avatar_url" v-model="avatar_url">
        </div>
        <button type="submit" :disabled="$v.$invalid">Обновить профиль</button>
      </form>
    </div>
    <div v-else>
      Загрузка профиля...
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      user: null,
      description: '',
      avatar_url: ''
    };
  },
  validations () {
    return {
      description: {  }, //  Добавьте правила валидации, если нужно
      avatar_url: {  } // Добавьте правила валидации, если нужно
    }
  },
  async mounted() {
    try {
      const response = await api.get('/users/profile');
      this.user = response.data;
      this.description = this.user.description;
      this.avatar_url = this.user.avatar_url;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async updateProfile() {
      this.v$.$touch(); // Trigger validation
      if (this.v$.$invalid) {
        return;
      }

      try {
        const response = await api.put('/users/profile', {
          description: this.description,
          avatar_url: this.avatar_url
        });
        this.user = response.data;
        alert('Профиль успешно обновлен!');
      } catch (error) {
        console.error(error);
        alert('Ошибка при обновлении профиля.');
      }
    }
  }
};
</script>

<style scoped>
.profile {
  padding: 20px;
}
.profile img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>