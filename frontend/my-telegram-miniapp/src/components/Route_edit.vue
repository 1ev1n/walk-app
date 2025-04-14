<template>
  <div class="route-edit">
    <div class="route-edit-header">
      <button class="back-button" @click="$emit('close')">← Назад</button>
      <h2>Создать маршрут</h2>
    </div>

    <form @submit.prevent="saveRoute">
      <label>
        Название маршрута:
        <input v-model="route.name" type="text" required maxlength="255" />
      </label>

      <label>
        Описание:
        <textarea v-model="route.description" required></textarea>
      </label>

      <label>
        Тип прогулки:
        <div>
          <select v-model="selectedType" multiple>
            <option value="пешая">Пешая</option>
            <option value="велосипедная">Велосипедная</option>
            <option value="авто">Авто</option>
          </select>

          <div class="add-type">
            <input v-model="newType" type="text" placeholder="Добавить новый тип" />
            <button type="button" @click="addCustomType" :disabled="!newType || route.type.includes(newType)">
              Добавить тип
            </button>
          </div>
        </div>
      </label>

      <label>
        Превью (URL):
        <input v-model="route.image_url" type="url" required />
      </label>

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
import axios from 'axios';

export default {
  name: 'RouteEdit',
  data() {
    return {
      route: {
        name: '',
        description: '',
        type: [],
        image_url: '',
        coordinates: [],
      },
      likes: 0,
      map: null,
      addingPoint: false,
      selectedType: [],
      newType: '',
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
          this.updateRoute();
        }
      });
    },

    updateRoute() {
      if (this.route.coordinates.length > 1) {
        const latlngs = this.route.coordinates.map(coord => [coord.lat, coord.lng]);
        L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
        this.map.fitBounds(latlngs);
      }
    },

    addCustomType() {
      if (this.newType && !this.route.type.includes(this.newType)) {
        this.route.type.push(this.newType);
        this.newType = '';
      }
    },

    async saveRoute() {
      try {
        const response = await axios.post('http://localhost:3000/api/routes', this.route);
        console.log('Маршрут сохранен:', response.data);
        this.$emit('close');
      } catch (err) {
        console.error('Ошибка при сохранении маршрута:', err);
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500&display=swap');

body {
  font-family: 'Work Sans', sans-serif;
}

.route-edit {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.route-edit-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.back-button:hover {
  text-decoration: underline;
}

h2 {
  margin: 0;
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

.add-type {
  margin-top: 10px;
}

.add-type input {
  margin-right: 10px;
}
</style>
