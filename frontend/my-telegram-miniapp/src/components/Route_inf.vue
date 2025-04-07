<template>
  <div class="route-inf">
    <button @click="$router.back()" class="back-button">← Назад</button>
    <h2>{{ routeData.name }}</h2>
    <p>{{ routeData.description }}</p>
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default {
  name: 'RouteInf',
  props: ['id'],
  data() {
    return {
      routeData: {},
      map: null,
    };
  },
  async mounted() {
    await this.loadRouteData();
    this.initMap();
    this.addRoutePoints();
  },
  methods: {
    async loadRouteData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/routes/${this.id}`);
        this.routeData = response.data;
      } catch (err) {
        console.error('Ошибка загрузки маршрута:', err);
      }
    },
    initMap() {
      this.map = L.map('map').setView([51.505, -0.09], 13); // default center
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
    },
    addRoutePoints() {
      if (!this.routeData.coordinates || this.routeData.coordinates.length === 0) return;

      const latlngs = this.routeData.coordinates.map(coord => [coord.lat, coord.lng]);

      latlngs.forEach(([lat, lng]) => {
        L.marker([lat, lng]).addTo(this.map);
      });

      L.polyline(latlngs, { color: 'red' }).addTo(this.map);
      this.map.fitBounds(latlngs);
    }
  }
};
</script>

<style scoped>
.route-inf {
  padding: 20px;
  font-family: 'Work Sans', sans-serif;
}
.back-button {
  background: #f1f1f1;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  margin-bottom: 10px;
}
.map {
  height: 500px;
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
}
</style>
