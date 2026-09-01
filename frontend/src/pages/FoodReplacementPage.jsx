import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { RefreshCw, ArrowLeft, Check, Sparkles, Utensils } from 'lucide-react';

export default function FoodReplacementPage() {
  const navigate = useNavigate();

  const [currentFood, setCurrentFood] = useState('cooked_rice');
  const [currentGrams, setCurrentGrams] = useState(200);
  const [replacementResult, setReplacementResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [updatedMsg, setUpdatedMsg] = useState('');

  const fetchAlternatives = async () => {
    setLoading(true);
    const res = await api.getFoodReplacements(currentFood, currentGrams);
    if (res.success) {
      setReplacementResult(res);
      if (res.alternatives?.length > 0) setSelectedAlternative(res.alternatives[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlternatives();
  }, [currentFood, currentGrams]);

  const handleUpdateMeal = async () => {
    if (!selectedAlternative) return;
    const res = await api.addFoodLog({
      foodKey: selectedAlternative.foodKey,
      name: selectedAlternative.name,
      grams: selectedAlternative.grams,
      mealType: 'Lunch',
      calories: selectedAlternative.calories,
      protein: selectedAlternative.protein,
      carbs: selectedAlternative.carbs,
      fat: selectedAlternative.fat
    });

    if (res.success) {
      setUpdatedMsg(`Meal updated! Replaced with ${selectedAlternative.name} (${selectedAlternative.grams}g).`);
      setTimeout(() => navigate('/nutrition'), 1500);
    }
  };

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-8">
      
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
          <RefreshCw className="w-4 h-4" />
          <span>AI FOOD REPLACEMENT ENGINE</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-ivory">Smart Food Replacement</h1>
        <p className="text-sm text-ivory/60">Swap high-glycemic or redundant foods while maintaining macro compliance.</p>
      </div>

      {updatedMsg && (
        <div className="p-4 rounded-2xl bg-lime-accent/20 border border-lime-accent/50 text-lime-accent font-bold text-sm text-center flex items-center justify-center space-x-2">
          <Check className="w-5 h-5" />
          <span>{updatedMsg}</span>
        </div>
      )}

      {/* Target Food Selection Box */}
      <div className="glass-panel p-6 rounded-3xl border border-lime-accent/20 space-y-4">
        <h2 className="text-sm font-mono text-lime-accent font-bold uppercase">Current Food to Replace</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ivory/60 mb-1 font-mono">Food Item</label>
            <select
              value={currentFood}
              onChange={(e) => setCurrentFood(e.target.value)}
              className="w-full bg-obsidian border border-lime-accent/30 rounded-xl px-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime-accent font-bold"
            >
              <option value="cooked_rice">Cooked Rice (260 kcal / 200g)</option>
              <option value="chicken_breast">Grilled Chicken Breast (330 kcal / 200g)</option>
              <option value="paneer">Paneer (530 kcal / 200g)</option>
              <option value="almonds">Raw Almonds (579 kcal / 100g)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-ivory/60 mb-1 font-mono">Portion Size (g)</label>
            <input
              type="number"
              value={currentGrams}
              onChange={(e) => setCurrentGrams(Number(e.target.value))}
              className="w-full bg-obsidian border border-lime-accent/30 rounded-xl px-4 py-2.5 text-sm text-lime-accent font-bold focus:outline-none focus:border-lime-accent"
            />
          </div>
        </div>
      </div>

      {/* Alternatives Cards List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-ivory">Recommended Macro Equivalents</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {replacementResult?.alternatives?.map((alt) => {
            const isSelected = selectedAlternative?.foodKey === alt.foodKey;
            return (
              <div
                key={alt.foodKey}
                onClick={() => setSelectedAlternative(alt)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-bioteal-dark border-2 border-lime-accent shadow-glow-lime scale-102'
                    : 'glass-panel border-lime-accent/15 hover:border-lime-accent/40'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-ivory">{alt.name}</h3>
                    <span className="text-xs text-lime-accent font-mono">{alt.grams}g Portion</span>
                  </div>
                  {isSelected && <Check className="w-6 h-6 text-lime-accent" />}
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-lime-accent/10 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-ivory/50">CALORIES</div>
                    <div className="text-sm font-bold text-lime-accent">{alt.calories} kcal</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ivory/50">PROTEIN</div>
                    <div className="text-sm font-bold text-ivory">{alt.protein}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ivory/50">CARBS</div>
                    <div className="text-sm font-bold text-cyan-400">{alt.carbs}g</div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-mono text-ivory/60 flex items-center justify-between">
                  <span>Calorie Delta vs Original:</span>
                  <span className={alt.calorieDiff <= 0 ? 'text-lime-accent font-bold' : 'text-orange-400 font-bold'}>
                    {alt.calorieDiff > 0 ? `+${alt.calorieDiff}` : alt.calorieDiff} kcal
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <button
          onClick={handleUpdateMeal}
          disabled={!selectedAlternative}
          className="px-10 py-4 rounded-xl bg-lime-accent text-obsidian font-extrabold text-base hover:bg-lime-hover shadow-glow-lime transition-all transform hover:scale-105 inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Update Meal & Recalculate Macros</span>
        </button>
      </div>

    </div>
  );
}
