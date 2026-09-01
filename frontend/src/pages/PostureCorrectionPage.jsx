import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Play, ArrowLeft, RotateCcw, Video } from 'lucide-react';

export default function PostureCorrectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/workout/live')}
          className="px-4 py-2 rounded-xl bg-bioteal-dark border border-lime-accent/30 text-lime-accent text-xs font-mono flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Camera</span>
        </button>

        <div className="text-xs font-mono text-lime-accent bg-bioteal-dark px-3 py-1 rounded-md border border-lime-accent/30">
          BIOMECHANICAL DIAGNOSTIC ENGINE
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">Posture Error Analysis</h1>
        <p className="text-sm text-ivory/60">Biomechanical feedback and instructional correction breakdown.</p>
      </div>

      {/* Visual Form Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Your Detected Form (Incorrect) */}
        <div className="glass-panel p-6 rounded-3xl border border-red-500/40 space-y-4 shadow-glow-purple">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <span className="text-sm font-bold text-red-400 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>YOUR DETECTED FORM</span>
            </span>
            <span className="text-xs font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
              ISSUE FOUND
            </span>
          </div>

          <div className="h-48 bg-obsidian/80 rounded-2xl border border-red-500/30 flex flex-col items-center justify-center p-4 text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xl">
              ❌
            </div>
            <div className="text-lg font-bold text-ivory">Knees Moving Inward</div>
            <p className="text-xs text-ivory/60">Knee valgus collapse detected at 88° depth. Puts excessive strain on the ACL and knee cap.</p>
          </div>
        </div>

        {/* Correct Form Alignment */}
        <div className="glass-panel p-6 rounded-3xl border border-lime-accent/40 space-y-4 shadow-glow-lime/20">
          <div className="flex items-center justify-between border-b border-lime-accent/20 pb-3">
            <span className="text-sm font-bold text-lime-accent flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>OPTIMAL CORRECT ALIGNMENT</span>
            </span>
            <span className="text-xs font-mono bg-lime-accent/10 text-lime-accent px-2 py-0.5 rounded border border-lime-accent/30">
              TARGET FORM
            </span>
          </div>

          <div className="h-48 bg-bioteal-dark/80 rounded-2xl border border-lime-accent/30 flex flex-col items-center justify-center p-4 text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-lime-accent/10 border border-lime-accent/40 flex items-center justify-center text-lime-accent font-bold text-xl">
              ✅
            </div>
            <div className="text-lg font-bold text-lime-accent">Knees Aligned With Toes</div>
            <p className="text-xs text-ivory/70">Drive knees outward over the 2nd and 3rd toes throughout the movement for max glute activation.</p>
          </div>
        </div>

      </div>

      {/* Correction Instructional Video Section */}
      <div className="glass-panel p-6 rounded-3xl border border-lime-accent/20 space-y-4">
        <div className="flex items-center space-x-2 text-lime-accent font-bold text-lg">
          <Video className="w-5 h-5" />
          <span>Biomechanical Correction Demo</span>
        </div>

        <div className="h-64 bg-obsidian rounded-2xl border border-lime-accent/30 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-scanline opacity-20" />
          <div className="w-16 h-16 rounded-full bg-lime-accent text-obsidian flex items-center justify-center shadow-glow-lime cursor-pointer hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
          <span className="text-xs font-mono text-lime-accent mt-4">PLAY INSTRUCTIONAL SQUAT KNEE FIX VIDEO</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/workout/live')}
          className="px-10 py-4 rounded-xl bg-lime-accent text-obsidian font-black text-base hover:bg-lime-hover shadow-glow-lime inline-flex items-center space-x-2 transition-all transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      </div>

    </div>
  );
}
