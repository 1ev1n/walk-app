import axios from 'axios';

// Определение базового URL для вашего API
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});


const checkTelegramWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram WebApp доступен');
        return true;
    } else {
        console.log('Telegram WebApp не доступен');
        return false;
    }
};

api.interceptors.request.use(
    (config) => {
        if (checkTelegramWebApp()) {
            const tg = window.Telegram.WebApp;
            const initData = tg.initData;

            if (initData) {
                config.params = {
                    ...config.params,
                    user: initData,
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

const waitForWebAppInitialization = () => {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready(); // Говорим Telegram, что WebApp готов
        console.log('WebApp инициализирован и готов к использованию');
    } else {
        console.log('Ожидаем инициализацию WebApp...');
        setTimeout(waitForWebAppInitialization, 500);
    }
};

waitForWebAppInitialization();

export default api;
