const { pool } = require('../db/pg');

class User {
    static async findOrCreate(telegramId, username, firstName, lastName) {
        const query = `
            INSERT INTO users (telegram_id, username, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (telegram_id) DO UPDATE
            SET username = $2, first_name = $3, last_name = $4
            RETURNING *;
        `;
        const values = [telegramId, username, firstName, lastName];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Теперь используем telegram_id для поиска
    static async findById(telegramId) {
        const query = 'SELECT * FROM users WHERE telegram_id = $1';
        const values = [telegramId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateProfile(telegramId, description, avatarUrl) {
        const query = 'UPDATE users SET description = $1, avatar_url = $2 WHERE telegram_id = $3 RETURNING *';
        const values = [description, avatarUrl, telegramId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Дополнительный метод для получения ID записи по telegramId
    static async getIdByTelegramId(telegramId) {
        const query = 'SELECT id FROM users WHERE telegram_id = $1';
        const values = [telegramId];
        const result = await pool.query(query, values);
        return result.rows[0] ? result.rows[0].id : null; // Вернуть id или null, если не найдено
    }

}
module.exports = User;