<template>
  <div class="map-container">
    <l-map :center="center" :zoom="zoom" style="height: 400px" @click="mapClicked">
      <l-tile-layer :url="tileUrl" :attribution="tileAttribution" />
      <l-marker v-for="(point, index) in points" :key="index" :lat-lng="[point.latitude, point.longitude]" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  props: {
    points: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      center: [51.505, -0.09], // London
      zoom: 13,
      tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  methods: {
    mapClicked(event) {
      const latLng = event.latlng;
      this.$emit('point-added', { latitude: latLng.lat, longitude: latLng.lng });
    }
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
}
</style>