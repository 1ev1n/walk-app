// src/routes/likeRoutes.js
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticate } = require('../middleware/authMiddleware');

// Лайк маршрута
router.post('/:routeId', authenticate, likeController.likeRoute);

// Снятие лайка с маршрута
router.delete('/:routeId', authenticate, likeController.unlikeRoute);

// Получение количества лайков для маршрута
router.get('/:routeId/count', likeController.getLikesCount);

//Проверка, лайкнул ли пользователь маршрут
router.get('/:routeId/hasliked', authenticate, likeController.hasLiked);

module.exports = router;