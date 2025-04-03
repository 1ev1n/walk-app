const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate } = require('../middleware/authMiddleware');

// ✅ Specific routes FIRST
router.get('/user', authenticate, routeController.getRoutesByUser);

// ✅ Create new route
router.post('/', authenticate, routeController.createRoute);

// ✅ Get all routes
router.get('/', routeController.getAllRoutes);

// ✅ Update route
router.put('/:id', authenticate, routeController.updateRoute);

// ✅ Delete route
router.delete('/:id', authenticate, routeController.deleteRoute);

// ✅ Finally, catch /:id LAST to prevent "favorites" conflict
router.get('/:id', routeController.getRouteById);

module.exports = router;
