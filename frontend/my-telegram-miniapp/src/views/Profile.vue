<template>
  <div class="profile-container">
    <div class="header">
      <h2 class="page-title">Walky</h2>
      <!-- Кнопка с иконкой -->
      <router-link to="/map" class="map-link">
        <img src="../assets/icons/map.png" alt="Map Icon" class="map-icon"/>
      </router-link>
    </div>
    <div v-if="userData" class="profile-content">
      <div class="avatar-container">
        <img :src="userData.image_url" alt="Avatar" class="avatar"/>
      </div>
      <div class="user-info">
        <p class="username">Имя пользователя: {{ userData.username }}</p>
        <p class="first-name">Имя: {{ userData.first_name }}</p>
        <p class="description">О себе: {{ userData.description }}</p>
      </div>
    </div>
    <div v-else class="loading">
      <p>Загрузка данных...</p>
    </div>
    <div>
      <ProfileMenu />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProfileMenu from "../components/Profile_menu.vue";

export default {
  name: 'Profile',
  components: {ProfileMenu},
  data() {
    return {
      userData: null, // Данные пользователя, которые получаем с API
    };
  },
  mounted() {
    // Когда компонент монтируется, делаем запрос к API
    this.fetchUserData();
  },
  methods: {
    // Функция для получения данных пользователя
    async fetchUserData() {
      try {
        const response = await axios.get('http://localhost:3000/api/user/profile');
        this.userData = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      }
    },
  },
};
</script>

<style scoped>

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.profile-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #FFFFFF;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-family: 'Cookie';
  font-style: normal;
  font-weight: 400;
  font-size: 34px;
  line-height: 38px;
  color: #000000;
  margin: 0;
}

.map-link {
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #D9D9D9;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-decoration: none;
}

.map-icon {
  width: 80%;
  height: 80%;
}

.map-link:hover {
  background-color: #A9A9A9;
}

.avatar-container {
  position: absolute;
  width: 204px;
  height: 235px;
  left: 11px;
  top: 123px;
  background: #D9D9D9;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  position: absolute;
  width: 330px;
  left: calc(50% - 330px / 2);
  top: 406px;
  font-family: 'Inter', sans-serif;
}

.username, .first-name, .description {
  margin: 10px 0;
  font-size: 20px;
}

.username {
  font-weight: bold;
}

.loading {
  font-size: 18px;
  color: #888;
}
</style>
