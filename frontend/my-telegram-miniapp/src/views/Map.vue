<template>
  <div class="map-container">
    <!-- Верхняя панель -->
    <div class="header">
      <h1 class="page-title">Walky</h1>
      <router-link to="/profile" class="profile-link">
        <img src="../assets/icons/avatar.png" alt="Profile" class="profile-icon" />
      </router-link>
    </div>

    <!-- Карта или заглушка -->
    <div v-if="mapLoaded" ref="map" class="map"></div>
    <div v-else class="map-placeholder">
      <p>⚠️ Карта не загружена</p>
    </div>

    <!-- Форма редактирования маршрута -->
    <RouteEdit v-if="showRouteEdit" @close="showRouteEdit = false" />
  </div>
</template>

<script>
import RouteEdit from "../components/Route_edit.vue";

export default {
  name: "Map",
  components: { RouteEdit },
  data() {
    return {
      mapLoaded: false, // Флаг загрузки карты
      showRouteEdit: false, // Флаг показа формы редактирования
    };
  },
  mounted() {
    this.loadGoogleMaps();
    this.checkEditRoute();
  },
  watch: {
    "$route.query": {
      handler() {
        this.checkEditRoute();
      },
      immediate: true, // Проверить при загрузке страницы
    },
  },
  methods: {
    checkEditRoute() {
      this.showRouteEdit = this.$route.query.editRoute === "true";
    },

    loadGoogleMaps() {
      if (window.google && window.google.maps) {
        this.initMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        this.mapLoaded = true;
        this.initMap();
      };

      script.onerror = () => {
        console.error("Ошибка загрузки Google Maps API");
        this.mapLoaded = false;
      };
    },

    initMap() {
      if (!this.$refs.map) return;
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: 55.7558, lng: 37.6173 },
        zoom: 12,
      });

      new google.maps.Marker({
        position: { lat: 55.7558, lng: 37.6173 },
        map: this.map,
        title: "Москва",
      });
    },
  },
};
</script>

<style scoped>
/* Контейнер карты */
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

/* Верхняя панель */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 10;
}

/* Логотип */
.page-title {
  font-family: "Cookie";
  font-style: normal;
  font-weight: 400;
  font-size: 34px;
  line-height: 38px;
  color: #000000;
  margin: 0;
}

/* Кнопка профиля */
.profile-link {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d9d9d9;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-decoration: none;
}

.profile-icon {
  width: 80%;
  height: 80%;
}

.profile-link:hover {
  background-color: #a9a9a9;
}

/* Карта */
.map {
  width: 100%;
  height: 100%;
}

/* Заглушка при отсутствии карты */
.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  color: #777;
  font-size: 18px;
  border: 1px dashed #ccc;
}
</style>
