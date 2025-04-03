const crypto = require('crypto');
const { TELEGRAM_BOT_TOKEN, NODE_ENV } = process.env;

const authenticate = (req, res, next) => {
    // ✅ 1. Allow mock user for development
    if (NODE_ENV === 'development' && req.headers['x-dev-user'] === 'true') {
        console.log('🧪 Dev mode active: using fake user');
        req.user = {
            id: 123456789,
            username: 'devuser',
            first_name: 'Dev',
            last_name: 'User',
            avatar_url: 'https://i.pravatar.cc/150?img=3',
            description: 'Тестовый пользователь',
        };
        return next();
    }

    const { hash } = req.query;
    const user = req.body;

    if (!hash || !user) {
        return res.status(401).json({ message: 'Не авторизован (отсутствует hash или данные пользователя)' });
    }

    // 🔐 Verify hash
    const secretKey = crypto
        .createHmac('sha256', TELEGRAM_BOT_TOKEN)
        .update(JSON.stringify(user)) // you may want to stringify consistently
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
        req.user = user;
        next();
    } else {
        return res.status(401).json({ message: 'Не авторизован (неверная подпись)' });
    }
};

module.exports = { authenticate };
