const mongoose = require('mongoose');

const FoodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  nutritionixId: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number,
    sugar: Number,
    cholesterol: Number,
    sodium: Number,
    potassium: Number,
    calcium: Number,
    iron: Number,
    magnesium: Number,
    zinc: Number,
    vitaminA: Number,
    vitaminC: Number,
    vitaminD: Number,
    vitaminE: Number,
    vitaminK: Number,
    // Add more nutrients as needed
  },
});

module.exports = mongoose.model('FoodLog', FoodLogSchema);
