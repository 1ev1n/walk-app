// src/controllers/routeController.js
const Route = require('../models/route');
const Point = require('../models/point');
const User = require('../models/user'); //  Нужно для получения ID записи пользователя по telegram_id

const createRoute = async (req, res) => {
    try {
        const { name, description, type, imageUrl, points } = req.body;
        const telegramId = req.user.id; // Получаем telegramId из req.user

        // Получаем ID пользователя из таблицы users по telegramId
        const userId = await User.getIdByTelegramId(telegramId);

        if (!userId) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const newRoute = await Route.create(userId, name, description, type, imageUrl);

        if (!newRoute) {
            return res.status(500).json({ message: 'Не удалось создать маршрут' });
        }

        // Создаем точки маршрута
        if (points && Array.isArray(points)) {
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                await Point.create(newRoute.id, point.latitude, point.longitude, i); // order = i
            }
        }

        res.status(201).json(newRoute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при создании маршрута' });
    }
};

const getRouteById = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Validate that ID is a number
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ message: 'Неверный ID маршрута' });
        }

        const route = await Route.findById(parseInt(id));  // ✅ Use parseInt just to be safe
        if (!route) {
            return res.status(404).json({ message: 'Маршрут не найден' });
        }

        const points = await Point.findByRouteId(route.id);
        route.points = points;
        res.json(route);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при получении маршрута' });
    }
};

const getAllRoutes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const type = req.query.type || null;

    const routes = await Route.findAll(limit, offset, type);
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера при получении маршрутов' });
  }
};

const updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, imageUrl, points } = req.body;

        const updatedRoute = await Route.update(id, name, description, type, imageUrl);
        if (!updatedRoute) {
            return res.status(404).json({ message: 'Маршрут не найден' });
        }

        // Обновляем точки маршрута
        await Point.deleteByRouteId(id);  // Удаляем старые точки
        if (points && Array.isArray(points)) {
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                await Point.create(id, point.latitude, point.longitude, i); // Создаем новые точки
            }
        }

        res.json(updatedRoute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении маршрута' });
    }
};

const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        // Сначала удаляем точки маршрута
        await Point.deleteByRouteId(id);

        const deletedRoute = await Route.delete(id);
        if (!deletedRoute) {
            return res.status(404).json({ message: 'Маршрут не найден' });
        }
        res.json({ message: 'Маршрут успешно удален' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при удалении маршрута' });
    }
};

const getRoutesByUser = async (req, res) => {
    try {
        const telegramId = req.user.id;  // Получаем telegramId из req.user
        const routes = await Route.findByUserId(telegramId);
        res.json(routes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера при получении маршрутов пользователя' });
    }
};

module.exports = {
    createRoute,
    getRouteById,
    getAllRoutes,
    updateRoute,
    deleteRoute,
    getRoutesByUser,
};