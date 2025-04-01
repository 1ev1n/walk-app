<template>
  <div class="route-detail">
    <div v-if="route">
      <h1>{{ route.name }}</h1>
      <img :src="route.image_url" alt="Изображение маршрута" v-if="route.image_url">
      <p>Описание: {{ route.description }}</p>
      <p>Тип: {{ route.type }}</p>

      <MapComponent :points="route.points" />

      <h2>Комментарии</h2>
      <ul>
        <li v-for="comment in comments" :key="comment.id">
          {{ comment.text }}
        </li>
      </ul>
      <button @click="likeRoute" :disabled="isLiking">Лайкнуть</button>
      <span v-if="hasLiked">Вы лайкнули этот маршрут</span>
      <span v-else>Лайкните этот маршрут</span>
      <span>{{ likesCount }} Лайков</span>
    </div>
    <div v-else>
      Загрузка маршрута...
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';
import MapComponent from './MapComponent.vue';

export default {
  components: {
    MapComponent
  },
  props: ['id'], // ID маршрута передается как prop
  data() {
    return {
      route: null,
      comments: [],
      likesCount: 0,
      hasLiked: false,
      isLiking: false
    };
  },
  async mounted() {
    try {
      const response = await api.get(`/routes/${this.id}`);
      this.route = response.data;

      const commentsResponse = await api.get(`/comments/${this.id}`);
      this.comments = commentsResponse.data;

      const likesResponse = await api.get(`/likes/${this.id}/count`);
      this.likesCount = likesResponse.data.count;

      const hasLikedResponse = await api.get(`/likes/${this.id}/hasliked`);
      this.hasLiked = hasLikedResponse.data.liked;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async likeRoute() {
      this.isLiking = true;
      try {
        await api.post(`/likes/${this.id}`);
        this.likesCount++;
        this.hasLiked = true;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLiking = false;
      }
    }
  }
};
</script>

<style scoped>
.route-detail {
  padding: 20px;
}
</style>