const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  height: { type: Number, required: true }, // in cm
  weight: { type: Number, required: true }, // in kg
  activityLevel: { type: String, required: true, enum: ['sedentary', 'lightly active', 'moderately active', 'very active', 'super active'] },
  dietaryPreferences: { type: [String], enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'none'], default: ['none'] },
  bmi: { type: Number, required: false },
  disease: { type: String, required: false },
  calorieLimit: { type: Number, required: false }, // Daily calorie limit
  carbLimit: { type: Number, required: false }, // Daily carbohydrate limit (grams)
  proteinLimit: { type: Number, required: false }, // Daily protein limit (grams)
  bmr: { type: Number, required: false }, // Basal Metabolic Rate
  dateCreated: { type: Date, default: Date.now } // Automatically set the date when user is created
});

module.exports = mongoose.model('User', UserSchema)