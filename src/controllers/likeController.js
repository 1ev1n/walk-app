// src/controllers/likeController.js
const Like = require('../models/like');
const Route = require('../models/route'); // Для проверки существования маршрута
const User = require('../models/user'); // Нужно для получения ID записи пользователя по telegram_id

const likeRoute = async (req, res) => {
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

        const like = await Like.create(userId, routeId);
        if (!like) {
          return res.status(400).json({message: 'Лайк уже существует'});
        }
        res.status(201).json({ message: 'Маршрут успешно лайкнут' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при лайке маршрута' });
    }
};

const unlikeRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        const telegramId = req.user.id;  // Получаем telegramId из req.user

        // Получаем ID пользователя из таблицы users по telegramId
        const userId = await User.getIdByTelegramId(telegramId);

        if (!userId) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const unlike = await Like.delete(userId, routeId);
        if (!unlike) {
          return res.status(404).json({message: 'Лайк не найден'});
        }
        res.json({ message: 'Лайк с маршрута успешно снят' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при снятии лайка с маршрута' });
    }
};

const getLikesCount = async (req, res) => {
    try {
        const { routeId } = req.params;
        const count = await Like.countByRouteId(routeId);
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при получении количества лайков' });
    }
};

const hasLiked = async (req, res) => {
  try {
    const { routeId } = req.params;
    const telegramId = req.user.id;

    // Получаем ID пользователя из таблицы users по telegramId
    const userId = await User.getIdByTelegramId(telegramId);

    if (!userId) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const liked = await Like.hasLiked(userId, routeId);
    res.json({ liked });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Ошибка при получении информации о лайке'});
  }
};

module.exports = {
    likeRoute,
    unlikeRoute,
    getLikesCount,
    hasLiked
};