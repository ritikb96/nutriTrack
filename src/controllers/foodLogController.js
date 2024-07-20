// src/controllers/foodLogController.js
const FoodLog = require('../models/foodLog');
const axios = require('axios');

const NUTRITIONIX_API_ID = process.env.NUTRITIONIX_APP_ID; // Nutritionix App ID
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_APP_KEY; // Nutritionix API Key

// Create a new food log entry
exports.createFoodLog = async (req, res) => {
  try {
    const newFoodLog = new FoodLog(req.body);
    const savedFoodLog = await newFoodLog.save();
    res.status(201).json(savedFoodLog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create food log entry' });
  }
};

// Get all food logs for a specific user
exports.getFoodLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const foodLogs = await FoodLog.find({ userId });
    res.status(200).json(foodLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve food logs' });
  }
};

// Update a food log entry
exports.updateFoodLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFoodLog = await FoodLog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedFoodLog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update food log entry' });
  }
};

// Delete a food log entry
exports.deleteFoodLog = async (req, res) => {
  try {
    const { id } = req.params;
    await FoodLog.findByIdAndDelete(id);
    res.status(200).json({ message: 'Food log entry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete food log entry' });
  }
};

// Add a food entry to the user's food log
exports.addFoodToLog = async (req, res) => {
  console.log('addFoodToLog endpoint hit');  // Debug log
  const { userId, foodName, servingSize } = req.body;

  try {
    console.log('Request body:', req.body);  // Debug log

    // Fetch food details from Nutritionix API
    const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      query: `${servingSize} ${foodName}`
    }, {
      headers: {
        'x-app-id': NUTRITIONIX_API_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'x-remote-user-id': '0',
      }
    });

    const foodDetails = response.data.foods[0];

    if (!foodDetails) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // Create new food log entry with all required fields
    const newFoodLog = new FoodLog({
      userId,
      food_name: foodDetails.food_name,
      serving_qty: foodDetails.serving_qty,
      serving_unit: foodDetails.serving_unit,
      serving_weight_grams: foodDetails.serving_weight_grams,
      nf_calories: foodDetails.nf_calories,
      nf_total_fat: foodDetails.nf_total_fat,
      nf_saturated_fat: foodDetails.nf_saturated_fat,
      nf_cholesterol: foodDetails.nf_cholesterol,
      nf_sodium: foodDetails.nf_sodium,
      nf_total_carbohydrate: foodDetails.nf_total_carbohydrate,
      nf_dietary_fiber: foodDetails.nf_dietary_fiber,
      nf_sugars: foodDetails.nf_sugars,
      nf_protein: foodDetails.nf_protein,
      nf_potassium: foodDetails.nf_potassium,
      nf_p: foodDetails.nf_p,
    });

    const savedFoodLog = await newFoodLog.save();
    res.status(201).json(savedFoodLog);
  } catch (error) {
    console.error('Error adding food to log:', error.message || error);
    res.status(500).json({ error: 'Failed to add food to log' });
  }
};

// Search for food items using Nutritionix API
exports.searchFood = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Make request to Nutritionix API
    const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
      params: { query },
      headers: {
        'x-app-id': NUTRITIONIX_API_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'x-remote-user-id': '0', // Default user ID as per Nutritionix documentation
      }
    });

    // Return the common food items as suggestions
    const suggestions = response.data.common;

    if (suggestions.length === 0) {
      return res.status(404).json({ error: 'No matching food items found' });
    }

    // Extract detailed information for the top suggestions
    const foodNames = suggestions.map(food => food.food_name).join(', ');
    const nutrientsResponse = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      query: foodNames,
    }, {
      headers: {
        'x-app-id': NUTRITIONIX_API_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'x-remote-user-id': '0', // Default user ID as per Nutritionix documentation
      }
    });

    // Map the response data to extract relevant nutritional information
    const foods = nutrientsResponse.data.foods.map(food => ({
      food_name: food.food_name,
      serving_qty: food.serving_qty,
      serving_unit: food.serving_unit,
      serving_weight_grams: food.serving_weight_grams,
      nf_calories: food.nf_calories,
      nf_total_fat: food.nf_total_fat,
      nf_saturated_fat: food.nf_saturated_fat,
      nf_cholesterol: food.nf_cholesterol,
      nf_sodium: food.nf_sodium,
      nf_total_carbohydrate: food.nf_total_carbohydrate,
      nf_dietary_fiber: food.nf_dietary_fiber,
      nf_sugars: food.nf_sugars,
      nf_protein: food.nf_protein,
      nf_potassium: food.nf_potassium,
      nf_p: food.nf_p,
    }));

    res.json(foods);
  } catch (error) {
    console.error('Error fetching data from Nutritionix API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch data from Nutritionix API' });
  }
};
