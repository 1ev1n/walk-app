const { pool } = require('../db/pg');

class Comment {
    static async create(userId, routeId, text) {
        const query = `
            INSERT INTO comments (user_id, route_id, text)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [userId, routeId, text];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByRouteId(routeId) {
        const query = `
            SELECT comments.*, users.username, users.avatar_url
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            WHERE route_id = $1
            ORDER BY created_at DESC;
        `;
        const values = [routeId];
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async delete(id) {
        const query = `
            DELETE FROM comments
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = Comment;