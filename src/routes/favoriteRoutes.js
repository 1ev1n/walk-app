// src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/authMiddleware');

// Добавление маршрута в избранное
router.post('/:routeId', authenticate, favoriteController.addRouteToFavorites);

// Удаление маршрута из избранного
router.delete('/:routeId', authenticate, favoriteController.removeRouteFromFavorites);

// Получение избранных маршрутов пользователя
router.get('/', authenticate, favoriteController.getFavoriteRoutes);

// Проверка, находится ли маршрут в избранном
router.get('/:routeId/isfavorite', authenticate, favoriteController.isFavorite);

module.exports = router;