const crypto = require('crypto'); // Или jsonwebtoken, если выбрали его
const { TELEGRAM_BOT_TOKEN } = process.env;

const authenticate = (req, res, next) => {
    const { hash } = req.query; // Получаем hash из параметров запроса
    const user = req.body; // Telegram передает данные пользователя в теле запроса

    if (!hash || !user) {
        return res.status(401).json({ message: 'Не авторизован (отсутствует hash или данные пользователя)' });
    }

    const secretKey = crypto
        .createHmac('sha256', TELEGRAM_BOT_TOKEN)
        .update(String(req.body))  // Convert to String
        .digest();

    const checkString = Object.keys(user)
        .sort()
        .map(key => `${key}=${user[key]}`)
        .join('\n');

    const hmac = crypto
        .createHmac('sha256', secretKey)
        .update(checkString)
        .digest('hex');

    if (hmac === hash) {
        // Подпись валидна.  Можно доверять данным пользователя.
        req.user = user;  // Сохраняем данные пользователя в req.user
        next();
    } else {
        return res.status(401).json({ message: 'Не авторизован (неверная подпись)' });
    }
};

module.exports = { authenticate };