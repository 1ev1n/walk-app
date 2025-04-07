import { createRouter, createWebHistory } from 'vue-router';
import Authorize from '../views/Authorize.vue';
import Profile from '../views/Profile.vue';
import Map from '../views/Map.vue';
import RouteInf from '../components/Route_inf.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'authorize',
      component: Authorize,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
    },
    {
      path: '/route/:id',
      name: 'RouteInf',
      component: RouteInf,
      props: true,
    },
  ],
});

export default router;
