<template>
  <div class="route-edit">
    <h2>Создать маршрут</h2>

    <form @submit.prevent="saveRoute">
      <label>
        Название маршрута:
        <input v-model="route.name" type="text" required />
      </label>

      <label>
        Описание:
        <textarea v-model="route.description" required></textarea>
      </label>

      <label>
        Тип прогулки:
        <select v-model="route.type" required>
          <option value="пешая">Пешая</option>
          <option value="велосипедная">Велосипедная</option>
          <option value="авто">Авто</option>
        </select>
      </label>

      <label>
        Превью (URL):
        <input v-model="route.image_url" type="url" required />
      </label>

      <div class="likes-comments">
        <button type="button" @click="toggleLike">
          ❤️ {{ likes }}
        </button>
      </div>

      <div id="map" class="map"></div>
      <button type="button" @click="addingPoint = true">Добавить точку</button>

      <button type="submit">Сохранить</button>
      <button type="button" @click="$emit('close')">Отмена</button>
    </form>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'RouteEdit',
  data() {
    return {
      route: {
        name: '',
        description: '',
        type: '',
        image_url: '',
        coordinates: [],
      },
      likes: 0,
      map: null,
      addingPoint: false,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      this.map.on('click', (e) => {
        if (this.addingPoint) {
          const { lat, lng } = e.latlng;
          this.route.coordinates.push({ lat, lng });
          L.marker([lat, lng]).addTo(this.map);
          this.addingPoint = false;
        }
      });
    },
    toggleLike() {
      this.likes += 1;
    },
    saveRoute() {
      console.log('Сохранение маршрута:', this.route);
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.route-edit {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90%;
  max-height: 90%;
  background: white;
  padding: 20px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

h2 {
  margin-top: 0;
}

form {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: start;
}

input,
textarea,
select {
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 10px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

button:last-child {
  background: #d9534f;
}

button:last-child:hover {
  background: #c9302c;
}

.map {
  height: 300px;
  width: 100%;
  margin: 20px 0;
  border-radius: 10px;
}

.likes-comments {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
