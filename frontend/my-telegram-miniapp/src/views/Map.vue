<template>
  <div class="map-container">
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  mounted() {
    // Ожидаем, пока Google Maps API загрузится
    if (typeof window !== 'undefined' && window.google) {
      this.loadMap();
    } else {
      // Ждем загрузки скрипта
      window.initMap = this.loadMap;
    }
  },
  methods: {
    loadMap() {
      // Создаем карту
      const map = new google.maps.Map(this.$refs.map, {
        center: { lat: 55.7558, lng: 37.6173 },
        zoom: 12,
      });

      // Добавляем маркер
      const marker = new google.maps.Marker({
        position: { lat: 55.7558, lng: 37.6173 },
        map: map,
        title: 'Москва',
      });
    },
  },
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
}
</style>
