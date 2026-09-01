import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Scale, ArrowLeft, Plus, Check, Sparkles } from 'lucide-react';

export default function FoodTrackerPage() {
  const navigate = useNavigate();

  const [selectedFood, setSelectedFood] = useState('cooked_rice');
  const [grams, setGrams] = useState(200);
  const [mealType, setMealType] = useState('Lunch');
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Verified Food Database Options
  const foodOptions = [
    { key: 'cooked_rice', name: 'Cooked Rice', calsPer100: 130, p: 2.7, c: 28.0, f: 0.3 },
    { key: 'brown_rice', name: 'Brown Rice', calsPer100: 111, p: 2.6, c: 23.0, f: 0.9 },
    { key: 'chapati', name: 'Whole Wheat Chapati', calsPer100: 120, p: 3.5, c: 20.0, f: 3.0 },
    { key: 'chicken_breast', name: 'Grilled Chicken Breast', calsPer100: 165, p: 31.0, c: 0.0, f: 3.6 },
    { key: 'tofu', name: 'Firm Tofu', calsPer100: 144, p: 17.3, c: 2.8, f: 8.7 },
    { key: 'paneer', name: 'Fresh Paneer', calsPer100: 265, p: 18.0, c: 3.0, f: 20.0 },
    { key: 'boiled_egg', name: 'Boiled Egg', calsPer100: 155, p: 13.0, c: 1.1, f: 10.6 },
    { key: 'dal_tadka', name: 'Yellow Dal Tadka', calsPer100: 105, p: 6.2, c: 14.5, f: 2.8 },
    { key: 'sweet_potato', name: 'Roasted Sweet Potato', calsPer100: 86, p: 1.6, c: 20.1, f: 0.1 }
  ];

  const currentFood = foodOptions.find(f => f.key === selectedFood) || foodOptions[0];
  const factor = (grams || 0) / 100;

  const calculated = {
    calories: Math.round(currentFood.calsPer100 * factor),
    protein: Math.round(currentFood.p * factor * 10) / 10,
    carbs: Math.round(currentFood.c * factor * 10) / 10,
    fat: Math.round(currentFood.f * factor * 10) / 10
  };

  const handleAdd = async () => {
    setAdding(true);
    const res = await api.addFoodLog({
      foodKey: selectedFood,
      name: currentFood.name,
      grams: Number(grams),
      mealType,
      calories: calculated.calories,
      protein: calculated.protein,
      carbs: calculated.carbs,
      fat: calculated.fat
    });

    if (res.success) {
      setSuccessMsg('Added to Today\'s Food Log!');
      setTimeout(() => navigate('/nutrition'), 1200);
    }
    setAdding(false);
  };

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/nutrition')}
          className="px-4 py-2 rounded-xl bg-bioteal-dark border border-lime-accent/30 text-lime-accent text-xs font-mono flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Nutrition</span>
        </button>

        <div className="text-xs font-mono text-lime-accent bg-bioteal-dark px-3 py-1 rounded-md border border-lime-accent/30 flex items-center space-x-2">
          <Scale className="w-4 h-4" />
          <span>PRECISION FOOD SCALE TRACKER</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-ivory">Digital Food Scale Logger</h1>
        <p className="text-sm text-ivory/60">Select food item, enter measured weight, calculate exact verified macros.</p>
      </div>

      {/* Main Logger Card */}
      <div className="glass-panel p-8 rounded-3xl border border-lime-accent/25 shadow-glow-teal space-y-6">
        
        {successMsg && (
          <div className="p-4 rounded-2xl bg-lime-accent/20 border border-lime-accent/50 text-lime-accent font-bold text-sm text-center flex items-center justify-center space-x-2">
            <Check className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Select Food */}
          <div>
            <label className="block text-xs font-mono text-lime-accent mb-1 uppercase">Select Food Item</label>
            <select
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
              className="w-full bg-obsidian border border-lime-accent/30 rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:border-lime-accent font-semibold"
            >
              {foodOptions.map(f => (
                <option key={f.key} value={f.key}>{f.name} ({f.calsPer100} kcal / 100g)</option>
              ))}
            </select>
          </div>

          {/* Enter Grams Weight */}
          <div>
            <label className="block text-xs font-mono text-lime-accent mb-1 uppercase">Measured Weight (Grams)</label>
            <div className="relative">
              <input
                type="number"
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value))}
                className="w-full bg-obsidian border border-lime-accent/30 rounded-xl px-4 py-3 text-lg font-bold text-lime-accent focus:outline-none focus:border-lime-accent"
              />
              <span className="absolute right-4 top-3.5 text-xs font-mono text-ivory/50 font-bold">grams</span>
            </div>
          </div>

          {/* Meal Type Selection */}
          <div>
            <label className="block text-xs font-mono text-lime-accent mb-1 uppercase">Meal Section</label>
            <div className="grid grid-cols-4 gap-2">
              {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMealType(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    mealType === m
                      ? 'bg-bioteal-dark border border-lime-accent text-lime-accent'
                      : 'bg-obsidian border border-lime-accent/10 text-ivory/60'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Calculated Macro Telemetry */}
        <div className="bg-bioteal-dark/80 p-6 rounded-2xl border border-lime-accent/30 space-y-4">
          <div className="text-xs font-mono text-lime-accent font-bold uppercase border-b border-lime-accent/15 pb-2">
            Calculated Verified Macro Telemetry
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-ivory/60 font-mono">CALORIES</div>
              <div className="text-2xl font-black text-lime-accent">{calculated.calories}</div>
              <div className="text-[10px] text-ivory/40">kcal</div>
            </div>

            <div>
              <div className="text-xs text-ivory/60 font-mono">PROTEIN</div>
              <div className="text-2xl font-black text-ivory">{calculated.protein}g</div>
            </div>

            <div>
              <div className="text-xs text-ivory/60 font-mono">CARBS</div>
              <div className="text-2xl font-black text-cyan-400">{calculated.carbs}g</div>
            </div>

            <div>
              <div className="text-xs text-ivory/60 font-mono">FAT</div>
              <div className="text-2xl font-black text-purple-300">{calculated.fat}g</div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAdd}
          disabled={adding}
          className="w-full py-4 rounded-xl bg-lime-accent text-obsidian font-extrabold text-sm hover:bg-lime-hover shadow-glow-lime flex items-center justify-center space-x-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>{adding ? 'Logging Food...' : 'Add to Today\'s Food'}</span>
        </button>

      </div>

    </div>
  );
}
