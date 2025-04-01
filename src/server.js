require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const routeRoutes = require('./routes/routeRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const port = process.env.PORT || 3000;
const { CORS_ORIGIN } = process.env;

app.use(cors({
    origin: CORS_ORIGIN, // Очень важно правильно настроить для Mini App
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Для обработки данных из Telegram

// Routes
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});