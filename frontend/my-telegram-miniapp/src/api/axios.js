import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, //  Если требуется отправка куки (для сессий, может понадобиться для проверки CSRF)
});

// Interceptor для добавления данных пользователя (initData) и hash к каждому запросу
api.interceptors.request.use(
  (config) => {
    // Получаем данные пользователя из глобального объекта Telegram WebApp
    const tg = window.Telegram.WebApp;
    const initData = tg.initData; // Используйте tg.initData, если уверены в безопасности

    // Если initData есть, добавляем его как параметр к каждому запросу
    if (initData) {
      config.params = {
        ...config.params,
        user: initData, // Добавляем initData как параметр user
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;