import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart3, ShieldCheck, Flame, Moon, Sparkles, TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      const res = await api.getProgress();
      if (res.success && res.progress) {
        setData(res.progress);
      }
      setLoading(false);
    }
    loadProgress();
  }, []);

  const formScore = data?.formScore || 92;
  const nutritionConsistency = data?.nutritionConsistency || 81;
  const consistency = data?.consistency || 88;
  const recoveryScore = data?.recoveryScore || 84;
  const overallScore = data?.overallScore || 86;

  const weeklyData = data?.weeklyData || [
    { day: 'Mon', formScore: 88, calories: 2350, reps: 42 },
    { day: 'Tue', formScore: 94, calories: 2410, reps: 50 },
    { day: 'Wed', formScore: 90, calories: 2280, reps: 38 },
    { day: 'Thu', formScore: 95, calories: 2450, reps: 55 },
    { day: 'Fri', formScore: 89, calories: 2390, reps: 45 },
    { day: 'Sat', formScore: 93, calories: 2480, reps: 60 },
    { day: 'Sun', formScore: 96, calories: 2420, reps: 50 }
  ];

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-bioteal-dark border border-lime-accent/30 text-lime-accent text-xs font-mono">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>BIOMETRIC PERFORMANCE TELEMETRY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">Daily Progress Analytics</h1>
        <p className="text-sm text-ivory/60">Comprehensive breakdown of movement form, nutrition macro adherence, and recovery.</p>
      </div>

      {/* Overall Index Rings Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-lime-accent/20 text-center space-y-1">
          <div className="text-xs font-mono text-ivory/60">FORM ACCURACY</div>
          <div className="text-3xl font-black text-lime-accent">{formScore}%</div>
          <div className="text-[10px] text-lime-accent/80 font-mono">Camera MediaPipe Metric</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-lime-accent/20 text-center space-y-1">
          <div className="text-xs font-mono text-ivory/60">NUTRITION</div>
          <div className="text-3xl font-black text-cyan-400">{nutritionConsistency}%</div>
          <div className="text-[10px] text-cyan-400/80 font-mono">USDA Macro Target Adherence</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-lime-accent/20 text-center space-y-1">
          <div className="text-xs font-mono text-ivory/60">CONSISTENCY</div>
          <div className="text-3xl font-black text-ivory">{consistency}%</div>
          <div className="text-[10px] text-ivory/60 font-mono">7-Day Workout Streak</div>
        </div>

        <div className="glass-panel-purple p-5 rounded-2xl border border-ultraviolet-mist/40 text-center space-y-1">
          <div className="text-xs font-mono text-ivory/60">RECOVERY</div>
          <div className="text-3xl font-black text-purple-300">{recoveryScore}%</div>
          <div className="text-[10px] text-purple-300/80 font-mono">CNS & Sleep Balance</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-lime-accent text-center space-y-1 shadow-glow-lime col-span-2 lg:col-span-1">
          <div className="text-xs font-mono text-lime-accent font-bold">OVERALL SCORE</div>
          <div className="text-3xl font-black text-lime-accent">{overallScore}%</div>
          <div className="text-[10px] text-lime-accent font-bold">SYSTEM INDEX</div>
        </div>

      </div>

      {/* Weekly Progress Bar Charts */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-lime-accent/25 space-y-6 shadow-glow-teal">
        <div className="flex justify-between items-center border-b border-lime-accent/15 pb-4">
          <div>
            <h2 className="text-xl font-bold text-ivory flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-lime-accent" />
              <span>7-Day Biomechanical Performance Chart</span>
            </h2>
            <p className="text-xs text-ivory/60 font-mono">Daily Form Score & Completed Reps</p>
          </div>
          <span className="text-xs font-mono text-lime-accent bg-bioteal-dark px-3 py-1 rounded-md border border-lime-accent/30">
            LAST 7 DAYS
          </span>
        </div>

        {/* Custom SVG Bar Chart Rendering */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-8 pb-4 border-b border-lime-accent/10 px-4">
          {weeklyData.map((item, idx) => {
            const heightPercent = (item.formScore / 100) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-mono text-lime-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.formScore}%
                </div>

                <div className="w-full max-w-[40px] bg-bioteal-dark rounded-t-xl overflow-hidden h-44 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-bioteal-dark via-lime-accent/80 to-lime-accent transition-all duration-700 shadow-glow-lime group-hover:bg-lime-accent"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <div className="text-xs font-mono text-ivory/70 font-bold">{item.day}</div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-around items-center text-xs font-mono text-ivory/60 pt-2">
          <span>Total Reps Executed: <strong className="text-lime-accent">128 reps</strong></span>
          <span>Completed Sessions: <strong className="text-lime-accent">12 sessions</strong></span>
        </div>
      </div>

    </div>
  );
}
