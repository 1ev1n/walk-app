<template>
  <div class="route-inf">
    <!-- Кнопка Назад -->
    <button @click="$router.back()" class="back-button">← Назад</button>

    <div class="route-details">
      <h2 class="route-title">{{ routeData.name }}</h2>
      <p class="route-description">{{ routeData.description }}</p>
      <p class="route-type">Тип прогулки: <span>{{ routeData.type }}</span></p>
      <p class="route-author">Автор маршрута: <span>{{ routeData.user_id }}</span></p>

      <!-- Лайк -->
      <div class="like-section">
        <button @click="toggleLike" class="like-button">
          {{ liked ? '💖 Лайкнут' : '🤍 Лайкнуть' }}
        </button>
        <span>{{ routeData.likes }} Лайков</span>
      </div>
    </div>

    <!-- Карта маршрута -->
    <div id="map" class="map"></div>

    <!-- Комментарии -->
    <div class="comments-section">
      <button @click="toggleComments" class="comments-toggle">
        {{ showComments ? 'Скрыть комментарии' : 'Посмотреть комментарии' }}
      </button>

      <div v-if="showComments" class="comments-list">
        <div v-for="comment in routeData.comments" :key="comment.id" class="comment">
          <p class="comment-author">{{ comment.author }}:</p>
          <p class="comment-text">{{ comment.text }}</p>
        </div>
      </div>

      <div class="comment-form" v-if="showCommentForm">
        <textarea v-model="newComment" placeholder="Оставьте комментарий..." rows="4"></textarea>
        <button @click="submitComment" class="submit-comment">Отправить</button>
      </div>

      <button @click="showCommentForm = !showCommentForm" class="toggle-comment-form">
        {{ showCommentForm ? 'Отменить' : 'Добавить комментарий' }}
      </button>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default {
  name: 'RouteInf',
  props: ['id'],
  data() {
    return {
      routeData: {},
      map: null,
      liked: false, // Для отслеживания состояния лайка
      newComment: '',
      showComments: false,
      showCommentForm: false
    };
  },
  async mounted() {
    await this.loadRouteData();
    this.initMap();
    this.addRoutePoints();
  },
  methods: {
    async loadRouteData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/routes/${this.id}`);
        this.routeData = response.data;
      } catch (err) {
        console.error('Ошибка загрузки маршрута:', err);
      }
    },
    initMap() {
      this.map = L.map('map').setView([51.505, -0.09], 13); // Инициализация карты с дефолтным центром
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
    },
    addRoutePoints() {
      if (!this.routeData.coordinates || this.routeData.coordinates.length === 0) return;

      const latlngs = this.routeData.coordinates.map(coord => [coord.lat, coord.lng]);
      latlngs.forEach(([lat, lng]) => {
        L.marker([lat, lng]).addTo(this.map);
      });
      L.polyline(latlngs, { color: 'red' }).addTo(this.map);
      this.map.fitBounds(latlngs);
    },
    toggleLike() {
      this.liked = !this.liked;
      this.routeData.likes += this.liked ? 1 : -1;
      this.updateLikeStatus();
    },
    async updateLikeStatus() {
      try {
        await axios.post(`http://localhost:3000/api/routes/${this.id}/like`, { liked: this.liked });
      } catch (err) {
        console.error('Ошибка при обновлении лайка:', err);
      }
    },
    toggleComments() {
      this.showComments = !this.showComments;
    },
    async submitComment() {
      if (this.newComment.trim()) {
        try {
          const newCommentData = {
            text: this.newComment,
            author: 'Аноним' // Можете заменить на реального пользователя
          };
          await axios.post(`http://localhost:3000/api/routes/${this.id}/comments`, newCommentData);
          this.routeData.comments.push(newCommentData); // Добавить комментарий локально
          this.newComment = ''; // Очистить поле
        } catch (err) {
          console.error('Ошибка при отправке комментария:', err);
        }
      }
    }
  }
};
</script>

<style scoped>
.route-inf {
  padding: 20px;
  font-family: 'Work Sans', sans-serif;
}

.back-button {
  background: #f1f1f1;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
}

.route-details {
  margin-bottom: 20px;
}

.route-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.route-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.route-type, .route-author {
  font-size: 14px;
  color: #888;
}

.route-type span, .route-author span {
  font-weight: bold;
  color: #333;
}

.like-section {
  margin-top: 20px;
}

.like-button {
  background: none;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.comments-section {
  margin-top: 30px;
}

.comments-toggle {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.comments-list {
  margin-top: 20px;
}

.comment {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
}

.comment-text {
  font-size: 14px;
  color: #555;
}

.comment-form {
  margin-top: 20px;
}

.comment-form textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.submit-comment {
  padding: 8px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.toggle-comment-form {
  margin-top: 20px;
  padding: 8px 12px;
  background-color: #ffc107;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.map {
  height: 500px;
  width: 100%;
  border-radius: 10px;
  margin-top: 20px;
}
</style>
