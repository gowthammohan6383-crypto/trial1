import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(email, password, name);
      if (res.success) {
        navigate('/profile/setup');
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 aurora-bg cyber-grid">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-lime-accent/20 shadow-glow-teal space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-bioteal-dark border border-lime-accent/40 flex items-center justify-center mx-auto shadow-glow-lime">
            <Sparkles className="w-6 h-6 text-lime-accent" />
          </div>
          <h2 className="text-2xl font-bold text-ivory">Register Account</h2>
          <p className="text-xs text-ivory/60 font-mono">Create your Supabase Fitness Identity</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-lime-accent mb-1 uppercase">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-ivory/40 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Vance"
                className="w-full bg-obsidian/80 border border-lime-accent/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-lime-accent mb-1 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ivory/40 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@fitvision.ai"
                className="w-full bg-obsidian/80 border border-lime-accent/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-lime-accent mb-1 uppercase">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ivory/40 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-obsidian/80 border border-lime-accent/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-lime-accent text-obsidian font-bold text-sm hover:bg-lime-hover shadow-glow-lime transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Profile...' : 'Proceed to Profile Setup'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-lime-accent/10">
          <p className="text-xs text-ivory/60">
            Already have an account?{' '}
            <Link to="/login" className="text-lime-accent font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
