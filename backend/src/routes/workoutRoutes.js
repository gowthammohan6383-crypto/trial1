import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { localDB, supabase, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

// Available Exercises List
const WORKOUT_CATALOG = [
  {
    id: 'squat',
    name: 'Squat',
    targetReps: 12,
    targetSets: 4,
    difficulty: 'Intermediate',
    duration: '15 min',
    targetMuscle: 'Quadriceps, Glutes & Core',
    instructions: 'Keep feet shoulder-width apart. Drive hips back, maintain chest up, and keep knees tracking over toes.',
    animation: 'squat_3d'
  },
  {
    id: 'pushup',
    name: 'Push-up',
    targetReps: 15,
    targetSets: 3,
    difficulty: 'Beginner',
    duration: '10 min',
    targetMuscle: 'Chest, Shoulders & Triceps',
    instructions: 'Maintain a straight body plank line. Lower chest to floor with elbows at 45 degree angle.',
    animation: 'pushup_3d'
  },
  {
    id: 'lunges',
    name: 'Lunges',
    targetReps: 10,
    targetSets: 3,
    difficulty: 'Intermediate',
    duration: '12 min',
    targetMuscle: 'Hamstrings, Glutes & Quads',
    instructions: 'Step forward landing heel to toe. Bend front and back knees to 90 degrees.',
    animation: 'lunge_3d'
  },
  {
    id: 'plank',
    name: 'Plank',
    targetReps: 60, // seconds
    targetSets: 3,
    difficulty: 'Beginner',
    duration: '8 min',
    targetMuscle: 'Core, Abdominals & Lower Back',
    instructions: 'Engage glutes and core. Keep shoulders aligned above forearms in a rigid straight line.',
    animation: 'plank_3d'
  },
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    targetReps: 30,
    targetSets: 3,
    difficulty: 'Beginner',
    duration: '6 min',
    targetMuscle: 'Full Body & Cardio',
    instructions: 'Jump feet out wider than hips while bringing arms overhead. Keep light soft landings.',
    animation: 'jacks_3d'
  }
];

// GET available workout catalog
router.get('/catalog', (req, res) => {
  res.json({ success: true, catalog: WORKOUT_CATALOG });
});

// GET workout history
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from('workout_sessions').select('*').eq('user_id', userId);
      if (data) return res.json({ success: true, workouts: data });
    } catch (err) {
      console.warn(err.message);
    }
  }
  const workouts = localDB.getWorkouts(userId);
  res.json({ success: true, workouts });
});

// POST save completed workout session
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { exercise, repsCompleted, formScore, durationSeconds, caloriesBurned } = req.body;

  const workoutData = {
    exercise: exercise || 'squat',
    repsCompleted: Number(repsCompleted || 0),
    formScore: Number(formScore || 85),
    durationSeconds: Number(durationSeconds || 120),
    caloriesBurned: Number(caloriesBurned || 45)
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('workout_sessions').insert({ ...workoutData, user_id: userId });
    } catch (err) {
      console.warn(err.message);
    }
  }

  const saved = localDB.addWorkout(userId, workoutData);
  res.json({ success: true, workout: saved, message: 'Workout session recorded!' });
});

export default router;
