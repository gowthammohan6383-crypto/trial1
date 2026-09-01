import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Camera, Upload, Edit3, Check, ArrowLeft, Sparkles } from 'lucide-react';

export default function FoodScannerPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [editableItems, setEditableItems] = useState([]);
  const [loggedMsg, setLoggedMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      runAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64Image) => {
    setAnalyzing(true);
    setScanResult(null);
    setLoggedMsg('');

    const res = await api.scanFoodPhoto(base64Image);
    if (res.success && res.scanResult) {
      setScanResult(res.scanResult);
      setEditableItems(res.scanResult.items || []);
    }
    setAnalyzing(false);
  };

  const handleItemChange = (idx, field, val) => {
    setEditableItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };

      // Recalculate item macros if grams changed
      if (field === 'grams') {
        const factor = Number(val) / 100;
        updated[idx].calories = Math.round((updated[idx].calories / (updated[idx].grams || 100)) * Number(val));
      }
      return updated;
    });
  };

  const handleSaveAll = async () => {
    for (const item of editableItems) {
      await api.addFoodLog({
        name: item.name,
        grams: Number(item.grams),
        mealType: 'Lunch',
        calories: Number(item.calories),
        protein: Number(item.protein),
        carbs: Number(item.carbs),
        fat: Number(item.fat)
      });
    }
    setLoggedMsg('Scanned items logged to today\'s nutrition!');
    setTimeout(() => navigate('/nutrition'), 1500);
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
          <Camera className="w-4 h-4" />
          <span>AI VISION MEAL SCANNER</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-ivory">AI Meal Photo Recognition</h1>
        <p className="text-sm text-ivory/60">Upload or snapshot meal photos for automated item & macro breakdown.</p>
      </div>

      {loggedMsg && (
        <div className="p-4 rounded-2xl bg-lime-accent/20 border border-lime-accent/50 text-lime-accent font-bold text-sm text-center flex items-center justify-center space-x-2">
          <Check className="w-5 h-5" />
          <span>{loggedMsg}</span>
        </div>
      )}

      {/* Upload & Snapshot Action Box */}
      <div className="glass-panel p-8 rounded-3xl border border-lime-accent/25 text-center space-y-6 shadow-glow-teal">
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-lime-accent text-obsidian font-extrabold text-sm hover:bg-lime-hover shadow-glow-lime flex items-center justify-center space-x-2 transition-all"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Meal Photo</span>
          </button>

          <button
            onClick={() => runAnalysis(null)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-bioteal-dark border border-lime-accent/40 text-lime-accent font-bold text-sm hover:bg-bioteal-dark/80 flex items-center justify-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>Simulate Live Camera Snapshot</span>
          </button>
        </div>

        {analyzing && (
          <div className="py-8 space-y-3">
            <Sparkles className="w-8 h-8 text-lime-accent mx-auto animate-spin" />
            <div className="text-sm font-mono text-lime-accent font-bold">AI ANALYZING MEAL PHOTO...</div>
            <div className="text-xs text-ivory/60">Segmenting image contours & matching neural food index...</div>
          </div>
        )}
      </div>

      {/* Analysis Results & Editable Controls */}
      {editableItems.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-lime-accent/25 space-y-6 shadow-glow-lime/10">
          <div className="flex justify-between items-center border-b border-lime-accent/15 pb-3">
            <h2 className="text-lg font-bold text-ivory flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-lime-accent" />
              <span>Detected Items & Manual Override</span>
            </h2>
            <span className="text-xs font-mono text-lime-accent bg-lime-accent/10 px-2.5 py-1 rounded">
              Confidence: {scanResult?.confidence || '94%'}
            </span>
          </div>

          <p className="text-xs text-ivory/60 font-mono">
            *Visual food recognition is approximate. You can manually adjust food name, quantity, or weight below:
          </p>

          <div className="space-y-4">
            {editableItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-obsidian/80 border border-lime-accent/20 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                
                <div>
                  <label className="block text-[10px] text-ivory/50 font-mono">FOOD NAME</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    className="w-full bg-bioteal-dark/60 border border-lime-accent/30 rounded-lg px-3 py-1.5 text-xs text-ivory font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-ivory/50 font-mono">MEASURED WEIGHT (G)</label>
                  <input
                    type="number"
                    value={item.grams}
                    onChange={(e) => handleItemChange(idx, 'grams', Number(e.target.value))}
                    className="w-full bg-bioteal-dark/60 border border-lime-accent/30 rounded-lg px-3 py-1.5 text-xs text-lime-accent font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-ivory/50 font-mono">CALORIES</label>
                  <input
                    type="number"
                    value={item.calories}
                    onChange={(e) => handleItemChange(idx, 'calories', Number(e.target.value))}
                    className="w-full bg-bioteal-dark/60 border border-lime-accent/30 rounded-lg px-3 py-1.5 text-xs text-ivory font-bold"
                  />
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-ivory/50 font-mono">PROTEIN / CARBS / FAT</div>
                  <div className="text-xs font-mono font-bold text-lime-accent">
                    {item.protein}g / {item.carbs}g / {item.fat}g
                  </div>
                </div>

              </div>
            ))}
          </div>

          <button
            onClick={handleSaveAll}
            className="w-full py-4 rounded-xl bg-lime-accent text-obsidian font-extrabold text-sm hover:bg-lime-hover shadow-glow-lime flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Confirm & Log All Scanned Items</span>
          </button>
        </div>
      )}

    </div>
  );
}
