import http from 'node:http';
import { localDB, isSupabaseConfigured } from './config/supabase.js';
import { calculateTargets, FOOD_DATABASE, calculateFoodMacros, getFoodReplacements } from './services/nutritionEngine.js';
import { generateChatResponse, analyzeFoodImage } from './services/aiService.js';
import { normalizeWeeklyBudget } from './services/budgetPlanner.js';

const PORT = 5000;

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const userId = req.headers['x-user-id'] || 'demo-user-123';

  // API Routes
  if (pathname === '/api/health') {
    return sendJSON(res, 200, { status: 'online', system: 'FITVISION AI Native Server', version: '1.0.0' });
  }

  // Auth Routes
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    return sendJSON(res, 200, { success: true, user: { id: userId, email: body.email || 'athlete@fitvision.ai', name: 'Athlete' }, token: 'demo-token-123' });
  }

  if (pathname === '/api/auth/register' && req.method === 'POST') {
    const body = await parseBody(req);
    return sendJSON(res, 200, { success: true, user: { id: userId, email: body.email || 'athlete@fitvision.ai', name: body.name || 'Athlete' }, token: 'demo-token-123' });
  }

  // Profile Routes
  if (pathname === '/api/profile' && req.method === 'GET') {
    const profile = localDB.getProfile(userId);
    return sendJSON(res, 200, { success: true, profile });
  }

  if (pathname === '/api/profile' && (req.method === 'POST' || req.method === 'PUT')) {
    const body = await parseBody(req);
    const updated = localDB.setProfile(userId, body);
    const targets = calculateTargets(updated);
    const finalProfile = localDB.setProfile(userId, { ...updated, ...targets });
    return sendJSON(res, 200, { success: true, profile: finalProfile, message: 'Profile updated successfully' });
  }

  // Workouts Routes
  if (pathname === '/api/workouts' && req.method === 'GET') {
    return sendJSON(res, 200, { success: true, workouts: localDB.getWorkouts(userId) });
  }

  if (pathname === '/api/workouts' && req.method === 'POST') {
    const body = await parseBody(req);
    const saved = localDB.addWorkout(userId, body);
    return sendJSON(res, 200, { success: true, workout: saved });
  }

  // Posture Routes
  if (pathname === '/api/posture' && req.method === 'POST') {
    const body = await parseBody(req);
    const saved = localDB.addPostureResult(userId, body);
    let advice = 'Good form! Maintain tempo.';
    if (body.issue === 'knee_inward') advice = 'Knees buckling inward: Drive knees outward over mid-toes.';
    return sendJSON(res, 200, { success: true, result: saved, correction: { issue: body.issue || 'none', advice } });
  }

  // Nutrition Routes
  if (pathname === '/api/nutrition/today' && req.method === 'GET') {
    const profile = localDB.getProfile(userId);
    const targets = calculateTargets(profile);
    const logs = localDB.getFoodLogs(userId);
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    logs.forEach(f => {
      calories += Number(f.calories || 0);
      protein += Number(f.protein || 0);
      carbs += Number(f.carbs || 0);
      fat += Number(f.fat || 0);
    });
    return sendJSON(res, 200, {
      success: true,
      targets: { calories: targets.dailyCaloriesTarget, protein: targets.dailyProteinTarget, carbs: targets.dailyCarbsTarget, fat: targets.dailyFatTarget },
      consumed: { calories, protein, carbs, fat },
      remaining: {
        calories: Math.max(0, targets.dailyCaloriesTarget - calories),
        protein: Math.max(0, targets.dailyProteinTarget - protein),
        carbs: Math.max(0, targets.dailyCarbsTarget - carbs),
        fat: Math.max(0, targets.dailyFatTarget - fat)
      },
      foodLogs: logs
    });
  }

  if (pathname === '/api/food-log' && req.method === 'POST') {
    const body = await parseBody(req);
    const macroData = body.foodKey && FOOD_DATABASE[body.foodKey]
      ? calculateFoodMacros(body.foodKey, body.grams || 100)
      : { name: body.name || 'Meal', grams: Number(body.grams || 100), calories: Number(body.calories || 150), protein: Number(body.protein || 10), carbs: Number(body.carbs || 20), fat: Number(body.fat || 4) };
    const saved = localDB.addFoodLog(userId, macroData);
    return sendJSON(res, 200, { success: true, entry: saved });
  }

  if (pathname === '/api/food-replacement' && req.method === 'POST') {
    const body = await parseBody(req);
    const result = getFoodReplacements(body.foodKey || 'cooked_rice', body.grams || 200);
    return sendJSON(res, 200, { success: true, ...result });
  }

  if (pathname === '/api/nutrition/scan-photo' && req.method === 'POST') {
    const body = await parseBody(req);
    const profile = localDB.getProfile(userId);
    const scanResult = await analyzeFoodImage({ base64Image: body.imageBase64, userContext: profile });
    return sendJSON(res, 200, { success: true, scanResult });
  }

  // Grocery Routes
  if (pathname === '/api/grocery' && req.method === 'GET') {
    const items = localDB.getGrocery(userId);
    const profile = localDB.getProfile(userId);
    const total = items.reduce((s, i) => s + (Number(i.cost) || 0), 0);
    const weeklyBudget = normalizeWeeklyBudget(profile.weeklyBudget, 500);
    return sendJSON(res, 200, {
      success: true,
      weeklyBudget,
      estimatedCost: total,
      remainingBudget: weeklyBudget - total,
      items
    });
  }

  if (pathname.startsWith('/api/grocery/') && req.method === 'PUT') {
    const itemId = pathname.split('/')[3];
    const body = await parseBody(req);
    const items = localDB.getGrocery(userId);
    const item = items.find(i => i.id === itemId);
    if (item) Object.assign(item, body);
    localDB.updateGrocery(userId, items);
    return sendJSON(res, 200, { success: true, item });
  }

  // Chat Routes
  if (pathname === '/api/chat' && req.method === 'POST') {
    const body = await parseBody(req);
    const profile = localDB.getProfile(userId);
    const reply = await generateChatResponse({ userMessage: body.message || 'Hello', userContext: profile });
    localDB.addChat(userId, 'user', body.message);
    localDB.addChat(userId, 'assistant', reply);
    return sendJSON(res, 200, { success: true, reply });
  }

  if (pathname === '/api/chat/history' && req.method === 'GET') {
    return sendJSON(res, 200, { success: true, history: localDB.getChatHistory(userId) });
  }

  // Progress Route
  if (pathname === '/api/progress' && req.method === 'GET') {
    return sendJSON(res, 200, {
      success: true,
      progress: {
        formScore: 92,
        nutritionConsistency: 85,
        recoveryScore: 88,
        overallScore: 88,
        streakDays: 7,
        totalReps: 128,
        completedWorkouts: 12,
        weeklyData: [
          { day: 'Mon', formScore: 88, calories: 2350, reps: 42 },
          { day: 'Tue', formScore: 94, calories: 2410, reps: 50 },
          { day: 'Wed', formScore: 90, calories: 2280, reps: 38 },
          { day: 'Thu', formScore: 95, calories: 2450, reps: 55 },
          { day: 'Fri', formScore: 89, calories: 2390, reps: 45 },
          { day: 'Sat', formScore: 93, calories: 2480, reps: 60 },
          { day: 'Sun', formScore: 96, calories: 2420, reps: 50 }
        ]
      }
    });
  }

  sendJSON(res, 404, { success: false, error: 'Endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`⚡ FITVISION AI Native Backend API Server running on port ${PORT}`);
  console.log(`🚀 API URL: http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);
});
