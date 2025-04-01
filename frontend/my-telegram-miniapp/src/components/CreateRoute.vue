<template>
  <div class="create-route">
    <h1>Создать Маршрут</h1>
    <form @submit.prevent="createRoute">
      <div>
        <label for="name">Название:</label>
        <input type="text" id="name" v-model="name" />
        <div v-if="$v.name.$error">Name is required</div>
      </div>
      <div>
        <label for="description">Описание:</label>
        <textarea id="description" v-model="description"></textarea>
      </div>
      <div>
        <label for="type">Тип:</label>
        <select id="type" v-model="type">
          <option value="пеший">Пеший</option>
          <option value="велосипедный">Велосипедный</option>
          <option value="автомобильный">Автомобильный</option>
        </select>
      </div>
      <div>
        <label for="image_url">URL Изображения:</label>
        <input type="text" id="image_url" v-model="image_url">
      </div>

      <MapComponent @point-added="addPoint" />

      <h2>Точки Маршрута</h2>
      <ul>
        <li v-for="(point, index) in points" :key="index">
          Широта: {{ point.latitude }}, Долгота: {{ point.longitude }}
        </li>
      </ul>

      <button type="submit" :disabled="$v.$invalid">Создать Маршрут</button>
    </form>
  </div>
</template>

<script>
import api from '@/api/axios';
import MapComponent from './MapComponent.vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  components: {
    MapComponent
  },
  setup () {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      name: '',
      description: '',
      type: 'пеший',
      image_url: '',
      points: []
    };
  },
  validations () {
    return {
      name: { required },
      description: {  },
      type: {  },
      image_url: {  },
      points: {  }
    }
  },
  methods: {
    addPoint(point) {
      this.points.push(point);
    },
    async createRoute() {

      this.v$.$touch(); // Trigger validation
      if (this.v$.$invalid) {
        return;
      }

      try {
        const response = await api.post('/routes', {
          name: this.name,
          description: this.description,
          type: this.type,
          image_url: this.image_url,
          points: this.points
        });
        alert('Маршрут успешно создан!');
        this.$router.push('/routes/' + response.data.id);  // Перенаправляем на страницу маршрута
      } catch (error) {
        console.error(error);
        alert('Ошибка при создании маршрута.');
      }
    }
  }
};
</script>

<style scoped>
.create-route {
  padding: 20px;
}
</style>