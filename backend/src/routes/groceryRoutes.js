import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { localDB } from '../config/supabase.js';
import { normalizeWeeklyBudget, calculateBudgetSummary } from '../services/budgetPlanner.js';

const router = express.Router();

// GET grocery list
router.get('/', authMiddleware, (req, res) => {
  const userId = req.userId;
  const items = localDB.getGrocery(userId);
  const profile = localDB.getProfile(userId);
  const summary = calculateBudgetSummary(items, profile.weeklyBudget);

  res.json({
    success: true,
    weeklyBudget: summary.weeklyBudget,
    estimatedCost: summary.estimatedCost,
    remainingBudget: summary.remainingBudget,
    isOverBudget: summary.isOverBudget,
    items
  });
});

// POST update full grocery list
router.post('/save', authMiddleware, (req, res) => {
  const userId = req.userId;
  const { items } = req.body;
  const updated = localDB.updateGrocery(userId, items || []);
  res.json({ success: true, items: updated });
});

// PUT edit grocery item toggle purchased or quantity
router.put('/:id', authMiddleware, (req, res) => {
  const userId = req.userId;
  const itemId = req.params.id;
  const updates = req.body;

  const list = localDB.getGrocery(userId);
  const idx = list.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localDB.updateGrocery(userId, list);
    return res.json({ success: true, item: list[idx] });
  }

  res.status(404).json({ success: false, error: 'Item not found' });
});

// POST generate low-cost budget swaps when over budget
router.post('/budget-swaps', authMiddleware, (req, res) => {
  const userId = req.userId;
  const profile = localDB.getProfile(userId);
  const items = localDB.getGrocery(userId);
  const summary = calculateBudgetSummary(items, profile.weeklyBudget);

  const swaps = [
    { original: 'Almonds (500g ₹450)', substitute: 'Peanuts (500g ₹140)', savings: 310, macroImpact: 'Matches protein & healthy fats at 68% lower cost' },
    { original: 'Imported Avocados (₹300)', substitute: 'Local Seasonal Bananas & Flaxseeds (₹80)', savings: 220, macroImpact: 'High potassium & fiber alternative' },
    { original: 'Whey Protein Isolate Premium (₹2200)', substitute: 'Egg Whites & Paneer Combo (₹850)', savings: 1350, macroImpact: 'Whole food bioavailable protein swap' },
    { original: 'Salmon / Fresh Fish (₹800)', substitute: 'Lentils, Soya Chunks & Eggs (₹250)', savings: 550, macroImpact: 'Budget muscle building stack' }
  ];

  res.json({
    success: true,
    weeklyBudget: summary.weeklyBudget,
    estimatedCost: summary.estimatedCost,
    excessAmount: Math.max(0, summary.estimatedCost - summary.weeklyBudget),
    recommendedSwaps: swaps
  });
});

export default router;
