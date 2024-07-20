// src/routes/foodLogRoutes.js
const express = require('express');
const router = express.Router();
const foodLogController = require('../controllers/foodLogController');

// Add food to the user's food log
router.post('/addfood', (req, res, next) => {
    console.log('POST /api/foodlogs/add-food endpoint hit');
    console.log('Request body:', req.body);
    next();
  }, foodLogController.addFoodToLog);

// Other routes...
router.post('/add', foodLogController.createFoodLog);
router.get('/:userId', foodLogController.getFoodLogsByUser);
router.put('/:id', foodLogController.updateFoodLog);
router.delete('/:id', foodLogController.deleteFoodLog);

module.exports = router;
