const { pool } = require('../db/pg');

class Route {
    static async create(userId, name, description, type, imageUrl) {
        const query = `
            INSERT INTO routes (user_id, name, description, type, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [userId, name, description, type, imageUrl];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = `
            SELECT *
            FROM routes
            WHERE id = $1;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll(limit = 10, offset = 0, type = null) {
        let query = `
            SELECT *
            FROM routes
        `;
        const values = [];
        if (type) {
          query += ` WHERE type = $${values.length + 1}`;
          values.push(type);
        }
        query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, name, description, type, imageUrl) {
        const query = `
            UPDATE routes
            SET name = $2, description = $3, type = $4, image_url = $5
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id, name, description, type, imageUrl];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = `
            DELETE FROM routes
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    //Изменено: Используем telegram_id пользователя для поиска маршрутов
    static async findByUserId(userId) {
      const query = `
          SELECT r.*
          FROM routes r
          JOIN users u ON r.user_id = u.id
          WHERE u.telegram_id = $1;
      `;
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows;
    }
}

module.exports = Route;