<template>
  <div class="menu-container">

    <div class="tag-scroll">
      <div class="selector" :style="{ left: selectorLeft }"></div>
      <button
          v-for="tag in tags"
          :key="tag"
          class="tag-button"
          @click="changeTag(tag)"
          :class="{ active: activeTag === tag }"
      >
        {{ tag }}
      </button>
    </div>

    <div class="card-container">
      <RouteFeed :tab="activeTag" :routes="filteredRoutes" :userData="userData" />
      <p v-if="filteredRoutes.length === 0">Нет маршрутов с таким тегом</p>
    </div>

  </div>
</template>

<script>
import RouteFeed from './Route_Feed.vue';

export default {
  name: 'MapMenu',
  components: {
    RouteFeed
  },
  props: {
    routes: {
      type: Array,
      required: true
    },
    userData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log('Received routes:', this.routes);
  },
  data() {
    return {
      activeTag: 'all'
    };
  },
  computed: {
    tags() {
      const tagSet = new Set();
      this.routes.forEach(route => {
        route.tags.forEach(tag => tagSet.add(tag));
      });
      return ['all', ...Array.from(tagSet)];
    },

    filteredRoutes() {
      if (this.activeTag === 'all') return this.routes;
      return this.routes.filter(route => route.tags.includes(this.activeTag));
    },

    selectorLeft() {
      const index = this.tags.indexOf(this.activeTag);
      if (index === -1) return '0%';
      return `${(index / this.tags.length) * 100}%`;
    }
  },
  methods: {
    changeTag(tag) {
      this.activeTag = tag;
    }
  }
};
</script>


<style scoped>

.menu-container {
  bottom: 10px;
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
  font-family: 'Work Sans', sans-serif;
  flex: 0 0 auto;
  padding: 6px 12px;
  border: none;
  background-color: #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.tag-button.active {
  background-color: #4caf50;
  color: white;
}

.card-container {
  background: white;
  flex: 1;
  overflow-y: auto;
  padding: 10px 20px;
  box-sizing: border-box;
  width: 100%;
  max-height: 100%;
  border-radius: 20px;
}

.routes-list p {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin: 0;
}
</style>
