const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware'); // Middleware для проверки авторизации

router.get('/profile', authenticate, userController.getUserProfile); // Защищенный маршрут для получения профиля
router.put('/profile', authenticate, userController.updateUserProfile);

module.exports = router;