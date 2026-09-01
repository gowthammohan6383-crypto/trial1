import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Bot, Send, User, Sparkles, Zap, Mic } from 'lucide-react';

export default function FitBotPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadHistory() {
      const res = await api.getChatHistory();
      if (res.success && res.history?.length > 0) {
        setMessages(res.history.map(h => ({ role: h.role, text: h.message })));
      } else {
        setMessages([
          {
            role: 'assistant',
            text: `Hello ${profile?.name || 'Athlete'}! I am FitBot, your context-infused AI Coach. I have loaded your current profile (${profile?.goal || 'Muscle Building'}), calorie targets, food logs, and workout history. How can I assist you right now?`
          }
        ]);
      }
    }
    loadHistory();
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setSending(true);

    const res = await api.sendChatMessage(userMsg);
    if (res.success && res.reply) {
      setMessages(prev => [...prev, { role: 'assistant', text: res.reply }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Apologies, I encountered a temporary connection issue.' }]);
    }
    setSending(false);
  };

  const sampleQuestions = [
    'What should I eat now?',
    'How many calories do I have left?',
    'Replace rice in my meal.',
    'How many squats do I have left?',
    'Why was my posture wrong?',
    'What do I need to buy this week?'
  ];

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto flex flex-col h-[85vh]">
      
      {/* Header */}
      <div className="p-4 rounded-2xl glass-panel border border-lime-accent/25 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-bioteal-dark border border-lime-accent/40 flex items-center justify-center shadow-glow-lime">
            <Bot className="w-5 h-5 text-lime-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-ivory flex items-center space-x-2">
              <span>FitBot AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-lime-accent animate-ping" />
            </h1>
            <p className="text-[10px] font-mono text-lime-accent/80">
              Target: {profile?.dailyCaloriesTarget || 2450} kcal | Goal: {profile?.goal || 'Muscle Building'}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions Pill Bar */}
      <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-none">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => { setInput(q); }}
            className="px-3 py-1.5 rounded-full bg-bioteal-dark/80 border border-lime-accent/20 text-ivory/80 text-xs font-mono whitespace-nowrap hover:border-lime-accent hover:text-lime-accent transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 glass-panel rounded-3xl border border-lime-accent/20 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-glow-teal">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-ultraviolet-mist text-ivory' : 'bg-bioteal-dark border border-lime-accent/40 text-lime-accent'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-ultraviolet-mist/40 border border-ultraviolet-mist text-ivory font-medium'
                : 'bg-obsidian/80 border border-lime-accent/20 text-ivory/90 font-light'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-center space-x-2 text-xs font-mono text-lime-accent p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>FitBot is analyzing user context & generating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask FitBot about workouts, calories, posture, or groceries..."
          className="flex-1 bg-obsidian border border-lime-accent/30 rounded-2xl px-5 py-3.5 text-sm text-ivory focus:outline-none focus:border-lime-accent font-medium shadow-inner"
        />

        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="px-6 py-3.5 rounded-2xl bg-lime-accent text-obsidian font-extrabold hover:bg-lime-hover shadow-glow-lime disabled:opacity-50 transition-all flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

    </div>
  );
}
