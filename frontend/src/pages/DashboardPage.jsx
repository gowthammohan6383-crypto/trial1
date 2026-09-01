import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Flame, 
  Dumbbell, 
  Utensils, 
  Droplet, 
  BatteryCharging, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  BarChart3 
} from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [nutritionData, setNutritionData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const profileAnalysis = profile?.analysis || null;

  useEffect(() => {
    async function loadData() {
      const nRes = await api.getNutritionToday();
      if (nRes.success) setNutritionData(nRes);

      const pRes = await api.getProgress();
      if (pRes.success) setProgressData(pRes.progress);
    }
    loadData();
  }, []);

  const caloriesConsumed = nutritionData?.consumed?.calories || 1650;
  const caloriesTarget = nutritionData?.targets?.calories || profile?.dailyCaloriesTarget || 2000;
  const proteinConsumed = nutritionData?.consumed?.protein || 85;
  const proteinTarget = nutritionData?.targets?.protein || profile?.dailyProteinTarget || 120;

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-3xl glass-panel border border-lime-accent/25 shadow-glow-teal">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-lime-accent mb-1">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>AI SYSTEM ONLINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory">
            Welcome back, <span className="text-lime-accent">{profile?.name || 'Athlete'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60">
            Goal: <strong className="text-ivory">{profile?.goal || 'Muscle Building'}</strong> | Activity: {profile?.activity || 'Active'}
          </p>
        </div>

        <Link
          to="/workout"
          className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-lime-accent text-obsidian font-extrabold text-sm hover:bg-lime-hover shadow-glow-lime flex items-center space-x-2 transition-all transform hover:scale-105"
        >
          <Dumbbell className="w-4 h-4" />
          <span>Start Today's Workout</span>
        </Link>
      </div>

      {profileAnalysis && (
        <div className="glass-panel p-6 rounded-3xl border border-lime-accent/25 shadow-glow-teal space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-mono text-lime-accent mb-1">AI PROFILE ANALYSIS</div>
              <h2 className="text-2xl font-extrabold text-ivory">{profileAnalysis.summary}</h2>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-lime-accent/10 border border-lime-accent/40 text-lime-accent text-xs font-mono">
              {profileAnalysis.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-obsidian/70 border border-lime-accent/15 rounded-2xl p-4">
              <div className="text-[10px] font-mono text-ivory/60">WEEKLY BUDGET</div>
              <div className="text-2xl font-black text-lime-accent mt-2">₹{profileAnalysis.weeklyBudget}</div>
            </div>
            <div className="bg-obsidian/70 border border-lime-accent/15 rounded-2xl p-4">
              <div className="text-[10px] font-mono text-ivory/60">FOOD STYLE</div>
              <div className="text-xl font-black text-ivory mt-2">{profileAnalysis.foodPreference}</div>
            </div>
            <div className="bg-obsidian/70 border border-lime-accent/15 rounded-2xl p-4">
              <div className="text-[10px] font-mono text-ivory/60">DAILY TARGET</div>
              <div className="text-xl font-black text-ivory mt-2">{profileAnalysis.caloriesTarget} kcal</div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-ivory/80 font-medium">{profileAnalysis.mealStrategy}</p>
            <ul className="space-y-2 text-sm text-ivory/70">
              {profileAnalysis.recommendations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 text-lime-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Today's Overview Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ivory flex items-center space-x-2">
          <Flame className="w-5 h-5 text-lime-accent" />
          <span>Today's Metric Telemetry</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* Workout Card */}
          <div className="glass-panel p-4 rounded-2xl border border-lime-accent/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/60">
              <span>WORKOUT</span>
              <Dumbbell className="w-4 h-4 text-lime-accent" />
            </div>
            <div className="text-2xl font-black text-lime-accent">8 / 12 <span className="text-xs font-normal text-ivory/60">reps</span></div>
            <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
              <div className="bg-lime-accent h-full w-[66%]" />
            </div>
          </div>

          {/* Calories Card */}
          <div className="glass-panel p-4 rounded-2xl border border-lime-accent/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/60">
              <span>CALORIES</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-xl font-black text-ivory">{caloriesConsumed} <span className="text-xs font-normal text-ivory/60">/ {caloriesTarget} kcal</span></div>
            <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
              <div className="bg-orange-400 h-full" style={{ width: `${Math.min(100, (caloriesConsumed / caloriesTarget) * 100)}%` }} />
            </div>
          </div>

          {/* Protein Card */}
          <div className="glass-panel p-4 rounded-2xl border border-lime-accent/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/60">
              <span>PROTEIN</span>
              <Utensils className="w-4 h-4 text-lime-accent" />
            </div>
            <div className="text-xl font-black text-lime-accent">{proteinConsumed} <span className="text-xs font-normal text-ivory/60">/ {proteinTarget} g</span></div>
            <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
              <div className="bg-lime-accent h-full" style={{ width: `${Math.min(100, (proteinConsumed / proteinTarget) * 100)}%` }} />
            </div>
          </div>

          {/* Water Card */}
          <div className="glass-panel p-4 rounded-2xl border border-lime-accent/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/60">
              <span>WATER</span>
              <Droplet className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400">5 / 8 <span className="text-xs font-normal text-ivory/60">glasses</span></div>
            <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full w-[62%]" />
            </div>
          </div>

          {/* Recovery Card */}
          <div className="glass-panel-purple p-4 rounded-2xl border border-ultraviolet-mist/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/60">
              <span>RECOVERY</span>
              <BatteryCharging className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">84%</div>
            <div className="text-[10px] font-mono text-ivory/60">Optimal Central Nervous System</div>
          </div>

          {/* Streak Card */}
          <div className="glass-panel p-4 rounded-2xl border border-lime-accent/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/60">
              <span>STREAK</span>
              <Sparkles className="w-4 h-4 text-lime-accent animate-bounce" />
            </div>
            <div className="text-2xl font-black text-lime-accent">7 <span className="text-xs font-normal text-ivory/60">Days</span></div>
            <div className="text-[10px] font-mono text-lime-accent/80">🔥 Consistent Streak</div>
          </div>

        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ivory">Quick Access Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link to="/nutrition" className="glass-panel p-6 rounded-3xl border border-lime-accent/20 hover:border-lime-accent/50 transition-all duration-300 group">
            <div className="flex justify-between items-center mb-3">
              <div className="p-3 rounded-2xl bg-bioteal-dark text-lime-accent group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-ivory/40 group-hover:text-lime-accent transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-ivory">Nutrition & Meal Plan</h3>
            <p className="text-xs text-ivory/60 mt-1">Food tracker scale, smart replacements, and AI meal scanner.</p>
          </Link>

          <Link to="/fitbot" className="glass-panel p-6 rounded-3xl border border-lime-accent/20 hover:border-lime-accent/50 transition-all duration-300 group">
            <div className="flex justify-between items-center mb-3">
              <div className="p-3 rounded-2xl bg-bioteal-dark text-lime-accent group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-ivory/40 group-hover:text-lime-accent transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-ivory">FitBot AI Assistant</h3>
            <p className="text-xs text-ivory/60 mt-1">Context-infused AI guidance trained on your calories and workout data.</p>
          </Link>

          <Link to="/progress" className="glass-panel p-6 rounded-3xl border border-lime-accent/20 hover:border-lime-accent/50 transition-all duration-300 group">
            <div className="flex justify-between items-center mb-3">
              <div className="p-3 rounded-2xl bg-bioteal-dark text-lime-accent group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-ivory/40 group-hover:text-lime-accent transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-ivory">Analytics & Progress</h3>
            <p className="text-xs text-ivory/60 mt-1">Form consistency, macro history, and recovery telemetry.</p>
          </Link>

        </div>
      </div>

    </div>
  );
}
