<template>
  <div class="route-feed">
    <template v-if="routes.length">
      <RouteCard v-for="route in routes" :key="route.id" :routeId="route.id" />
    </template>
    <template v-else>
      <p>Здесь пока пусто...</p>
    </template>
  </div>
</template>

<script>
import RouteCard from './Route_card.vue';
import axios from 'axios';

export default {
  name: 'RouteFeed',
  components: { RouteCard },
  props: {
    tab: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      routes: []
    };
  },
  watch: {
    tab: {
      immediate: true,
      handler(newTab) {
        this.fetchRoutes(newTab);
      }
    }
  },
  methods: {
    async fetchRoutes(tab) {
      try {
        let endpoint = '';
        if (tab === 'favorites') {
          endpoint = 'http://localhost:3000/api/favorites';
        } else if (tab === 'my') {
          endpoint = 'http://localhost:3000/api/routes/user';
        } else if (tab === 'feed') {
          endpoint = 'http://localhost:3000/api/routes';
        }

        const response = await axios.get(endpoint, {
          headers: { 'x-dev-user': 'true' }
        });
        this.routes = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке маршрутов:', error);
      }
    }
  }
};
</script>

<style scoped>
.route-feed {
  margin-top: 20px;
}
</style>
