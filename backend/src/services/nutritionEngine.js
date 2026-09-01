// Structured, verified nutrition data per 100 grams
export const FOOD_DATABASE = {
  'cooked_rice': { name: 'Cooked Rice', calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, unit: 'g', category: 'Carbs' },
  'brown_rice': { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23.0, fat: 0.9, unit: 'g', category: 'Carbs' },
  'chapati': { name: 'Whole Wheat Chapati', calories: 120, protein: 3.5, carbs: 20.0, fat: 3.0, unit: 'g', category: 'Carbs' },
  'chicken_breast': { name: 'Grilled Chicken Breast', calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, unit: 'g', category: 'Protein' },
  'tofu': { name: 'Firm Tofu', calories: 144, protein: 17.3, carbs: 2.8, fat: 8.7, unit: 'g', category: 'Protein' },
  'paneer': { name: 'Fresh Paneer', calories: 265, protein: 18.0, carbs: 3.0, fat: 20.0, unit: 'g', category: 'Protein' },
  'boiled_egg': { name: 'Boiled Egg (Large ~50g)', calories: 155, protein: 13.0, carbs: 1.1, fat: 10.6, unit: 'g', category: 'Protein' },
  'dal_tadka': { name: 'Yellow Dal Tadka', calories: 105, protein: 6.2, carbs: 14.5, fat: 2.8, unit: 'g', category: 'Protein/Carbs' },
  'sweet_potato': { name: 'Roasted Sweet Potato', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, unit: 'g', category: 'Carbs' },
  'millet_roti': { name: 'Bajra/Millet Roti', calories: 115, protein: 3.1, carbs: 22.0, fat: 1.8, unit: 'g', category: 'Carbs' },
  'oats': { name: 'Rolled Oats (Cooked)', calories: 71, protein: 2.5, carbs: 12.0, fat: 1.5, unit: 'g', category: 'Carbs' },
  'greek_yogurt': { name: 'Plain Greek Yogurt', calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4, unit: 'g', category: 'Dairy' },
  'almonds': { name: 'Raw Almonds', calories: 579, protein: 21.0, carbs: 22.0, fat: 49.0, unit: 'g', category: 'Fats/Nuts' },
  'peanuts': { name: 'Roasted Peanuts', calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2, unit: 'g', category: 'Fats/Nuts' },
  'banana': { name: 'Fresh Banana', calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3, unit: 'g', category: 'Fruits' },
  'apple': { name: 'Fresh Red Apple', calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2, unit: 'g', category: 'Fruits' },
  'whey_protein': { name: 'Whey Protein Isolate (1 scoop 30g)', calories: 120, protein: 25.0, carbs: 1.5, fat: 1.0, unit: 'scoop', category: 'Protein' }
};

// Calculate BMR and TDEE based on user profile
export function calculateTargets(profile) {
  const { weight = 70, height = 175, age = 22, goal = 'Muscle Building', activity = 'Moderate' } = profile;
  
  // Mifflin-St Jeor BMR Equation for males/standard
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  
  const activityMultipliers = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Active': 1.725,
    'Very Active': 1.9
  };

  const mult = activityMultipliers[activity] || 1.55;
  let tdee = Math.round(bmr * mult);

  let targetCalories = tdee;
  if (goal === 'Weight management' || goal === 'Fat Loss') {
    targetCalories = Math.round(tdee - 450);
  } else if (goal === 'Muscle building' || goal === 'Strength') {
    targetCalories = Math.round(tdee + 350);
  }

  // Macro splitting: 2.0g protein/kg for fitness, 25% fats, remainder carbs
  const proteinGrams = Math.round(weight * 2.0);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbsGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

  return {
    dailyCaloriesTarget: targetCalories,
    dailyProteinTarget: proteinGrams,
    dailyCarbsTarget: carbsGrams,
    dailyFatTarget: fatGrams,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee)
  };
}

// Calculate exact macros for a food item given weight in grams
export function calculateFoodMacros(foodKey, grams) {
  const food = FOOD_DATABASE[foodKey];
  if (!food) {
    // Default fallback calculation if custom food
    const factor = grams / 100;
    return {
      name: foodKey,
      grams,
      calories: Math.round(150 * factor),
      protein: Math.round(5 * factor * 10) / 10,
      carbs: Math.round(20 * factor * 10) / 10,
      fat: Math.round(3 * factor * 10) / 10
    };
  }

  const factor = grams / 100;
  return {
    key: foodKey,
    name: food.name,
    grams: Number(grams),
    calories: Math.round(food.calories * factor),
    protein: Math.round(food.protein * factor * 10) / 10,
    carbs: Math.round(food.carbs * factor * 10) / 10,
    fat: Math.round(food.fat * factor * 10) / 10,
    category: food.category
  };
}

// Food Replacement Engine
export function getFoodReplacements(foodKey, grams = 200, preference = 'All') {
  const targetFood = calculateFoodMacros(foodKey, grams);
  const alternatives = [];

  const candidateKeys = ['chapati', 'sweet_potato', 'millet_roti', 'brown_rice', 'oats', 'tofu', 'paneer', 'dal_tadka'];

  for (const key of candidateKeys) {
    if (key === foodKey) continue;
    const base = FOOD_DATABASE[key];
    if (!base) continue;

    // Calculate equivalent grams to match calories
    const requiredGrams = Math.round((targetFood.calories / base.calories) * 100);
    const replacementMacros = calculateFoodMacros(key, requiredGrams);

    alternatives.push({
      foodKey: key,
      name: base.name,
      grams: requiredGrams,
      calories: replacementMacros.calories,
      protein: replacementMacros.protein,
      carbs: replacementMacros.carbs,
      fat: replacementMacros.fat,
      category: base.category,
      calorieDiff: replacementMacros.calories - targetFood.calories
    });
  }

  return {
    originalFood: targetFood,
    alternatives
  };
}
