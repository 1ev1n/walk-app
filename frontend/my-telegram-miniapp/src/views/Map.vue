<template>
  <div class="map-container">

    <div class="header">
      <h2 class="page-title">Walky</h2>
      <router-link to="/profile" class="profile-link">
        <img src="../assets/User.png" alt="User Icon" class="user-icon" />
      </router-link>
    </div>

    <!-- Карта или заглушка -->
    <div v-if="mapLoaded" ref="map" class="map"></div>
    <div v-else class="map-placeholder">
      <p>⚠️ Карта не загружена</p>
    </div>

    <RouteEdit v-if="showRouteEdit" @close="showRouteEdit = false" />
  </div>
</template>

<script>
import RouteEdit from "../components/Route_edit.vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "Map",
  components: { RouteEdit },
  data() {
    return {
      map: null,
      mapLoaded: false,
      showRouteEdit: false,
    };
  },
  mounted() {
    this.loadOpenStreetMap();
    this.checkEditRoute();
  },
  watch: {
    "$route.query": {
      handler() {
        this.checkEditRoute();
      },
      immediate: true,
    },
  },
  methods: {
    checkEditRoute() {
      this.showRouteEdit = this.$route.query.editRoute === "true";
    },
    loadOpenStreetMap() {
      this.mapLoaded = true;

      this.$nextTick(() => {
        if (!this.$refs.map) return;

        this.map = L.map(this.$refs.map).setView([55.7558, 37.6173], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
              '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        L.marker([55.7558, 37.6173])
            .addTo(this.map)
            .bindPopup("Москва")
            .openPopup();
      });
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

.map-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
}

/* Заголовок */
.header {
  top: 20px;
  left: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.header * {
  pointer-events: auto;
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

.profile-link {
  position: absolute;
  right: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-decoration: none;
}

.user-icon {
  width: 100%;
  height: 100%;
}

/* Карта */
.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Заглушка при отсутствии карты */
.map-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  color: #777;
  font-size: 18px;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

</style>
