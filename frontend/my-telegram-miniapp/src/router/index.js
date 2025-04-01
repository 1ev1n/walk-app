// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RouteList from '../components/RouteList.vue'
import RouteDetail from '../components/RouteDetail.vue'
import UserProfile from '../components/UserProfile.vue'
import CreateRoute from '../components/CreateRoute.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView // Компонент главной страницы
    },
    {
      path: '/routes',
      name: 'routes',
      component: RouteList // Компонент списка маршрутов
    },
    {
      path: '/routes/:id',
      name: 'routeDetail',
      component: RouteDetail, // Компонент деталей маршрута
      props: true // Позволяет получать id маршрута как prop в компоненте
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile // Компонент профиля пользователя
    },
    {
      path: '/create',
      name: 'createRoute',
      component: CreateRoute // Компонент создания маршрута
    }
  ]
})

export default router