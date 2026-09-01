import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { localDB, supabase, isSupabaseConfigured } from '../config/supabase.js';
import { calculateTargets } from '../services/nutritionEngine.js';
import { normalizeWeeklyBudget } from '../services/budgetPlanner.js';
import { buildProfileAnalysis } from '../services/profileAnalysis.js';

const router = express.Router();

// GET profile
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data && !error) {
        return res.json({ success: true, profile: data });
      }
    } catch (err) {
      console.warn('Supabase fetch error, fallback to local DB:', err.message);
    }
  }

  const profile = localDB.getProfile(userId);
  return res.json({ success: true, profile });
});

// POST setup profile
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const profileInput = req.body;
  const safeBudget = normalizeWeeklyBudget(profileInput.weeklyBudget, 500);

  // Calculate target macros based on new user parameters
  const targets = calculateTargets(profileInput);
  const fullProfile = {
    ...profileInput,
    weeklyBudget: safeBudget,
    ...targets,
    id: userId,
    updatedAt: new Date().toISOString()
  };
  fullProfile.analysis = buildProfileAnalysis(fullProfile);

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(fullProfile)
        .select()
        .single();
      if (!error && data) {
        return res.json({ success: true, profile: data, message: 'AI Profile Created Successfully' });
      }
    } catch (err) {
      console.warn('Supabase profile create error:', err.message);
    }
  }

  const saved = localDB.setProfile(userId, fullProfile);
  return res.json({ success: true, profile: saved, message: 'AI Profile Created Successfully' });
});

// PUT update profile (Real-time recalculation of macros & recommendations)
router.put('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const updates = req.body;

  if (Object.prototype.hasOwnProperty.call(updates, 'weeklyBudget')) {
    updates.weeklyBudget = normalizeWeeklyBudget(updates.weeklyBudget, 500);
  }

  // Get current profile
  let existing = localDB.getProfile(userId);
  
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) existing = data;
    } catch (err) {
      console.warn(err.message);
    }
  }

  const merged = { ...existing, ...updates };
  // Recalculate targets with new height/weight/goal/activity
  const newTargets = calculateTargets(merged);
  const updatedProfile = {
    ...merged,
    ...newTargets,
    updatedAt: new Date().toISOString()
  };
  updatedProfile.analysis = buildProfileAnalysis(updatedProfile);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('profiles').upsert(updatedProfile);
    } catch (err) {
      console.warn('Supabase update profile error:', err.message);
    }
  }

  const saved = localDB.setProfile(userId, updatedProfile);
  return res.json({
    success: true,
    profile: saved,
    message: 'Profile updated successfully',
    recalculatedTargets: newTargets
  });
});

export default router;
