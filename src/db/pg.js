const { Pool } = require('pg');
require('dotenv').config(); // Ensure .env variables are loaded
const { DATABASE_URL } = process.env;

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false //  В production нужно настроить правильно!
    }
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Ошибка подключения к базе данных', err.stack)
    }
    console.log('Подключение к базе данных PostgreSQL успешно');
    release()
})


module.exports = { pool };