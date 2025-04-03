<template>
  <div class="profile-menu">
    <div class="tabs">
      <div
          class="tab"
          :class="{ active: activeTab === 'favorites' }"
          @click="setActiveTab('favorites')"
      >
        Избранное
      </div>
      <div
          class="tab"
          :class="{ active: activeTab === 'my' }"
          @click="setActiveTab('my')"
      >
        Моё
      </div>
      <div
          class="tab"
          :class="{ active: activeTab === 'feed' }"
          @click="setActiveTab('feed')"
      >
        Лента
      </div>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'favorites'" class="content">
        <template v-if="favoriteRoutes.length">
          <RouteCard v-for="route in favoriteRoutes" :key="route.id" :routeId="route.id" />
        </template>
        <template v-else>
          <p>Тыкни лайк и тут что-то появится</p>
        </template>
      </div>

      <div v-if="activeTab === 'my'" class="content">
        <template v-if="myRoutes.length">
          <RouteCard v-for="route in myRoutes" :key="route.id" :routeId="route.id" />
        </template>
        <template v-else>
          <p>Тыкни лайк и тут что-то появится</p>
        </template>
      </div>

      <div v-if="activeTab === 'feed'" class="content">
        <template v-if="feedRoutes.length">
          <RouteCard v-for="route in feedRoutes" :key="route.id" :routeId="route.id" />
        </template>
        <template v-else>
          <p>Тыкни лайк и тут что-то появится</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import RouteCard from './Route_card.vue';
import axios from 'axios';

export default {
  name: 'ProfileMenu',
  components: {
    RouteCard,
  },
  data() {
    return {
      activeTab: 'my', // Начальная активная вкладка
      favoriteRoutes: [],
      myRoutes: [],
      feedRoutes: [],
    };
  },

  mounted() {
    this.fetchRoutes(); // Загружаем маршруты при монтировании
  },
  methods: {

    setActiveTab(tab) {
      this.activeTab = tab; // Меняем активную вкладку при клике
    },

    async fetchRoutes() {
      try {
        const favoritesResponse = await axios.get('http://localhost:3000/api/routes/favorites');
        this.favoriteRoutes = favoritesResponse.data;

        const myResponse = await axios.get('http://localhost:3000/api/routes/my');
        this.myRoutes = myResponse.data;

        const feedResponse = await axios.get('http://localhost:3000/api/routes/feed');
        this.feedRoutes = feedResponse.data;
      } catch (error) {
        console.error('Ошибка при загрузке данных маршрутов:', error);
      }
    },
  },
};
</script>

<style scoped>
.profile-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60vh; /* 3/5 экрана */
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
}

.tab {
  cursor: pointer;
  padding: 10px 20px;
  margin-right: 20px;
  background-color: #f4f4f4;
  border-radius: 5px;
  text-align: center;
  font-size: 18px;
}

.tab.active {
  background-color: #D9D9D9;
  font-weight: bold;
}

.tab-content {
  padding: 20px;
  overflow-y: auto;
}

.content {
  display: flex;
  flex-direction: column;
}

.content p {
  font-size: 18px;
  color: #777;
  text-align: center;
  margin-top: 20px;
}
</style>
