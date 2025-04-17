<template>
  <div class="route-inf">
    <button @click="$router.back()" class="back-button">
      <img src="../assets/arrow.svg" class="arrow-icon" />
    </button>

    <div class="route-details">
      <h2 class="route-title">{{ routeData.name }}</h2>
      <p class="route-description">{{ routeData.description }}</p>
      <p class="route-type">
        Тип прогулки:
        <span v-for="(item, index) in parsedType" :key="index" class="type-tag">
          {{ item }}<span v-if="index !== parsedType.length - 1">, </span>
        </span>
      </p>
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
      <ul v-if="routeData.points && routeData.points.length > 0" style="list-style: none; padding-left: 0;">
        <li
            v-for="(point, index) in routeData.points"
            :key="index"
            :class="'point-bg-' + (index % 5)"
            class="point-item"
        >
          <span class="point-index">{{ index + 1 }}</span>
          <span class="point-coords">
            {{ Number(point.latitude).toFixed(5) }}, {{ Number(point.longitude).toFixed(5) }}
          </span>
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
          <p class="comment-author">{{ comment.username }}:</p>
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
      liked: false,
      map: null,
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
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        if (Array.isArray(this.routeData.type)) {
          return this.routeData.type;
        } else if (typeof this.routeData.type === 'string') {
          return this.routeData.type.split(',').map(item => item.trim());
        }
        return [];
      }
    },
  },
  async mounted() {
    await this.loadRouteData();
    await this.loadComments();
    await this.checkIfLiked();
    await this.loadLikeCount();
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
    async checkIfLiked() {
      try {
        const res = await axios.get(`http://localhost:3000/api/likes/${this.id}/hasliked`, {
          headers: {
            'Content-Type': 'application/json',
            'x-dev-user': 'true',
          },
        });
        this.liked = res.data.liked;
      } catch (err) {
        console.error('Ошибка при проверке лайка:', err);
      }
    },
    async loadLikeCount() {
      try {
        const res = await axios.get(`http://localhost:3000/api/likes/${this.id}/count`);
        this.routeData.likes = res.data.count;
      } catch (err) {
        console.error('Ошибка при загрузке количества лайков:', err);
      }
    },
    async toggleLike() {
      try {
        if (this.liked) {
          await axios.delete(`http://localhost:3000/api/likes/${this.id}`, {
            headers: {
              'Content-Type': 'application/json',
              'x-dev-user': 'true',
            },
          });
          this.liked = false;
          this.routeData.likes -= 1;
        } else {
          await axios.post(`http://localhost:3000/api/likes/${this.id}`, {}, {
            headers: {
              'Content-Type': 'application/json',
              'x-dev-user': 'true',
            },
          });
          this.liked = true;
          this.routeData.likes += 1;
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        console.error('Ошибка при отправке лайка:', message);
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
                  'Content-Type': 'application/json',
                  'x-dev-user': 'true',
                },
              }
          );
          const commentsResponse = await axios.get(`http://localhost:3000/api/comments/${this.id}`);
          this.routeData.comments = commentsResponse.data;
          this.newComment = '';
        } catch (err) {
          console.error('Ошибка при отправке комментария:', err);
        }
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
  background: linear-gradient(135deg, #F35B04, #F7B801); /* Градиентный фон */
  border: none;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease-in-out;
}

.arrow-icon {
  width: 24px;
  height: 24px;
  fill: white;
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
  list-style: none;
}

.point-item {
  padding: 6px 10px;
  margin-bottom: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}


.point-bg-0 { background-color: rgba(243, 91, 4, 0.2); }   /* #F35B04 */
.point-bg-1 { background-color: rgba(241, 135, 1, 0.2); }  /* #F18701 */
.point-bg-2 { background-color: rgba(247, 184, 1, 0.2); }  /* #F7B801 */
.point-bg-3 { background-color: rgba(118, 120, 237, 0.2); }/* #7678ED */
.point-bg-4 { background-color: rgba(61, 52, 139, 0.2); }  /* #3D348B */

.point-bg-0 .point-index { background-color: #F35B04; } /* #F35B04 */
.point-bg-1 .point-index { background-color: #F18701; } /* #F18701 */
.point-bg-2 .point-index { background-color: #F7B801; } /* #F7B801 */
.point-bg-3 .point-index { background-color: #7678ED; } /* #7678ED */
.point-bg-4 .point-index { background-color: #3D348B; } /* #3D348B */


.point-index {
  display: inline-block;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-right: 8px;
}

.point-coords {
  color: #666;
  font-family: monospace;
  font-size: 14px;
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
