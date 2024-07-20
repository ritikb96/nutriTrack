// src/middleware/userValidator.js

const { check, oneOf } = require('express-validator');

// List of allowed dietary preferences
const allowedPreferences = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'none'];

exports.validateUserRegistration = [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('age').isInt({ min: 1 }).withMessage('Please include a valid age'),
    check('gender').isIn(['male', 'female', 'other']).withMessage('Please include a valid gender'),
    check('height').isFloat({ min: 0 }).withMessage('Please include a valid height'),
    check('weight').isFloat({ min: 0 }).withMessage('Please include a valid weight'),
    check('activityLevel').isIn(['sedentary', 'lightly active', 'moderately active', 'very active', 'super active']).withMessage('Please include a valid activity level'),
    check('dietaryPreferences').optional().isArray().withMessage('Dietary preferences must be an array'),
    check('dietaryPreferences.*').custom(value => {
        if (!allowedPreferences.includes(value)) {
            throw new Error(`Invalid dietary preference: ${value}`);
        }
        return true;
    }).withMessage('One or more dietary preferences are invalid'),
];

exports.validateUserLogin = [
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').exists().withMessage('Password is required'),
];
