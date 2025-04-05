<template>
  <div class="profile-menu">
    <!-- ВКЛАДКИ -->
    <div class="tabs">
      <div class="selector" :style="{ left: selectorLeft }"></div>
      <a
          class="tab"
          :class="{ active: activeTab === 'favorites' }"
          @click="$emit('changeTab', 'favorites')"
      >
        Избранное
      </a>
      <a
          class="tab"
          :class="{ active: activeTab === 'my' }"
          @click="$emit('changeTab', 'my')"
      >
        Моё
      </a>
      <a
          class="tab"
          :class="{ active: activeTab === 'feed' }"
          @click="$emit('changeTab', 'feed')"
      >
        Лента
      </a>
    </div>

    <div class="card-container" v-if="activeTab === 'feed'">
      <RouteFeed :tab="activeTab" :userData="userData" />
    </div>

    <div v-if="activeTab === 'my'" class="button-container">
      <button class="add-route" @click="goToRouteEdit">+</button>
    </div>
  </div>
</template>

<script>
import RouteFeed from './Route_Feed.vue';

export default {
  name: 'ProfileMenu',
  components: {
    RouteFeed: RouteFeed
  },
  props: {
    activeTab: String,
    userData: Object
  },
  methods: {
    goToRouteEdit() {
      this.$router.push('/map');
    }
  },
  computed: {
    selectorLeft() {
      switch (this.activeTab) {
        case 'favorites': return '0%';
        case 'my': return '33.33%';
        case 'feed': return '66.66%';
        default: return '0%';
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');

.profile-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  background-color: #fff;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.tabs {
  position: relative;
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: 50px;
  padding: 5px;
  width: 90%;
  max-width: 500px;
  margin: 10px auto 5px;
  z-index: 2;
}

.tab {
  text-decoration: none;
  color: #777;
  text-transform: uppercase;
  padding: 10px 20px;
  flex: 1;
  text-align: center;
  z-index: 2;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

.tab.active {
  color: #fff;
  font-weight: bold;
}

.selector {
  position: absolute;
  top: 0;
  left: 0;
  width: 33.33%;
  height: 100%;
  border-radius: 50px;
  z-index: 1;
  background: linear-gradient(45deg, #F35B04 0%, #7678ED 100%);
  transition: left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.card-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px 20px 70px;
  box-sizing: border-box;
  width: 100%;
}

.button-container {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
}

.add-route {
  font-size: 28px;
  font-weight: 570;
  background: linear-gradient(45deg, #7678ED 0%, #3D348B 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
