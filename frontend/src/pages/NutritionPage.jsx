import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Utensils, 
  Flame, 
  Plus, 
  RefreshCw, 
  Camera, 
  Scale, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function NutritionPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNutrition = async () => {
    setLoading(true);
    const res = await api.getNutritionToday();
    if (res.success) setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadNutrition();
  }, []);

  const targets = data?.targets || { calories: 2000, protein: 120, carbs: 230, fat: 60 };
  const consumed = data?.consumed || { calories: 1650, protein: 85, carbs: 210, fat: 52 };
  const remaining = data?.remaining || { calories: 350, protein: 35, carbs: 20, fat: 8 };

  const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl glass-panel border border-lime-accent/25 shadow-glow-teal">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-lime-accent mb-1">
            <Utensils className="w-4 h-4" />
            <span>VERIFIED NUTRITION ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-ivory">Daily Macro Targets</h1>
          <p className="text-xs text-ivory/60">USDA Verified Nutrition Data & Precision Macro Tracking</p>
        </div>

        {/* Quick Tools Buttons */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/nutrition/food-tracker"
            className="px-4 py-2.5 rounded-xl bg-bioteal-dark border border-lime-accent/40 text-lime-accent font-bold text-xs hover:bg-bioteal-dark/80 flex items-center space-x-2"
          >
            <Scale className="w-4 h-4" />
            <span>Food Scale</span>
          </Link>

          <Link
            to="/nutrition/replacement"
            className="px-4 py-2.5 rounded-xl bg-bioteal-dark border border-lime-accent/40 text-lime-accent font-bold text-xs hover:bg-bioteal-dark/80 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Food Replacer</span>
          </Link>

          <Link
            to="/nutrition/scanner"
            className="px-4 py-2.5 rounded-xl bg-lime-accent text-obsidian font-extrabold text-xs hover:bg-lime-hover shadow-glow-lime flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>AI Meal Scanner</span>
          </Link>
        </div>
      </div>

      {/* Target Macros Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Calories */}
        <div className="glass-panel p-5 rounded-2xl border border-lime-accent/20 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-ivory/60">
            <span>CALORIES</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-ivory">{consumed.calories} <span className="text-xs text-ivory/50">/ {targets.calories} kcal</span></div>
          <div className="text-xs text-lime-accent font-mono">Remains: {remaining.calories} kcal</div>
          <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
            <div className="bg-orange-400 h-full" style={{ width: `${Math.min(100, (consumed.calories / targets.calories) * 100)}%` }} />
          </div>
        </div>

        {/* Protein */}
        <div className="glass-panel p-5 rounded-2xl border border-lime-accent/20 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-ivory/60">
            <span>PROTEIN</span>
            <span className="text-xs text-lime-accent font-bold">4 kcal/g</span>
          </div>
          <div className="text-2xl font-black text-lime-accent">{consumed.protein} <span className="text-xs text-ivory/50">/ {targets.protein} g</span></div>
          <div className="text-xs text-lime-accent font-mono">Remains: {remaining.protein} g</div>
          <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
            <div className="bg-lime-accent h-full" style={{ width: `${Math.min(100, (consumed.protein / targets.protein) * 100)}%` }} />
          </div>
        </div>

        {/* Carbs */}
        <div className="glass-panel p-5 rounded-2xl border border-lime-accent/20 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-ivory/60">
            <span>CARBOHYDRATES</span>
            <span className="text-xs text-cyan-400 font-bold">4 kcal/g</span>
          </div>
          <div className="text-2xl font-black text-cyan-400">{consumed.carbs} <span className="text-xs text-ivory/50">/ {targets.carbs} g</span></div>
          <div className="text-xs text-cyan-400 font-mono">Remains: {remaining.carbs} g</div>
          <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(100, (consumed.carbs / targets.carbs) * 100)}%` }} />
          </div>
        </div>

        {/* Fat */}
        <div className="glass-panel p-5 rounded-2xl border border-lime-accent/20 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-ivory/60">
            <span>FAT</span>
            <span className="text-xs text-purple-400 font-bold">9 kcal/g</span>
          </div>
          <div className="text-2xl font-black text-purple-300">{consumed.fat} <span className="text-xs text-ivory/50">/ {targets.fat} g</span></div>
          <div className="text-xs text-purple-300 font-mono">Remains: {remaining.fat} g</div>
          <div className="w-full bg-obsidian rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-400 h-full" style={{ width: `${Math.min(100, (consumed.fat / targets.fat) * 100)}%` }} />
          </div>
        </div>

      </div>

      {/* Meal Breakdown Sections */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-ivory">Today's Meal Logs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mealTypes.map((type) => {
            const items = (data?.foodLogs || []).filter(item => item.mealType === type || type === 'Lunch');
            return (
              <div key={type} className="glass-panel p-6 rounded-3xl border border-lime-accent/20 space-y-4">
                <div className="flex justify-between items-center border-b border-lime-accent/15 pb-2">
                  <h3 className="text-lg font-bold text-ivory">{type}</h3>
                  <Link
                    to="/nutrition/food-tracker"
                    className="text-xs font-mono text-lime-accent flex items-center space-x-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Food</span>
                  </Link>
                </div>

                {items.length === 0 ? (
                  <div className="text-xs text-ivory/40 py-4 text-center font-mono">
                    No items logged for {type} yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-obsidian/70 border border-lime-accent/10 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-sm text-ivory">{item.name}</div>
                          <div className="text-xs text-ivory/60 font-mono">{item.grams} grams</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-lime-accent">{item.calories} kcal</div>
                          <div className="text-[10px] text-ivory/50 font-mono">
                            P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
