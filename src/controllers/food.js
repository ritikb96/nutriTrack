const axios = require('axios');

const NUTRITIONIX_API_ID = process.env.NUTRITIONIX_APP_ID; // Nutritionix App ID
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_APP_KEY; // Nutritionix API Key

const searchFood = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Make request to Nutritionix API
    const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
      params: { query: query },
      headers: {
        'x-app-id': NUTRITIONIX_API_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'x-remote-user-id': '0', // Default user ID as per Nutritionix documentation
      }
    });

    // Filter the response to only include exact matches
    const filteredFoods = response.data.common.filter(food => food.food_name.toLowerCase() === query.toLowerCase());

    if (filteredFoods.length === 0) {
      return res.status(404).json({ error: 'No matching food item found' });
    }

    // Extract food names to get detailed information
    const foodNames = filteredFoods.map(food => food.food_name).join(', ');

    // Make request to Nutritionix natural nutrients endpoint
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

// src/controllers/food.js






// Predefined queries for common foods
const commonFoodQueries = [
  'apple',
  'soup',
  'salad',
  'steak',
  'chicken',
  'pizza',
  'rice',
  'burger',
  'pasta',
  'sandwich',
  // Add more common food queries here as needed
];

const getRandomFoods = async (req, res) => {
  try {
    // Randomly select a query from commonFoodQueries
    const randomQuery = commonFoodQueries[Math.floor(Math.random() * commonFoodQueries.length)];

    // Make request to Nutritionix API
    const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
      params: {
        query: randomQuery,
        common: true,
        branded: false,
      },
      headers: {
        'x-app-id': NUTRITIONIX_API_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
      },
    });

    const commonFoods = response.data.common;

    if (commonFoods.length === 0) {
      return res.status(404).json({ error: 'No common foods found' });
    }

    const randomFoods = [];

    const numRandomFoods = Math.min(10, commonFoods.length);
    for (let i = 0; i < numRandomFoods; i++) {
      const randomIndex = Math.floor(Math.random() * commonFoods.length);
      const foodItem = commonFoods[randomIndex];

      randomFoods.push({
        food_name: foodItem.food_name,
        serving_unit: foodItem.serving_unit,
        photo_thumb: foodItem.photo?.thumb,
      });

      commonFoods.splice(randomIndex, 1);
    }

    res.status(200).json(randomFoods);
  } catch (error) {
    console.error('Error fetching random common foods:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch random foods' });
  }
};




module.exports = { searchFood,  getRandomFoods};
