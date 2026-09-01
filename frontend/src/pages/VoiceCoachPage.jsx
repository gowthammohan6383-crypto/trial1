import React, { useState, useEffect } from 'react';
import { useVoice } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Mic, MicOff, Volume2, Sparkles, Bot, Radio } from 'lucide-react';

export default function VoiceCoachPage() {
  const { speak, startListening, isSpeaking, isListening, transcript } = useVoice();
  const { profile } = useAuth();

  const [orbState, setOrbState] = useState('IDLE'); // IDLE, LISTENING, THINKING, SPEAKING
  const [lastUserSpeech, setLastUserSpeech] = useState('');
  const [aiSpokenText, setAiSpokenText] = useState('');

  useEffect(() => {
    if (isListening) setOrbState('LISTENING');
    else if (isSpeaking) setOrbState('SPEAKING');
    else setOrbState('IDLE');
  }, [isListening, isSpeaking]);

  const handleMicClick = () => {
    if (isListening) return;

    setOrbState('LISTENING');
    startListening(async (userText) => {
      setLastUserSpeech(userText);
      setOrbState('THINKING');

      // Call backend AI API
      const res = await api.sendChatMessage(userText);
      if (res.success && res.reply) {
        setAiSpokenText(res.reply);
        setOrbState('SPEAKING');
        speak(res.reply, () => {
          setOrbState('IDLE');
        });
      } else {
        const fallbackText = "I heard you! You are on track with your fitness plan today.";
        setAiSpokenText(fallbackText);
        setOrbState('SPEAKING');
        speak(fallbackText, () => setOrbState('IDLE'));
      }
    });
  };

  return (
    <div className="min-h-[85vh] aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto flex flex-col items-center justify-between text-center space-y-8">
      
      {/* Top Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-ultraviolet-mist/40 border border-ultraviolet-mist text-lime-accent text-xs font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse text-lime-accent" />
          <span>NEURAL VOICE MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">Dedicated AI Voice Coach</h1>
        <p className="text-sm text-ivory/60">Hands-free voice coaching & real-time query interface</p>
      </div>

      {/* Large Animated Futuristic AI Orb */}
      <div className="relative flex items-center justify-center py-12">
        
        {/* Outer Pulsing Glow Rings */}
        <div className={`absolute w-72 h-72 rounded-full transition-all duration-700 blur-2xl ${
          orbState === 'LISTENING'
            ? 'bg-red-500/40 scale-125 animate-ping'
            : orbState === 'SPEAKING'
            ? 'bg-lime-accent/40 scale-110 animate-pulse'
            : orbState === 'THINKING'
            ? 'bg-purple-500/40 scale-105 animate-spin'
            : 'bg-bioteal-dark/60 scale-100'
        }`} />

        {/* Core Glowing Orb Mesh */}
        <div
          onClick={handleMicClick}
          className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 border-4 shadow-glass ${
            orbState === 'LISTENING'
              ? 'bg-red-500/20 border-red-500 shadow-glow-purple scale-105'
              : orbState === 'SPEAKING'
              ? 'bg-bioteal-dark border-lime-accent shadow-glow-lime scale-105 animate-orb-float'
              : orbState === 'THINKING'
              ? 'bg-ultraviolet-mist/30 border-purple-400 shadow-glow-purple'
              : 'bg-obsidian/90 border-lime-accent/40 hover:border-lime-accent hover:scale-102'
          }`}
        >
          <Mic className={`w-12 h-12 transition-all ${
            orbState === 'LISTENING'
              ? 'text-red-400 animate-bounce'
              : orbState === 'SPEAKING'
              ? 'text-lime-accent animate-pulse'
              : 'text-ivory/70'
          }`} />

          <span className="text-xs font-mono font-bold tracking-widest mt-2 uppercase text-lime-accent">
            {orbState}
          </span>
        </div>

      </div>

      {/* Spoken Speech Display Card */}
      <div className="w-full max-w-xl glass-panel p-6 rounded-3xl border border-lime-accent/20 space-y-4">
        
        {/* User Spoken Input */}
        {lastUserSpeech && (
          <div className="text-left space-y-1">
            <div className="text-[10px] font-mono text-ivory/50 uppercase">USER SPOKE:</div>
            <div className="text-sm font-bold text-ivory bg-obsidian/60 p-3 rounded-xl border border-lime-accent/10">
              🎙️ "{lastUserSpeech}"
            </div>
          </div>
        )}

        {/* AI Voice Output Response */}
        {aiSpokenText && (
          <div className="text-left space-y-1">
            <div className="text-[10px] font-mono text-lime-accent font-bold uppercase">AI VOICE SPOKE:</div>
            <div className="text-sm font-bold text-lime-accent bg-bioteal-dark/80 p-3 rounded-xl border border-lime-accent/30">
              🔊 "{aiSpokenText}"
            </div>
          </div>
        )}

        {!lastUserSpeech && !aiSpokenText && (
          <p className="text-xs text-ivory/60 font-mono">
            Tap the central orb and ask: <strong className="text-lime-accent">"How many squats do I have left?"</strong>
          </p>
        )}

      </div>

      {/* Mic CTA Button */}
      <button
        onClick={handleMicClick}
        disabled={isListening}
        className="px-8 py-4 rounded-xl bg-lime-accent text-obsidian font-extrabold text-sm hover:bg-lime-hover shadow-glow-lime flex items-center space-x-2 transition-all transform hover:scale-105"
      >
        <Mic className="w-5 h-5" />
        <span>{isListening ? 'Listening to speech...' : 'Tap Orb or Click to Speak'}</span>
      </button>

    </div>
  );
}
