const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/userValidator');

// Register user
router.post('/register', validateUserRegistration, userController.registerUser);

// Login user
router.post('/login', validateUserLogin, userController.loginUser);

// Update user health information
router.put('/:userId/health-info', auth, userController.updateUserHealthInfo);

// Get user health information
router.get('/:userId/health-info', auth, userController.getUserHealthInfo);

module.exports = router;
