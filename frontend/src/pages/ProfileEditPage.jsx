import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Edit3, Save, X, Check, Sparkles, Target, DollarSign, Activity } from 'lucide-react';

export default function ProfileEditPage() {
  const { profile, updateProfileData, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 24,
    height: 180,
    weight: 76,
    goal: 'Muscle building',
    activity: 'Active',
    foodPreference: 'Non-vegetarian',
    weeklyBudget: 500
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || 'Alex Vance',
        age: profile.age || 24,
        height: profile.height || 180,
        weight: profile.weight || 76,
        goal: profile.goal || 'Muscle building',
        activity: profile.activity || 'Active',
        foodPreference: profile.foodPreference || 'Non-vegetarian',
        weeklyBudget: Math.max(500, Number(profile.weeklyBudget || 500))
      });
    }
  }, [profile]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');

    const res = await updateProfileData(formData);
    if (res.success) {
      setSuccessMsg('Profile updated successfully! Recalculated target calories & macros.');
      setIsEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-3xl glass-panel border border-lime-accent/25 shadow-glow-teal">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-bioteal-dark border-2 border-lime-accent flex items-center justify-center text-lime-accent shadow-glow-lime">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-ivory">{profile?.name || 'Athlete'}</h1>
            <p className="text-xs font-mono text-lime-accent">
              Target: {profile?.dailyCaloriesTarget || 2450} kcal | Protein: {profile?.dailyProteinTarget || 140}g
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-xl bg-lime-accent text-obsidian font-extrabold text-xs hover:bg-lime-hover shadow-glow-lime flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-lime-accent/30 text-ivory/70 font-semibold text-xs hover:bg-bioteal-dark flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-lime-accent text-obsidian font-extrabold text-xs hover:bg-lime-hover shadow-glow-lime flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-lime-accent/20 border border-lime-accent/50 text-lime-accent font-bold text-sm text-center flex items-center justify-center space-x-2 shadow-glow-lime">
          <Check className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editable Fields Form */}
      <div className="glass-panel p-8 rounded-3xl border border-lime-accent/25 space-y-6 shadow-glow-teal">
        <h2 className="text-lg font-bold text-ivory border-b border-lime-accent/15 pb-3 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-lime-accent" />
          <span>Personal Parameters & Target Preferences</span>
        </h2>

        <div className="space-y-4">
          
          {/* Name */}
          <div className="flex justify-between items-center p-3.5 rounded-2xl bg-obsidian/70 border border-lime-accent/10">
            <span className="text-xs font-mono text-ivory/60">FULL NAME</span>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-bioteal-dark border border-lime-accent/40 rounded-xl px-3 py-1.5 text-sm text-ivory font-bold focus:outline-none"
              />
            ) : (
              <span className="text-sm font-bold text-ivory">{formData.name}</span>
            )}
          </div>

          {/* Age */}
          <div className="flex justify-between items-center p-3.5 rounded-2xl bg-obsidian/70 border border-lime-accent/10">
            <span className="text-xs font-mono text-ivory/60">AGE</span>
            {isEditing ? (
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="bg-bioteal-dark border border-lime-accent/40 rounded-xl px-3 py-1.5 text-sm text-lime-accent font-bold text-right focus:outline-none w-24"
              />
            ) : (
              <span className="text-sm font-bold text-lime-accent">{formData.age} years</span>
            )}
          </div>

          {/* Height */}
          <div className="flex justify-between items-center p-3.5 rounded-2xl bg-obsidian/70 border border-lime-accent/10">
            <span className="text-xs font-mono text-ivory/60">HEIGHT</span>
            {isEditing ? (
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', Number(e.target.value))}
                className="bg-bioteal-dark border border-lime-accent/40 rounded-xl px-3 py-1.5 text-sm text-lime-accent font-bold text-right focus:outline-none w-24"
              />
            ) : (
              <span className="text-sm font-bold text-lime-accent">{formData.height} cm</span>
            )}
          </div>

          {/* Weight */}
          <div className="flex justify-between items-center p-3.5 rounded-2xl bg-obsidian/70 border border-lime-accent/10">
            <span className="text-xs font-mono text-ivory/60">WEIGHT</span>
            {isEditing ? (
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
                className="bg-bioteal-dark border border-lime-accent/40 rounded-xl px-3 py-1.5 text-sm text-lime-accent font-bold text-right focus:outline-none w-24"
              />
            ) : (
              <span className="text-sm font-bold text-lime-accent">{formData.weight} kg</span>
            )}
          </div>

          {/* Goal */}
          <div className="flex justify-between items-center p-3.5 rounded-2xl bg-obsidian/70 border border-lime-accent/10">
            <span className="text-xs font-mono text-ivory/60">FITNESS GOAL</span>
            {isEditing ? (
              <select
                value={formData.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
                className="bg-bioteal-dark border border-lime-accent/40 rounded-xl px-3 py-1.5 text-xs text-lime-accent font-bold focus:outline-none"
              >
                <option value="Weight management">Weight management</option>
                <option value="Muscle building">Muscle building</option>
                <option value="Strength">Strength</option>
                <option value="Endurance">Endurance</option>
                <option value="General fitness">General fitness</option>
              </select>
            ) : (
              <span className="text-sm font-bold text-ivory">{formData.goal}</span>
            )}
          </div>

          {/* Food Preference */}
          <div className="flex justify-between items-center p-3.5 rounded-2xl bg-obsidian/70 border border-lime-accent/10">
            <span className="text-xs font-mono text-ivory/60">FOOD PREFERENCE</span>
            {isEditing ? (
              <select
                value={formData.foodPreference}
                onChange={(e) => handleChange('foodPreference', e.target.value)}
                className="bg-bioteal-dark border border-lime-accent/40 rounded-xl px-3 py-1.5 text-xs text-lime-accent font-bold focus:outline-none"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-vegetarian">Non-vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Custom preferences">Custom preferences</option>
              </select>
            ) : (
              <span className="text-sm font-bold text-ivory">{formData.foodPreference}</span>
            )}
          </div>

          {/* Weekly Budget */}
          <div className="flex justify-between items-center p-3.5 rounded-2xl bg-obsidian/70 border border-lime-accent/10">
            <span className="text-xs font-mono text-ivory/60">WEEKLY FOOD BUDGET</span>
            {isEditing ? (
              <input
                type="number"
                value={formData.weeklyBudget}
                onChange={(e) => handleChange('weeklyBudget', Number(e.target.value))}
                className="bg-bioteal-dark border border-lime-accent/40 rounded-xl px-3 py-1.5 text-sm text-lime-accent font-bold text-right focus:outline-none w-32"
              />
            ) : (
              <span className="text-sm font-bold text-lime-accent">₹{formData.weeklyBudget} / week</span>
            )}
          </div>

        </div>

        <div className="pt-4 border-t border-lime-accent/15 flex justify-between items-center">
          <button
            onClick={logout}
            className="text-xs font-mono text-red-400 hover:underline"
          >
            Sign Out of Account
          </button>
        </div>

      </div>

    </div>
  );
}
