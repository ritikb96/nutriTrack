const express = require('express');
const { searchFood, getRandomFoods } = require('../controllers/food');


const router = express.Router();

router.get('/search', searchFood);
router.get('/random', getRandomFoods);

module.exports = router;
