<template>
  <div class="menu-container">
    <!-- Отображение данных тегов с отладочными сообщениями -->
    <div class="tag-scroll">
      <button
          v-for="tag in tags"
          :key="tag"
          class="tag-button"
          @click="filterRoutesByTag(tag)"
          :class="{ active: isTagActive(tag) }"
      >
        {{ tag }}
      </button>
      <button
          class="tag-button"
          @click="filterRoutesByTag('all')"
          :class="{ active: isTagActive('all') }"
      >
        All
      </button>
    </div>

    <div class="card-container">
      <!-- Вывод отфильтрованных маршрутов -->
      <RouteFeed :tab="activeTag" :routes="filteredRoutes" :userData="userData" />
    </div>

    <p v-if="filteredRoutes.length === 0">Нет маршрутов с таким тегом</p>
  </div>
</template>

<script>
import RouteFeed from './Route_Feed.vue';

export default {
  name: 'MapMenu',
  components: { RouteFeed },
  props: {
    routes: Array, // Данные маршрутов
  },
  data() {
    return {
      filteredRoutes: this.routes,
      tags: this.extractTagsFromRoutes(this.routes),
      activeTag: 'all',
    };
  },
  watch: {
    routes(newRoutes) {
      this.filteredRoutes = newRoutes;
      this.tags = this.extractTagsFromRoutes(newRoutes);
      console.log('Маршруты обновлены в MapMenu:', newRoutes); // Отладка
    }
  },
  methods: {
    extractTagsFromRoutes(routes) {
      const tags = new Set();
      routes.forEach(route => {
        route.tags.forEach(tag => tags.add(tag));
      });
      return ['all', ...Array.from(tags)];
    },

    filterRoutesByTag(tag) {
      this.activeTag = tag;
      if (tag === 'all') {
        this.filteredRoutes = this.routes;
      } else {
        this.filteredRoutes = this.routes.filter(route =>
            route.tags.includes(tag)
        );
      }
    },

    isTagActive(tag) {
      return this.activeTag === tag;
    }
  }
};
</script>

<style scoped>
.menu-container {
  background-color: #ffffffee;
  backdrop-filter: blur(5px);
  padding: 10px;
  border-bottom: 1px solid #ddd;
  position: relative;
  z-index: 1001;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tag-scroll {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
  gap: 8px;
  flex-wrap: nowrap;
}

.tag-button {
  flex: 0 0 auto;
  padding: 6px 12px;
  border: none;
  background-color: #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.tag-button:hover {
  background-color: #d1d1d1;
}

.tag-button.active {
  background-color: #4caf50;
  color: white;
}

.card-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px 20px;
  box-sizing: border-box;
  width: 100%;
  max-height: 100%;
}

.routes-list p {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin: 0;
}
</style>
