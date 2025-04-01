const { pool } = require('../db/pg');

class Like {
    static async create(userId, routeId) {
        const query = `
            INSERT INTO likes (user_id, route_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING  -- Предотвратить дублирование лайков
            RETURNING *;
        `;
        const values = [userId, routeId];
        const result = await pool.query(query, values);
        return result.rows[0];  // Может вернуть undefined, если лайк уже существует
    }

    static async delete(userId, routeId) {
        const query = `
            DELETE FROM likes
            WHERE user_id = $1 AND route_id = $2
            RETURNING *;
        `;
        const values = [userId, routeId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async countByRouteId(routeId) {
        const query = `
            SELECT COUNT(*)
            FROM likes
            WHERE route_id = $1;
        `;
        const values = [routeId];
        const result = await pool.query(query, values);
        return parseInt(result.rows[0].count);
    }

    static async hasLiked(userId, routeId) {
        const query = `
            SELECT EXISTS (
                SELECT 1
                FROM likes
                WHERE user_id = $1 AND route_id = $2
            );
        `;
        const values = [userId, routeId];
        const result = await pool.query(query, values);
        return result.rows[0].exists;
    }
}

module.exports = Like;