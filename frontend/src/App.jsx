import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VoiceProvider } from './context/VoiceContext';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutPage from './pages/WorkoutPage';
import WorkoutLivePage from './pages/WorkoutLivePage';
import PostureCorrectionPage from './pages/PostureCorrectionPage';
import NutritionPage from './pages/NutritionPage';
import FoodTrackerPage from './pages/FoodTrackerPage';
import FoodReplacementPage from './pages/FoodReplacementPage';
import FoodScannerPage from './pages/FoodScannerPage';
import GroceryPage from './pages/GroceryPage';
import GroceryBudgetPage from './pages/GroceryBudgetPage';
import FitBotPage from './pages/FitBotPage';
import VoiceCoachPage from './pages/VoiceCoachPage';
import ProgressPage from './pages/ProgressPage';
import ProfileEditPage from './pages/ProfileEditPage';

export default function App() {
  return (
    <AuthProvider>
      <VoiceProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-obsidian text-ivory">
            <Navbar />
            <main className="flex-1 pb-16 lg:pb-0">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile/setup" element={<ProfileSetupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/workout" element={<WorkoutPage />} />
                <Route path="/workout/live" element={<WorkoutLivePage />} />
                <Route path="/workout/correction" element={<PostureCorrectionPage />} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/nutrition/food-tracker" element={<FoodTrackerPage />} />
                <Route path="/nutrition/replacement" element={<FoodReplacementPage />} />
                <Route path="/nutrition/scanner" element={<FoodScannerPage />} />
                <Route path="/grocery" element={<GroceryPage />} />
                <Route path="/grocery/budget" element={<GroceryBudgetPage />} />
                <Route path="/fitbot" element={<FitBotPage />} />
                <Route path="/voice-coach" element={<VoiceCoachPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfileEditPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </VoiceProvider>
    </AuthProvider>
  );
}
