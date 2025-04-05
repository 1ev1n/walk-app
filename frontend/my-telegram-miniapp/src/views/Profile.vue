<template>
  <div class="profile-container">

    <div class="header">
      <h2 class="page-title">Walky</h2>
      <router-link to="/map" class="map-link">
        <img src="../assets/Map.png" alt="Map Icon" class="map-icon" />
      </router-link>
    </div>

    <div v-if="userData" class="profile-content">
      <div class="profile-info">
        <div class="avatar-container">
          <img :src="userData.image_url" alt="Avatar" class="avatar" />
        </div>
        <div class="user-info">
          <p class="username">{{ userData.username }}</p>
          <p class="first-name">{{ userData.first_name }}</p>
          <p class="description">{{ userData.description }}</p>
        </div>
      </div>

      <ProfileMenu :activeTab="activeTab" :userData="userData" @changeTab="activeTab = $event" />
    </div>

    <div v-else class="loading">
      <p>Загрузка данных...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProfileMenu from "../components/Profile_menu.vue";

export default {
  name: 'Profile',
  components: { ProfileMenu },
  data() {
    return {
      userData: null,
      activeTab: 'my'
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await axios.get('http://localhost:3000/api/users/profile', {
          headers: { 'x-dev-user': 'true' }
        });
        this.userData = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      }
    }
  }
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-decoration: none;
}

.map-icon {
  width: 100%;
  height: 100%;
}

.profile-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  flex-direction: column;
}

/* Аватарка */
.avatar-container {
  height: 40%;
  background: #D9D9D9;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 5px;
}

.avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  font-family: 'Work Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.username, .first-name, .description {
  margin: 5px 0;
  font-size: 18px;
}

.username {
  font-size: 4vh;
  font-weight: 700;
}

.first-name {
  font-size: 3svh;
}

.description {
  font-size: 2vh;
  color: #555555;
}

</style>
