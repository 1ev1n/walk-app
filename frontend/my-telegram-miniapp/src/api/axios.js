import axios from 'axios';

// Определение базового URL для вашего API
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Если требуется отправка куки
});

// Проверка наличия Telegram WebApp
const checkTelegramWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram WebApp доступен');
        return true;
    } else {
        console.log('Telegram WebApp не доступен');
        return false;
    }
};

// Если WebApp доступен, добавляем данные в запросы
api.interceptors.request.use(
    (config) => {
        if (checkTelegramWebApp()) {
            const tg = window.Telegram.WebApp;
            const initData = tg.initData; // Данные инициализации WebApp

            if (initData) {
                config.params = {
                    ...config.params,
                    user: initData, // Добавляем initData как параметр user
                };
            }
        } else {
            console.warn('WebApp не доступен, параметры запроса не добавлены');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Подписка на событие готовности WebApp
const waitForWebAppInitialization = () => {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready(); // Говорим Telegram, что WebApp готов
        console.log('WebApp инициализирован и готов к использованию');
    } else {
        console.log('Ожидаем инициализацию WebApp...');
        setTimeout(waitForWebAppInitialization, 500); // Повторная проверка через 500ms
    }
};

// Запуск ожидания инициализации
waitForWebAppInitialization();

export default api;
