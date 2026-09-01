import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { localDB, supabase, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

// POST structured posture detection event from local camera logic
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { exercise, rep, posture, issue, formScore, kneeAngle, hipAngle } = req.body;

  const result = {
    exercise: exercise || 'squat',
    rep: Number(rep || 1),
    posture: posture || 'good',
    issue: issue || 'none',
    formScore: Number(formScore || 90),
    kneeAngle: Number(kneeAngle || 90),
    hipAngle: Number(hipAngle || 85),
    timestamp: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('posture_results').insert({ ...result, user_id: userId });
    } catch (err) {
      console.warn(err.message);
    }
  }

  const saved = localDB.addPostureResult(userId, result);

  // Return feedback advice for posture correction
  let advice = 'Good form! Maintain smooth tempo.';
  let correctionVideoUrl = '/assets/videos/squat_correct.mp4';

  if (issue === 'knee_inward') {
    advice = 'Warning: Your knees are collapsing inward (valgus). Push knees outward over toes.';
    correctionVideoUrl = '/assets/videos/squat_knee_fix.mp4';
  } else if (issue === 'shallow_depth') {
    advice = 'Achieve full depth: Lower hips until thighs are parallel to the floor.';
    correctionVideoUrl = '/assets/videos/squat_depth_fix.mp4';
  } else if (issue === 'forward_lean') {
    advice = 'Back angle excessive: Keep chest proud and weight on mid-foot/heels.';
    correctionVideoUrl = '/assets/videos/squat_chest_fix.mp4';
  }

  return res.json({
    success: true,
    result: saved,
    correction: {
      issue: issue || 'none',
      advice,
      correctionVideoUrl
    }
  });
});

// GET posture history log
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const history = localDB.postures.filter(p => p.userId === userId || userId === 'demo-user-123');
  res.json({ success: true, postureHistory: history });
});

export default router;
