// Function to calculate BMR
const calculateBMR = (weight, height, age, gender, activityLevel) => {
    let bmr;

    console.log('Calculating BMR with values:');
    console.log(`Weight: ${weight} kg`);
    console.log(`Height: ${height} cm`);
    console.log(`Age: ${age} years`);
    console.log(`Gender: ${gender}`);
    console.log(`Activity Level: ${activityLevel}`);


    // Calculate BMR using Mifflin-St Jeor Equation
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
        throw new Error('Invalid gender');
    }

    // Adjust BMR based on activity level
    const activityMultipliers = {
        sedentary: 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'very active': 1.725,
        'super active': 1.9
    };

    const multiplier = activityMultipliers[activityLevel] || 1.2;
    return (bmr * multiplier).toFixed(2);
};

// Function to calculate daily limits based on BMR and dietary preferences
const calculateLimits = (bmr, dietaryPreferences) => {
    // Default macronutrient ratios

    console.log(dietaryPreferences)
    const ratios = {
        protein: 0.15,
        fat: 0.25,
        carbohydrate: 0.60
    };

    // Adjust ratios based on dietary preferences
      
    if (dietaryPreferences.includes('gluten-free')) {
        // Example adjustment for gluten-free
        ratios.carbohydrate = 0.55;

    }

    if (dietaryPreferences == 'vegan') {
        ratios.protein = 0.20; // Increase protein
        ratios.carbohydrate = 0.65; // Increase carbs
        ratios.fat = 0.15; // Decrease fat
    }

    if (dietaryPreferences.includes('vegetarian')) {
        ratios.protein = 0.18; // Slightly increase protein
        ratios.carbohydrate = 0.62; // Slightly increase carbs
        ratios.fat = 0.20; // Slightly decrease fat
    }
    if (dietaryPreferences.includes('gluten-free')) {
        ratios.carbohydrate = 0.55; // Reduce carbs
    }
    if (dietaryPreferences.includes('dairy-free')) {
        ratios.protein = 0.17; // Increase protein slightly
        ratios.carbohydrate = 0.60; // Maintain carbs
        ratios.fat = 0.23; // Slightly increase fat
    }


    // Add more conditions as needed

    return {
        calorieLimit: bmr,
        proteinLimit: (bmr * ratios.protein / 4).toFixed(2), // 1 gram of protein = 4 calories
        fatLimit: (bmr * ratios.fat / 9).toFixed(2), // 1 gram of fat = 9 calories
        carbLimit: (bmr * ratios.carbohydrate / 4).toFixed(2) // 1 gram of carbohydrate = 4 calories
    };
};

module.exports = {
    calculateBMR,
    calculateLimits
};
