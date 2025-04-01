<template>
  <div class="route-list">
    <h1>Список Маршрутов</h1>
    <input type="text" v-model="searchQuery" placeholder="Поиск...">
    <ul>
      <li v-for="route in filteredRoutes" :key="route.id">
        <router-link :to="'/routes/' + route.id">{{ route.name }}</router-link>
      </li>
    </ul>
    <button @click="goToCreateRoute">Создать маршрут</button>
  </div>
</template>

<script>
import api from '@/api/axios';

export default {
  data() {
    return {
      routes: [],
      searchQuery: ''
    };
  },
  async mounted() {
    try {
      const response = await api.get('/routes');
      this.routes = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  computed: {
    filteredRoutes() {
      return this.routes.filter(route => {
        return route.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    goToCreateRoute() {
      this.$router.push('/create');
    }
  }
};
</script>

<style scoped>
.route-list {
  padding: 20px;
}
</style>