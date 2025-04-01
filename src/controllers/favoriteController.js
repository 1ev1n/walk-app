// src/controllers/favoriteController.js
const Favorite = require('../models/favorite');
const Route = require('../models/route'); // Для проверки существования маршрута
const User = require('../models/user'); // Нужно для получения ID записи пользователя по telegram_id

const addRouteToFavorites = async (req, res) => {
    try {
        const { routeId } = req.params;
        const telegramId = req.user.id;  // Получаем telegramId из req.user

         // Получаем ID пользователя из таблицы users по telegramId
         const userId = await User.getIdByTelegramId(telegramId);

         if (!userId) {
             return res.status(404).json({ message: 'Пользователь не найден' });
         }

        // Проверяем, существует ли маршрут
        const route = await Route.findById(routeId);
        if (!route) {
            return res.status(404).json({ message: 'Маршрут не найден' });
        }

        const favorite = await Favorite.create(userId, routeId);
        if (!favorite) {
          return res.status(400).json({ message: 'Маршрут уже в избранном'});
        }
        res.status(201).json({ message: 'Маршрут успешно добавлен в избранное' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при добавлении маршрута в избранное' });
    }
};

const removeRouteFromFavorites = async (req, res) => {
    try {
        const { routeId } = req.params;
        const telegramId = req.user.id;  // Получаем telegramId из req.user

        // Получаем ID пользователя из таблицы users по telegramId
        const userId = await User.getIdByTelegramId(telegramId);

        if (!userId) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const removedFavorite = await Favorite.delete(userId, routeId);
        if (!removedFavorite) {
          return res.status(404).json({message: 'Маршрут не найден в избранном'});
        }
        res.json({ message: 'Маршрут успешно удален из избранного' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при удалении маршрута из избранного' });
    }
};

const getFavoriteRoutes = async (req, res) => {
    try {
        const telegramId = req.user.id;  // Получаем telegramId из req.user

        // Получаем ID пользователя из таблицы users по telegramId
        const userId = await User.getIdByTelegramId(telegramId);

        if (!userId) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const favoriteRoutes = await Favorite.findByUserId(userId);
        res.json(favoriteRoutes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при получении избранных маршрутов' });
    }
};

const isFavorite = async (req, res) => {
  try {
    const { routeId } = req.params;
    const telegramId = req.user.id;

    // Получаем ID пользователя из таблицы users по telegramId
    const userId = await User.getIdByTelegramId(telegramId);

    if (!userId) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const favorite = await Favorite.isFavorite(userId, routeId);
    res.json({favorite});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Ошибка при проверке избранного'});
  }
}

module.exports = {
    addRouteToFavorites,
    removeRouteFromFavorites,
    getFavoriteRoutes,
    isFavorite
};