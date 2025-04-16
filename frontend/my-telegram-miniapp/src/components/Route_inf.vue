<template>
  <div class="route-inf">
    <button @click="$router.back()" class="back-button"><img src="../assets/arrow.svg"></button>

    <div class="route-details">
      <h2 class="route-title">{{ routeData.name }}</h2>
      <p class="route-description">{{ routeData.description }}</p>
      <p class="route-type">Тип прогулки: <span>{{ parsedType }}</span></p>
      <p class="route-author">Автор маршрута: <span>{{ routeData.user_id }}</span></p>

      <!-- Лайк -->
      <div class="like-section">
        <button @click="toggleLike" class="like-button">
          {{ liked ? '💖' : '🤍' }}
        </button>
        <span>{{ routeData.likes }}</span>
      </div>
    </div>

    <!-- Карта маршрута -->
    <div id="map" class="map"></div>

    <!-- Вкладки -->
    <div class="tabs">
      <div class="selector" :style="{ left: selectorLeft }"></div>
      <a class="tab" :class="{ active: activeTab === 'points' }" @click="switchTab('points')">Точки</a>
      <a class="tab" :class="{ active: activeTab === 'comments' }" @click="switchTab('comments')">Комментарии</a>
    </div>

    <!-- Точки -->
    <div v-if="activeTab === 'points'" class="tab-content points-tab">
      <h3>Точки маршрута</h3>
      <ul v-if="routeData.points && routeData.points.length > 0">
        <li v-for="(point, index) in routeData.points" :key="index">
          Точка {{ index + 1 }}: [{{ Number(point.latitude).toFixed(5) }}, {{ Number(point.longitude).toFixed(5) }}]
        </li>
      </ul>
      <p v-else>Нет точек в этом маршруте.</p>
    </div>

    <!-- Комментарии -->
    <div v-if="activeTab === 'comments'" class="tab-content comments-section">
      <div class="comment-form">
        <textarea v-model="newComment" placeholder="Оставьте комментарий..." rows="1"></textarea>
        <button @click="submitComment" class="submit-comment">Отправить</button>
      </div>

      <div class="comments-list">
        <div v-for="comment in routeData.comments" :key="comment.id" class="comment">
          <p class="comment-author">{{ comment.author }}:</p>
          <p class="comment-text">{{ comment.text }}</p>
        </div>
      </div>
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
      routeData: {
        comments: [],
        likes: 0,
        points: [],
      },
      map: null,
      liked: false,
      newComment: '',
      activeTab: 'points',
    };
  },
  computed: {
    selectorLeft() {
      return this.activeTab === 'points' ? '0%' : '50%';
    },
    parsedType() {
      try {
        const parsed = JSON.parse(this.routeData.type);
        return Array.isArray(parsed) ? parsed.join(', ') : parsed;
      } catch {
        return this.routeData.type;
      }
    },
  },
  async mounted() {
    await this.loadRouteData();
    await this.loadComments(); // 👈 Добавлено
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
    async loadComments() {
      try {
        const res = await axios.get(`http://localhost:3000/api/comments/${this.id}`);
        this.routeData.comments = res.data;
      } catch (err) {
        console.error('Ошибка загрузки комментариев:', err);
      }
    },
    initMap() {
      this.map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
    },
    addRoutePoints() {
      if (!this.routeData.points || this.routeData.points.length === 0) return;

      const latlngs = this.routeData.points.map(p => [p.latitude, p.longitude]);
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
    async submitComment() {
      if (this.newComment.trim()) {
        try {
          const token = localStorage.getItem('token');
          const newCommentData = {
            text: this.newComment,
            author: 'Аноним',
          };
          await axios.post(
              `http://localhost:3000/api/comments/${this.id}`,
              newCommentData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
          );
          // После успешного добавления — обновить список комментариев:
          const commentsResponse = await axios.get(`http://localhost:3000/api/comments/${this.id}`);
          this.routeData.comments = commentsResponse.data;
          this.newComment = '';
        } catch (err) {
          console.error('Ошибка при отправке комментария:', err);
        }
      }
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
  },
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
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #7678ED;
}

.route-details {
  padding: 10px 20px;
  border-radius: 30px;
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
  width: 50%;
  height: 100%;
  border-radius: 50px;
  z-index: 1;
  background: linear-gradient(45deg, #F35B04 0%, #7678ED 100%);
  transition: left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tab-content {
  padding: 20px;
  border-radius: 30px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.points-tab ul {
  padding-left: 20px;
}

.comment-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.comment-form textarea {
  resize: none;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  font-family: 'Montserrat', sans-serif;
}

.submit-comment {
  background: linear-gradient(to right, #7678ED, #3D348B);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 50px;
  cursor: pointer;
  align-self: flex-start;
}

.comments-list .comment {
  margin-bottom: 15px;
}

.comment-author {
  font-weight: bold;
  margin-bottom: 5px;
}

.comment-text {
  margin-left: 10px;
}
</style>
