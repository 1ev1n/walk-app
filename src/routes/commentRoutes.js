// src/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

// Создание комментария
router.post('/:routeId', authenticate, commentController.createComment);

// Получение комментариев для маршрута
router.get('/:routeId', commentController.getCommentsByRoute);

// Удаление комментария
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;