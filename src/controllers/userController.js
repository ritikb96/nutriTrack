const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { calculateBMR, calculateLimits } = require('../controllers/calculator'); // Import calculation functions

// Function to calculate BMI
const calculateBMI = (height, weight) => {
  if (height && weight) {
    const heightInMeters = height / 100; // convert cm to meters
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  }
  return null;
};

exports.registerUser = async (req, res) => 
{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array()); // Log validation errors

    return res.status(400).json({ errors: errors.array() });
  }

  const {
    username,
    email,
    password,
    age,
    gender,
    height,
    weight,
    activityLevel,
    dietaryPreferences,
    disease
  } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Calculate BMI
    const bmi = calculateBMI(height, weight);

    // Calculate BMR and limits
    const bmr = calculateBMR(weight, height, age, gender, activityLevel);
    const { calorieLimit, carbLimit, proteinLimit, fatLimit } = calculateLimits(bmr, dietaryPreferences);

    // Create new user
    user = new User({
      username,
      email,
      password,
      age,
      gender,
      height,
      weight,
      activityLevel,
      dietaryPreferences,
      bmi,
      bmr, // Add BMR
      disease,
      calorieLimit, // Add daily calorie limit
      carbLimit, // Add daily carbohydrate limit
      proteinLimit,// Add daily protein limit
      fatLimit
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to the database
    await user.save();

    // Create and sign JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Set cookie with the token
        res.cookie('token', token, {
          httpOnly: true,
        });
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create and sign JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Set cookie with the token
        res.cookie('token', token, {
          httpOnly: true,
        });
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user health information
exports.updateUserHealthInfo = async (req, res) => {
  const { userId } = req.params;
  const { height, weight, disease } = req.body;

  try {
    const bmi = calculateBMI(height, weight);
    // Fetch the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate BMR and limits
    const bmr = calculateBMR(user.age, user.gender, height, weight, user.activityLevel);
    const { calorieLimit, carbLimit, proteinLimit } = calculateLimits(bmr);

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(userId, {
      height,
      weight,
      bmi,
      disease,
      bmr,
      calorieLimit,
      carbLimit,
      proteinLimit
    }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to update user health information' });
  }
};

// Get user health information
exports.getUserHealthInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('height weight bmi disease bmr calorieLimit carbLimit proteinLimit');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to retrieve user health information' });
  }
};
