const { pool } = require('../db/pg');

class Favorite {
    static async create(userId, routeId) {
        const query = `
            INSERT INTO favorites (user_id, route_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING  -- Предотвратить дублирование
            RETURNING *;
        `;
        const values = [userId, routeId];
        const result = await pool.query(query, values);
        return result.rows[0];  // Может вернуть undefined, если уже существует
    }

    static async delete(userId, routeId) {
        const query = `
            DELETE FROM favorites
            WHERE user_id = $1 AND route_id = $2
            RETURNING *;
        `;
        const values = [userId, routeId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const query = `
            SELECT routes.*
            FROM favorites
            INNER JOIN routes ON favorites.route_id = routes.id
            WHERE favorites.user_id = $1;
        `;
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async isFavorite(userId, routeId) {
      const query = `
          SELECT EXISTS (
              SELECT 1
              FROM favorites
              WHERE user_id = $1 AND route_id = $2
          );
      `;
      const values = [userId, routeId];
      const result = await pool.query(query, values);
      return result.rows[0].exists;
  }
}

module.exports = Favorite;