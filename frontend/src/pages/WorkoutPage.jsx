import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Dumbbell, Clock, Flame, Play, Shield, Sparkles } from 'lucide-react';

export default function WorkoutPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      const res = await api.getWorkoutCatalog();
      if (res.success && res.catalog) {
        setCatalog(res.catalog);
      }
      setLoading(false);
    }
    loadCatalog();
  }, []);

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-bioteal-dark border border-lime-accent/30 text-lime-accent text-xs font-mono">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>BIOMECHANICAL MODULE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">AI Exercise Library</h1>
        <p className="text-sm text-ivory/60">
          Select a movement module to launch real-time browser camera computer vision posture tracking.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-6 rounded-3xl border border-lime-accent/20 hover:border-lime-accent/50 transition-all duration-300 flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              
              {/* Animation Graphic Placeholder Container */}
              <div className="h-40 bg-bioteal-dark/70 rounded-2xl border border-lime-accent/15 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-lime-accent/40 transition-colors">
                <div className="absolute inset-0 bg-scanline opacity-10" />
                <Dumbbell className="w-12 h-12 text-lime-accent animate-pulse" />
                <span className="text-xs font-mono text-lime-accent mt-2 font-bold uppercase">{item.name} AI SIMULATION</span>
              </div>

              {/* Title & Muscles */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-ivory">{item.name}</h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-bioteal-dark border border-lime-accent/30 text-lime-accent">
                    {item.difficulty}
                  </span>
                </div>
                <p className="text-xs text-lime-accent/80 font-mono mt-1">{item.targetMuscle}</p>
              </div>

              <p className="text-xs text-ivory/70 leading-relaxed font-light">{item.instructions}</p>

              {/* Reps & Duration */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-lime-accent/10">
                <div className="flex items-center space-x-2 text-xs font-mono text-ivory/80">
                  <Flame className="w-4 h-4 text-lime-accent" />
                  <span>{item.targetReps} reps / set</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-ivory/80">
                  <Clock className="w-4 h-4 text-lime-accent" />
                  <span>{item.duration}</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <Link
              to={`/workout/live?exercise=${item.id}`}
              className="w-full py-3.5 rounded-xl bg-lime-accent text-obsidian font-extrabold text-sm hover:bg-lime-hover shadow-glow-lime flex items-center justify-center space-x-2 transition-all transform group-hover:translate-y-[-2px]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start AI Workout</span>
            </Link>

          </div>
        ))}
      </div>

    </div>
  );
}
