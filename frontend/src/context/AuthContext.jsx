import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ id: 'demo-user-123', email: 'athlete@fitvision.ai', name: 'Alex Vance' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.success && res.profile) {
        setProfile(res.profile);
      }
    } catch (e) {
      console.warn('Error fetching profile:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('fitvision_token', res.token || 'demo-token');
      localStorage.setItem('fitvision_userId', res.user.id);
      await fetchProfile();
    }
    return res;
  };

  const register = async (email, password, name) => {
    const res = await api.register({ email, password, name });
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('fitvision_token', res.token || 'demo-token');
      localStorage.setItem('fitvision_userId', res.user.id);
      await fetchProfile();
    }
    return res;
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('fitvision_token');
    localStorage.removeItem('fitvision_userId');
    setUser(null);
    setProfile(null);
  };

  const updateProfileData = async (updates) => {
    const res = await api.updateProfile(updates);
    if (res.success && res.profile) {
      setProfile(res.profile);
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, fetchProfile, updateProfileData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
