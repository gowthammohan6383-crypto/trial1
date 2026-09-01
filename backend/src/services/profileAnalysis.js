import { normalizeWeeklyBudget } from './budgetPlanner.js';

export function buildProfileAnalysis(profile = {}) {
  const weeklyBudget = normalizeWeeklyBudget(profile.weeklyBudget, 500);
  const goal = profile.goal || 'Muscle building';
  const foodPreference = profile.foodPreference || 'Non-vegetarian';
  const proteinTarget = Number(profile.dailyProteinTarget || 140);
  const caloriesTarget = Number(profile.dailyCaloriesTarget || 2450);

  const proteinSources = {
    Vegetarian: ['Paneer', 'Tofu', 'Eggs', 'Greek yogurt', 'Lentils'],
    'Non-vegetarian': ['Chicken breast', 'Eggs', 'Greek yogurt', 'Fish', 'Tofu'],
    Vegan: ['Tofu', 'Soy chunks', 'Lentils', 'Peanuts', 'Chickpeas'],
    'Custom preferences': ['Chicken', 'Tofu', 'Eggs', 'Beans', 'Greek yogurt']
  };

  const carbs = ['Brown rice', 'Oats', 'Sweet potato', 'Chapati', 'Bananas'];
  const veggies = ['Spinach', 'Broccoli', 'Capsicum', 'Cabbage', 'Cauliflower'];

  const estimatedFoodCost = Math.min(Math.round(weeklyBudget * 0.82), weeklyBudget - 50);
  const remainingBudget = weeklyBudget - estimatedFoodCost;

  const mealStrategy =
    goal === 'Weight management'
      ? 'High protein, controlled carbs, and fiber-heavy vegetables to keep satiety high while staying within the weekly cap.'
      : goal === 'Strength' || goal === 'Muscle building'
        ? 'Lean protein, smart carbs, and a slight calorie surplus to support training performance and recovery.'
        : 'Balanced meals with steady protein intake and nutrient-dense carbs for stable energy throughout the week.';

  return {
    weeklyBudget,
    estimatedFoodCost,
    remainingBudget,
    goal,
    foodPreference,
    caloriesTarget,
    proteinTarget,
    status: estimatedFoodCost <= weeklyBudget ? 'Within budget' : 'Needs adjustment',
    summary: `Your ${goal.toLowerCase()} plan is configured for ${foodPreference.toLowerCase()} nutrition and a weekly food budget of ₹${weeklyBudget}.`,
    mealStrategy,
    focusAreas: [
      `${proteinTarget}g protein target per day`,
      `${caloriesTarget} kcal daily calorie target`,
      `${Math.round(weeklyBudget / 7)} daily budget average`
    ],
    recommendedFoods: [
      ...proteinSources[foodPreference] || proteinSources['Non-vegetarian'],
      ...carbs.slice(0, 2),
      ...veggies.slice(0, 2)
    ],
    recommendations: [
      `Prioritize ${proteinSources[foodPreference][0]} and ${proteinSources[foodPreference][1]} for the highest protein-per-rupee value.`,
      `Use ${carbs[0]} and ${carbs[1]} as your main carbs to stay within the weekly cap without losing energy.`,
      `Add ${veggies[0]} and ${veggies[1]} for volume and micronutrient density at low cost.`
    ]
  };
}
