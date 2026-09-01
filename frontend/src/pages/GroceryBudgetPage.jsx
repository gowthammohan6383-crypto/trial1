import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DollarSign, ArrowLeft, AlertTriangle, Check, RefreshCw, Sparkles } from 'lucide-react';

export default function GroceryBudgetPage() {
  const navigate = useNavigate();

  const [weeklyBudget, setWeeklyBudget] = useState(500);
  const [estimatedCost, setEstimatedCost] = useState(2150);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const loadBudgetData = async () => {
    setLoading(true);
    const res = await api.getBudgetSwaps();
    if (res.success) {
      setWeeklyBudget(Math.max(500, Number(res.weeklyBudget || 500)));
      setEstimatedCost(res.estimatedCost || 2150);
      setSwaps(res.recommendedSwaps || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBudgetData();
  }, []);

  const handleBudgetChange = async (val) => {
    const safeValue = Math.max(500, Number(val || 500));
    setWeeklyBudget(safeValue);
    await api.updateProfile({ weeklyBudget: safeValue });
  };

  const isOverBudget = estimatedCost > weeklyBudget;
  const remaining = weeklyBudget - estimatedCost;

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/grocery')}
          className="px-4 py-2 rounded-xl bg-bioteal-dark border border-lime-accent/30 text-lime-accent text-xs font-mono flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grocery List</span>
        </button>

        <div className="text-xs font-mono text-lime-accent bg-bioteal-dark px-3 py-1 rounded-md border border-lime-accent/30 flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>AI FOOD BUDGET OPTIMIZER</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-ivory">Weekly Food Budget Analyzer</h1>
        <p className="text-sm text-ivory/60">Configure your target ceiling and leverage smart ingredient cost swaps.</p>
      </div>

      {/* Budget Summary Card */}
      <div className="glass-panel p-8 rounded-3xl border border-lime-accent/25 space-y-6 shadow-glow-teal">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          
          <div className="bg-obsidian/80 p-4 rounded-2xl border border-lime-accent/20">
            <div className="text-xs font-mono text-ivory/60">WEEKLY BUDGET TARGET</div>
            <div className="relative mt-1">
              <input
                type="number"
                value={weeklyBudget}
                onChange={(e) => handleBudgetChange(Number(e.target.value))}
                className="w-full bg-bioteal-dark border border-lime-accent/40 rounded-xl px-3 py-2 text-xl font-black text-lime-accent text-center focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-obsidian/80 p-4 rounded-2xl border border-lime-accent/20">
            <div className="text-xs font-mono text-ivory/60">ESTIMATED CART COST</div>
            <div className="text-2xl font-black text-ivory mt-2">₹{estimatedCost}</div>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isOverBudget ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-lime-accent/10 border-lime-accent/40 text-lime-accent'
          }`}>
            <div className="text-xs font-mono">STATUS</div>
            <div className="text-2xl font-black mt-2">
              {isOverBudget ? `EXCEEDED BY ₹${Math.abs(remaining)}` : `SAVING ₹${remaining}`}
            </div>
          </div>

        </div>

        {isOverBudget && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>Budget Exceeded:</strong> Your current 7-day grocery list costs ₹{estimatedCost}, exceeding your ₹{weeklyBudget} budget ceiling. Apply recommended low-cost ingredient swaps below:
            </div>
          </div>
        )}

      </div>

      {/* Low-Cost Ingredient Swaps List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-ivory flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-lime-accent" />
          <span>AI Low-Cost Ingredient Alternatives</span>
        </h2>

        <div className="space-y-4">
          {swaps.map((swap, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl border border-lime-accent/20 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-lime-accent/10 pb-2">
                <div className="flex items-center space-x-3 text-sm font-bold">
                  <span className="text-red-400 line-through">{swap.original}</span>
                  <span className="text-lime-accent">→</span>
                  <span className="text-lime-accent font-extrabold">{swap.substitute}</span>
                </div>

                <div className="text-xs font-mono bg-lime-accent text-obsidian font-extrabold px-3 py-1 rounded-full shadow-glow-lime">
                  Saves ₹{swap.savings}
                </div>
              </div>

              <p className="text-xs text-ivory/70 font-mono">{swap.macroImpact}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
