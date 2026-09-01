import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { localDB } from '../config/supabase.js';
import { generateChatResponse } from '../services/aiService.js';
import { calculateTargets } from '../services/nutritionEngine.js';

const router = express.Router();

// GET chat history
router.get('/history', authMiddleware, (req, res) => {
  const userId = req.userId;
  const history = localDB.getChatHistory(userId);
  res.json({ success: true, history });
});

// POST chat message for FitBot / Voice AI
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ success: false, error: 'Message cannot be empty' });
  }

  // Save user message to history
  localDB.addChat(userId, 'user', message);

  // Build real-time context
  const profile = localDB.getProfile(userId);
  const targets = calculateTargets(profile);
  const dateStr = new Date().toISOString().split('T')[0];
  const logs = localDB.getFoodLogs(userId, dateStr);
  const workouts = localDB.getWorkouts(userId);
  const grocery = localDB.getGrocery(userId);

  const consumedCalories = logs.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);

  const userContext = {
    ...profile,
    dailyCaloriesTarget: targets.dailyCaloriesTarget,
    dailyProteinTarget: targets.dailyProteinTarget,
    remainingCalories: Math.max(0, targets.dailyCaloriesTarget - consumedCalories),
    recentWorkoutsCount: workouts.length,
    groceryItemCount: grocery.length
  };

  // Generate response
  const aiResponse = await generateChatResponse({ userMessage: message, userContext });

  // Save AI response to history
  localDB.addChat(userId, 'assistant', aiResponse);

  res.json({
    success: true,
    reply: aiResponse,
    contextSummary: {
      userGoal: profile.goal,
      remainingCalories: userContext.remainingCalories,
      dailyTarget: targets.dailyCaloriesTarget
    }
  });
});

export default router;
