import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { localDB } from '../config/supabase.js';
import { FOOD_DATABASE, calculateFoodMacros, getFoodReplacements, calculateTargets } from '../services/nutritionEngine.js';
import { analyzeFoodImage } from '../services/aiService.js';

const router = express.Router();

// GET food catalog database
router.get('/catalog', (req, res) => {
  res.json({ success: true, catalog: FOOD_DATABASE });
});

// GET today's nutrition overview
router.get('/today', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const profile = localDB.getProfile(userId);
  const targets = calculateTargets(profile);
  
  const dateStr = new Date().toISOString().split('T')[0];
  const logs = localDB.getFoodLogs(userId, dateStr);

  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFat = 0;

  logs.forEach(item => {
    consumedCalories += Number(item.calories || 0);
    consumedProtein += Number(item.protein || 0);
    consumedCarbs += Number(item.carbs || 0);
    consumedFat += Number(item.fat || 0);
  });

  res.json({
    success: true,
    targets: {
      calories: targets.dailyCaloriesTarget,
      protein: targets.dailyProteinTarget,
      carbs: targets.dailyCarbsTarget,
      fat: targets.dailyFatTarget
    },
    consumed: {
      calories: Math.round(consumedCalories),
      protein: Math.round(consumedProtein * 10) / 10,
      carbs: Math.round(consumedCarbs * 10) / 10,
      fat: Math.round(consumedFat * 10) / 10
    },
    remaining: {
      calories: Math.max(0, targets.dailyCaloriesTarget - Math.round(consumedCalories)),
      protein: Math.max(0, Math.round((targets.dailyProteinTarget - consumedProtein) * 10) / 10),
      carbs: Math.max(0, Math.round((targets.dailyCarbsTarget - consumedCarbs) * 10) / 10),
      fat: Math.max(0, Math.round((targets.dailyFatTarget - consumedFat) * 10) / 10)
    },
    foodLogs: logs
  });
});

// GET logs for a specific date
router.get('/food-log', authMiddleware, (req, res) => {
  const userId = req.userId;
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const logs = localDB.getFoodLogs(userId, date);
  res.json({ success: true, logs });
});

// POST add item to food log (Food Tracker / Scale)
router.post('/food-log', authMiddleware, (req, res) => {
  const userId = req.userId;
  const { foodKey, name, grams, mealType } = req.body;

  let macroData;
  if (foodKey && FOOD_DATABASE[foodKey]) {
    macroData = calculateFoodMacros(foodKey, grams || 100);
  } else {
    macroData = {
      name: name || 'Custom Meal',
      grams: Number(grams || 100),
      calories: Number(req.body.calories || 150),
      protein: Number(req.body.protein || 10),
      carbs: Number(req.body.carbs || 20),
      fat: Number(req.body.fat || 4)
    };
  }

  const logEntry = {
    ...macroData,
    mealType: mealType || 'Lunch',
    loggedAt: new Date().toISOString()
  };

  const saved = localDB.addFoodLog(userId, logEntry);
  res.json({ success: true, entry: saved, message: 'Added to Today\'s Food Log!' });
});

// POST food replacement engine
router.post('/food-replacement', authMiddleware, (req, res) => {
  const { foodKey, grams, preference } = req.body;
  if (!foodKey) {
    return res.status(400).json({ success: false, error: 'foodKey is required' });
  }

  const result = getFoodReplacements(foodKey, grams || 200, preference || 'All');
  res.json({ success: true, ...result });
});

// POST AI food photo scanner endpoint
router.post('/scan-photo', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { imageBase64 } = req.body;
  const profile = localDB.getProfile(userId);

  const scanResult = await analyzeFoodImage({ base64Image: imageBase64, userContext: profile });
  res.json({ success: true, scanResult });
});

export default router;
