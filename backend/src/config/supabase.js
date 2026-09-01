// Safely load Supabase if installed, otherwise use local in-memory PostgreSQL simulation
export let supabase = null;
export let isSupabaseConfigured = false;

try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey && supabaseUrl.includes('supabase.co')) {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseKey);
    isSupabaseConfigured = true;
  }
} catch (e) {
  // Supabase module not installed or not configured, fallback active
  isSupabaseConfigured = false;
}

// Local fallback in-memory store for seamless offline/standalone demo operation
class LocalDB {
  constructor() {
    this.profiles = new Map();
    this.workouts = [];
    this.postures = [];
    this.foodLogs = [];
    this.mealPlans = new Map();
    this.groceryLists = new Map();
    this.chats = [];
    this.progress = new Map();

    // Default demo profile for immediate viewing
    const demoId = 'demo-user-123';
    this.profiles.set(demoId, {
      id: demoId,
      name: 'Alex Vance',
      age: 24,
      height: 180,
      weight: 76,
      goal: 'Muscle Building',
      activity: 'Active',
      foodPreference: 'Non-vegetarian',
      weeklyBudget: 500,
      dailyCaloriesTarget: 2450,
      dailyProteinTarget: 140,
      dailyCarbsTarget: 275,
      dailyFatTarget: 70,
      updatedAt: new Date().toISOString()
    });
  }

  getProfile(userId) {
    return this.profiles.get(userId) || this.profiles.get('demo-user-123');
  }

  setProfile(userId, profileData) {
    const existing = this.getProfile(userId) || {};
    const updated = {
      ...existing,
      ...profileData,
      id: userId,
      updatedAt: new Date().toISOString()
    };
    this.profiles.set(userId, updated);
    return updated;
  }

  addWorkout(userId, workout) {
    const entry = { id: `w_${Date.now()}`, userId, ...workout, timestamp: new Date().toISOString() };
    this.workouts.push(entry);
    return entry;
  }

  getWorkouts(userId) {
    return this.workouts.filter(w => w.userId === userId || userId === 'demo-user-123');
  }

  addPostureResult(userId, posture) {
    const entry = { id: `p_${Date.now()}`, userId, ...posture, timestamp: new Date().toISOString() };
    this.postures.push(entry);
    return entry;
  }

  addFoodLog(userId, log) {
    const entry = { id: `f_${Date.now()}`, userId, ...log, date: new Date().toISOString().split('T')[0] };
    this.foodLogs.push(entry);
    return entry;
  }

  getFoodLogs(userId, date) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.foodLogs.filter(f => (f.userId === userId || userId === 'demo-user-123') && f.date === targetDate);
  }

  getGrocery(userId) {
    if (this.groceryLists.has(userId)) {
      return this.groceryLists.get(userId);
    }
    const defaultList = [
      { id: 'g1', name: 'Chicken Breast / Tofu', qty: '1.5 kg', purchased: false, category: 'Protein', cost: 450 },
      { id: 'g2', name: 'Brown Rice / Quinoa', qty: '2 kg', purchased: true, category: 'Carbs', cost: 180 },
      { id: 'g3', name: 'Eggs (Pack of 12)', qty: '2 packs', purchased: false, category: 'Protein', cost: 160 },
      { id: 'g4', name: 'Spinach & Broccoli', qty: '1 kg', purchased: false, category: 'Veggies', cost: 120 },
      { id: 'g5', name: 'Greek Yogurt / Curd', qty: '1 kg', purchased: true, category: 'Dairy', cost: 140 },
      { id: 'g6', name: 'Bananas', qty: '12 pcs', purchased: false, category: 'Fruits', cost: 60 }
    ];
    this.groceryLists.set(userId, defaultList);
    return defaultList;
  }

  updateGrocery(userId, items) {
    this.groceryLists.set(userId, items);
    return items;
  }

  addChat(userId, role, message) {
    const entry = { id: `c_${Date.now()}`, userId, role, message, timestamp: new Date().toISOString() };
    this.chats.push(entry);
    return entry;
  }

  getChatHistory(userId) {
    return this.chats.filter(c => c.userId === userId || userId === 'demo-user-123').slice(-20);
  }
}

export const localDB = new LocalDB();
