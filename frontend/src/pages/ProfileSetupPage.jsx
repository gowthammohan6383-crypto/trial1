import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  User, 
  Target, 
  Activity, 
  Utensils, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles 
} from 'lucide-react';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: 'Alex Vance',
    age: 24,
    height: 180,
    weight: 76,
    goal: 'Muscle building',
    activity: 'Active',
    foodPreference: 'Non-vegetarian',
    weeklyBudget: 500
  });

  const [saving, setSaving] = useState(false);

  const updateField = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await api.createProfile(formData);
      if (res.success) {
        await fetchProfile();
        navigate('/dashboard');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { title: 'Personal Info', icon: User },
    { title: 'Fitness Goal', icon: Target },
    { title: 'Activity Level', icon: Activity },
    { title: 'Food Preferences', icon: Utensils },
    { title: 'Weekly Budget', icon: DollarSign }
  ];

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 max-w-2xl mx-auto aurora-bg cyber-grid flex flex-col justify-center">
      
      {/* Wizard Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-bioteal-dark border border-lime-accent/30 text-lime-accent text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP {step} OF 5</span>
        </div>
        <h1 className="text-3xl font-extrabold text-ivory">Create Your AI Profile</h1>
        <p className="text-sm text-ivory/60">Configure your parameters to initialize personalized targets</p>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-between items-center mb-8 px-4">
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < step;
          const isCurrent = stepNum === step;
          return (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-lime-accent text-obsidian'
                    : isCurrent
                    ? 'bg-bioteal-dark border-2 border-lime-accent text-lime-accent shadow-glow-lime'
                    : 'bg-obsidian border border-lime-accent/20 text-ivory/40'
                }`}
              >
                {isDone ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              <span className="text-[10px] font-mono text-ivory/60 hidden sm:block">{s.title}</span>
            </div>
          );
        })}
      </div>

      {/* Step Content Cards */}
      <div className="glass-panel p-8 rounded-3xl border border-lime-accent/25 shadow-glow-teal space-y-6">
        
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-lime-accent border-b border-lime-accent/20 pb-2">Step 1 — Personal Information</h2>
            <div>
              <label className="block text-xs font-mono text-ivory/80 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full bg-obsidian/80 border border-lime-accent/20 rounded-xl px-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime-accent"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-ivory/80 mb-1">Age (yrs)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', Number(e.target.value))}
                  className="w-full bg-obsidian/80 border border-lime-accent/20 rounded-xl px-3 py-2.5 text-sm text-ivory text-center focus:outline-none focus:border-lime-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-ivory/80 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateField('height', Number(e.target.value))}
                  className="w-full bg-obsidian/80 border border-lime-accent/20 rounded-xl px-3 py-2.5 text-sm text-ivory text-center focus:outline-none focus:border-lime-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-ivory/80 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', Number(e.target.value))}
                  className="w-full bg-obsidian/80 border border-lime-accent/20 rounded-xl px-3 py-2.5 text-sm text-ivory text-center focus:outline-none focus:border-lime-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Fitness Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-lime-accent border-b border-lime-accent/20 pb-2">Step 2 — Fitness Goal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Weight management', 'Muscle building', 'Strength', 'Endurance', 'General fitness'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => updateField('goal', g)}
                  className={`p-4 rounded-xl border text-left font-semibold text-sm transition-all ${
                    formData.goal === g
                      ? 'bg-bioteal-dark border-lime-accent text-lime-accent shadow-glow-lime/30'
                      : 'bg-obsidian/60 border-lime-accent/15 text-ivory/80 hover:bg-bioteal-dark/40'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Activity Level */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-lime-accent border-b border-lime-accent/20 pb-2">Step 3 — Daily Activity Level</h2>
            <div className="space-y-2">
              {[
                { name: 'Sedentary', desc: 'Little to no exercise, desk work' },
                { name: 'Light', desc: 'Light exercise 1-3 days/week' },
                { name: 'Moderate', desc: 'Moderate exercise 3-5 days/week' },
                { name: 'Active', desc: 'Heavy exercise 6-7 days/week' },
                { name: 'Very Active', desc: 'Athletic training / physical job' }
              ].map((act) => (
                <button
                  key={act.name}
                  type="button"
                  onClick={() => updateField('activity', act.name)}
                  className={`w-full p-3.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                    formData.activity === act.name
                      ? 'bg-bioteal-dark border-lime-accent text-lime-accent shadow-glow-lime/30'
                      : 'bg-obsidian/60 border-lime-accent/15 text-ivory/80 hover:bg-bioteal-dark/40'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{act.name}</div>
                    <div className="text-xs text-ivory/50">{act.desc}</div>
                  </div>
                  {formData.activity === act.name && <Check className="w-5 h-5 text-lime-accent" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Food Preferences */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-lime-accent border-b border-lime-accent/20 pb-2">Step 4 — Food Preferences</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Vegetarian', 'Non-vegetarian', 'Vegan', 'Custom preferences'].map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => updateField('foodPreference', pref)}
                  className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                    formData.foodPreference === pref
                      ? 'bg-bioteal-dark border-lime-accent text-lime-accent shadow-glow-lime/30'
                      : 'bg-obsidian/60 border-lime-accent/15 text-ivory/80 hover:bg-bioteal-dark/40'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Weekly Food Budget */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-lime-accent border-b border-lime-accent/20 pb-2">Step 5 — Weekly Food Budget</h2>
            <p className="text-xs text-ivory/60">Set your maximum target spending for smart grocery optimization.</p>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lime-accent font-bold">₹</span>
              <input
                type="number"
                min={500}
                step={50}
                value={formData.weeklyBudget}
                onChange={(e) => updateField('weeklyBudget', Math.max(500, Number(e.target.value || 500)))}
                className="w-full bg-obsidian/80 border border-lime-accent/30 rounded-xl pl-9 pr-4 py-3 text-lg font-bold text-lime-accent focus:outline-none focus:border-lime-accent"
              />
            </div>
            <p className="text-xs text-ivory/60">Minimum weekly budget: ₹500</p>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-lime-accent/15">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-lime-accent/20 text-ivory/70 font-semibold text-sm hover:bg-bioteal-dark flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-lime-accent text-obsidian font-bold text-sm hover:bg-lime-hover shadow-glow-lime flex items-center space-x-2"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-lime-accent text-obsidian font-extrabold text-sm hover:bg-lime-hover shadow-glow-lime flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{saving ? 'Calculating Targets...' : 'Create My AI Profile'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
