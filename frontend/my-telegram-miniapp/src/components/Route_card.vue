<template>
  <div v-if="routeData.name" class="route-card" @click="goToRoute">
    <div class="route-card-content">
      <div class="route-card-image">
        <img :src="routeData.image_url || 'https://via.placeholder.com/150'" alt="Route Image" class="route-image"/>
      </div>
      <div class="route-card-text">
        <h3>{{ routeData.name }}</h3>
        <p>{{ routeData.description }}</p>
      </div>
    </div>
  </div>
  <div v-else class="loading">Загрузка маршрута...</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RouteCard',
  props: {
    routeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      routeData: {},
    };
  },
  mounted() {
    this.fetchRouteData();
  },
  methods: {
    async fetchRouteData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/routes/${this.routeId}`);
        this.routeData = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке данных маршрута:', error);
      }
    },
    goToRoute() {
      this.$router.push({ name: 'RouteInf', params: { id: this.routeId } });
    },
  },
};
</script>

<style scoped>
.route-card {
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 10px;
  overflow: hidden;
  height: 33%;
  box-sizing: border-box;
  cursor: pointer;
  transition: transform 0.2s;
}
.route-card:hover {
  transform: scale(1.01);
}
.route-card-content {
  display: flex;
  width: 100%;
  height: 100%;
}
.route-card-image {
  flex: 1;
  max-width: 150px;
  margin-right: 20px;
}
.route-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.route-card-text {
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-family: 'Work Sans', sans-serif;
  text-align: left;
}
.route-card-text h3 {
  font-size: 20px;
  margin: 0;
  color: #333;
}
.route-card-text p {
  font-size: 16px;
  color: #555;
}
</style>
