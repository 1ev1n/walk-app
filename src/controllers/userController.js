// src/controllers/userController.js
const User = require('../models/user');

const getUserProfile = async (req, res) => {
  try {
    // Получаем telegramId из req.user (после верификации)
    const telegramId = req.user.id;  // Предполагается, что Telegram передает ID в поле id
    const user = await User.findById(telegramId); // findById ищет по telegramId
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
      const { description, avatarUrl } = req.body;
      // Получаем telegramId из req.user (после верификации)
      const telegramId = req.user.id;
      const updatedUser = await User.updateProfile(telegramId, description, avatarUrl); // updateProfile использует telegramId
      if (!updatedUser) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json(updatedUser);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};