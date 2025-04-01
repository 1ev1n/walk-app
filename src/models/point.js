const { pool } = require('../db/pg');

class Point {
    static async create(routeId, latitude, longitude, order) {
        const query = `
            INSERT INTO points (route_id, latitude, longitude, "order")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [routeId, latitude, longitude, order];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByRouteId(routeId) {
        const query = `
            SELECT *
            FROM points
            WHERE route_id = $1
            ORDER BY "order" ASC;
        `;
        const values = [routeId];
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async deleteByRouteId(routeId) {
        const query = `
            DELETE FROM points
            WHERE route_id = $1
            RETURNING *;
        `;
        const values = [routeId];
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async delete(id) {
      const query = 'DELETE FROM points WHERE id = $1 RETURNING *';
      const values = [id];
      const result = await pool.query(query, values);
      return result.rows[0];
    }
}

module.exports = Point;