// src/routes/routeRoutes.js
const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate } = require('../middleware/authMiddleware'); // Middleware для проверки авторизации

// Создание маршрута
router.post('/', authenticate, routeController.createRoute);

// Получение маршрута по ID
router.get('/:id', routeController.getRouteById);

// Получение всех маршрутов (с пагинацией и фильтрацией)
router.get('/', routeController.getAllRoutes);

// Обновление маршрута
router.put('/:id', authenticate, routeController.updateRoute);

// Удаление маршрута
router.delete('/:id', authenticate, routeController.deleteRoute);

// Получение маршрутов пользователя
router.get('/user', authenticate, routeController.getRoutesByUser);

module.exports = router;