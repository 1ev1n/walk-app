// src/controllers/commentController.js
const Comment = require('../models/comment');
const Route = require('../models/route'); // Для проверки существования маршрута
const User = require('../models/user'); // Нужно для получения ID записи пользователя по telegram_id

const createComment = async (req, res) => {
    try {
        const { routeId } = req.params;
        const { text } = req.body;
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

        const newComment = await Comment.create(userId, routeId, text);
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при создании комментария' });
    }
};

const getCommentsByRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        const comments = await Comment.findByRouteId(routeId);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при получении комментариев' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params; // ID комментария

        const deletedComment = await Comment.delete(id);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Комментарий не найден' });
        }
        res.json({ message: 'Комментарий успешно удален' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при удалении комментария' });
    }
};

module.exports = {
    createComment,
    getCommentsByRoute,
    deleteComment,
};