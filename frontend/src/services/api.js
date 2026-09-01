const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('fitvision_token');
  const userId = localStorage.getItem('fitvision_userId') || 'demo-user-123';

  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    return { success: false, error: err.message };
  }
}

export const api = {
  // Auth
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),

  // Profile
  getProfile: () => fetchAPI('/profile'),
  createProfile: (profileData) => fetchAPI('/profile', { method: 'POST', body: JSON.stringify(profileData) }),
  updateProfile: (updates) => fetchAPI('/profile', { method: 'PUT', body: JSON.stringify(updates) }),

  // Workouts
  getWorkoutCatalog: () => fetchAPI('/workouts/catalog'),
  getWorkouts: () => fetchAPI('/workouts'),
  saveWorkout: (session) => fetchAPI('/workouts', { method: 'POST', body: JSON.stringify(session) }),

  // Posture
  savePostureResult: (result) => fetchAPI('/posture', { method: 'POST', body: JSON.stringify(result) }),
  getPostureHistory: () => fetchAPI('/posture'),

  // Nutrition
  getNutritionToday: () => fetchAPI('/nutrition/today'),
  getFoodCatalog: () => fetchAPI('/nutrition/catalog'),
  addFoodLog: (item) => fetchAPI('/food-log', { method: 'POST', body: JSON.stringify(item) }),
  getFoodReplacements: (foodKey, grams) => fetchAPI('/food-replacement', { method: 'POST', body: JSON.stringify({ foodKey, grams }) }),
  scanFoodPhoto: (imageBase64) => fetchAPI('/nutrition/scan-photo', { method: 'POST', body: JSON.stringify({ imageBase64 }) }),

  // Grocery
  getGroceryList: () => fetchAPI('/grocery'),
  updateGroceryItem: (id, updates) => fetchAPI(`/grocery/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  getBudgetSwaps: () => fetchAPI('/grocery/budget-swaps', { method: 'POST' }),

  // FitBot / Voice Chat
  sendChatMessage: (message) => fetchAPI('/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  getChatHistory: () => fetchAPI('/chat/history'),

  // Progress
  getProgress: () => fetchAPI('/progress')
};
