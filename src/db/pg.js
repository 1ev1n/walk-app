const { Pool } = require('pg');
require('dotenv').config(); // Ensure .env variables are loaded
const { DATABASE_URL } = process.env;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'DoR12052005',
    port: 5432,
    ssl: false
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Ошибка подключения к базе данных', err.stack)
    }
    console.log('Подключение к базе данных PostgreSQL успешно');
    release()
})


module.exports = { pool };