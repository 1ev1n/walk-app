<template>
  <div class="route-edit">
    <div class="page-container">
      <form @submit.prevent="saveRoute" class="scrollable-form">
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
          <div class="type-container">
            <div
                v-for="(type, index) in route.type"
                :key="index"
                class="type-tag"
            >
              {{ type }}
              <span class="remove-type" @click="removeType(index)">×</span>
            </div>

            <div v-if="showNewTypeInput" class="new-type-input">
              <input v-model="newType" type="text" @keyup.enter="addCustomType" />
              <button type="button" @click="addCustomType" :disabled="!newType">✓</button>
            </div>

            <button type="button" class="add-type-button" @click="showNewTypeInput = true" v-if="!showNewTypeInput">＋</button>
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
      map: null,
      addingPoint: false,
      newType: '',
      showNewTypeInput: false,
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
      const trimmed = this.newType.trim();
      if (trimmed && !this.route.type.includes(trimmed)) {
        this.route.type.push(trimmed);
        this.newType = '';
        this.showNewTypeInput = false;
      }
    },

    removeType(index) {
      this.route.type.splice(index, 1);
    },

    async saveRoute() {
      try {
        const points = this.route.coordinates.map(coord => ({
          latitude: coord.lat,
          longitude: coord.lng,
        }));

        const payload = {
          name: this.route.name,
          description: this.route.description,
          type: this.route.type.length === 1 ? this.route.type[0] : JSON.stringify(this.route.type),
          imageUrl: this.route.image_url,
          points,
        };

        console.log("📦 Sending route:", payload);

        const response = await axios.post(
            'http://localhost:3000/api/routes',
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                'x-dev-user': 'true'
              }
            }
        );

        console.log('✅ Маршрут сохранен:', response.data);
        this.$emit('close');
      } catch (err) {
        console.error('❌ Ошибка при сохранении маршрута:', err);
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap');

body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
}

.route-edit {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  padding-top:55px;
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
}

.scrollable-form {
  overflow-y: auto;
  max-height: calc(100vh - 70px);
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  font-weight: 300;
}

input,
textarea,
select {
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 10px 15px;
  width: 85%;
  border: 1px solid #ccc;
  border-radius: 50px;
  background-color: #f2f2f2;
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  outline: none;
}

button {
  margin-top: 10px;
  padding: 10px;
  background: linear-gradient(to right, #7678ED, #3D348B);
  color: white;
  border: none;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  border-radius: 50px;
}


button:last-child {
  background: linear-gradient(to right, #F35B04, #F18701, #F7B801);
}

.map {
  height: 250px;
  width: 100%;
  margin: 20px 0;
  border-radius: 50px;
}

.type-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.type-tag {
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 0.9rem;
}

.remove-type {
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
}

.add-type-button {
  background-color: #7678ED;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  height: 36px;
  width: 36px;
}

.new-type-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-type-input input {
  width: 150px;
  border-radius: 20px;
  padding: 5px 10px;
}

.new-type-input button {
  border-radius: 20px;
  padding: 5px 10px;
}
</style>
