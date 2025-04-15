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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap');

body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
}

.route-inf {
  padding: 20px;
  font-family: 'Montserrat', sans-serif;
  color: #333;
}

.back-button {
  background: none;
  border: none;
  color: #3D348B;
  font-size: 1.2rem;
  cursor: pointer;
  margin-bottom: 20px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #7678ED;
}

.route-details {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.route-title {
  font-size: 1.8rem;
  margin-bottom: 10px;
  font-weight: 500;
}

.route-description {
  font-size: 1rem;
  margin-bottom: 10px;
}

.route-type,
.route-author {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 5px;
}

.route-type span,
.route-author span {
  font-weight: 400;
  color: #333;
}

.like-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.like-button {
  background: linear-gradient(to right, #7678ED, #3D348B);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.like-button:hover {
  background: linear-gradient(to right, #3D348B, #7678ED);
}

.map {
  height: 250px;
  width: 100%;
  border-radius: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.comments-section {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.comments-toggle,
.toggle-comment-form,
.submit-comment {
  background: linear-gradient(to right, #7678ED, #3D348B);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 50px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 0.95rem;
  transition: background 0.3s ease;
}

.comments-toggle:hover,
.toggle-comment-form:hover,
.submit-comment:hover {
  background: linear-gradient(to right, #3D348B, #7678ED);
}

.comments-list {
  margin-bottom: 15px;
}

.comment {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 20px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.comment-author {
  font-weight: 500;
  margin-bottom: 5px;
}

.comment-text {
  font-size: 0.95rem;
}

.comment-form textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #ffffff;
  resize: vertical;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem;
  margin-bottom: 10px;
  outline: none;
}
</style>

