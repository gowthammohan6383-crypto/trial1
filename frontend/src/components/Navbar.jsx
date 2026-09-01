import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Dumbbell, 
  Utensils, 
  ShoppingBag, 
  Bot, 
  BarChart3, 
  Mic, 
  User, 
  Menu, 
  X, 
  Flame,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainNavLinks = [
    { path: '/', label: 'Home', icon: Activity },
    { path: '/dashboard', label: 'Dashboard', icon: Flame },
    { path: '/workout', label: 'Workout', icon: Dumbbell },
    { path: '/nutrition', label: 'Nutrition', icon: Utensils },
    { path: '/grocery', label: 'Grocery', icon: ShoppingBag },
    { path: '/fitbot', label: 'FitBot', icon: Bot },
    { path: '/progress', label: 'Progress', icon: BarChart3 },
  ];

  const secondaryNavLinks = [
    { path: '/voice-coach', label: 'Voice Coach', icon: Mic, special: true },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Desktop Navigation */}
      <header className="sticky top-0 z-50 bg-obsidian/85 backdrop-blur-md border-b border-lime-accent/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-bioteal-dark border border-lime-accent/40 flex items-center justify-center shadow-glow-lime transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-lime-accent animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider text-ivory group-hover:text-lime-accent transition-colors">
                FITVISION <span className="text-lime-accent">AI</span>
              </span>
              <span className="block text-[9px] font-mono text-lime-accent/70 tracking-widest uppercase">
                AI Fitness & Voice System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    active
                      ? 'bg-bioteal-dark text-lime-accent border border-lime-accent/30 shadow-glow-lime/20'
                      : 'text-ivory/70 hover:text-ivory hover:bg-bioteal-dark/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-lime-accent' : 'text-ivory/60'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Secondary Actions (Voice Coach & Profile) */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/voice-coach"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all duration-300 ${
                isActive('/voice-coach')
                  ? 'bg-ultraviolet-mist text-ivory border border-lime-accent shadow-glow-purple'
                  : 'bg-ultraviolet-mist/40 hover:bg-ultraviolet-mist/80 text-lime-accent border border-ultraviolet-mist/60'
              }`}
            >
              <Mic className="w-3.5 h-3.5 animate-bounce" />
              <span>🎙️ Voice Coach</span>
            </Link>

            <Link
              to={user ? '/profile' : '/login'}
              className="w-9 h-9 rounded-full bg-bioteal-dark border border-lime-accent/40 flex items-center justify-center text-ivory hover:border-lime-accent transition-all"
              title="Profile Settings"
            >
              <User className="w-4 h-4 text-lime-accent" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-ivory hover:bg-bioteal-dark focus:outline-none"
          >
            {mobileOpen ? <X className="w-6 h-6 text-lime-accent" /> : <Menu className="w-6 h-6 text-lime-accent" />}
          </button>
        </div>
      </header>

      {/* Mobile Top Overlay Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-obsidian/95 border-b border-lime-accent/20 backdrop-blur-xl p-4 space-y-2">
          {mainNavLinks.concat(secondaryNavLinks).map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`w-full px-4 py-3 rounded-xl text-base font-medium flex items-center space-x-3 ${
                  active
                    ? 'bg-bioteal-dark text-lime-accent border border-lime-accent/40'
                    : 'text-ivory/80 hover:bg-bioteal-dark/40'
                }`}
              >
                <Icon className="w-5 h-5 text-lime-accent" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Fixed Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-obsidian/95 border-t border-lime-accent/20 backdrop-blur-xl px-2 py-2 flex items-center justify-around">
        {[
          { path: '/dashboard', label: 'Dashboard', icon: Flame },
          { path: '/workout', label: 'Workout', icon: Dumbbell },
          { path: '/nutrition', label: 'Nutrition', icon: Utensils },
          { path: '/fitbot', label: 'FitBot', icon: Bot },
          { path: '/voice-coach', label: 'Voice', icon: Mic }
        ].map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                active ? 'text-lime-accent font-bold' : 'text-ivory/50 hover:text-ivory'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? 'text-lime-accent' : 'text-ivory/50'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
