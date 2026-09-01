import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.json({ success: true, user: data.user, session: data.session });
  }

  // Demo fallback authentication
  if (email && password) {
    return res.json({
      success: true,
      user: { id: 'demo-user-123', email, name: email.split('@')[0] },
      token: 'demo-jwt-token-xyz-123'
    });
  }

  return res.status(400).json({ success: false, error: 'Email and password required' });
});

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.json({ success: true, user: data.user, session: data.session });
  }

  return res.json({
    success: true,
    user: { id: 'demo-user-123', email, name: name || email.split('@')[0] },
    token: 'demo-jwt-token-xyz-123'
  });
});

router.post('/logout', async (req, res) => {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
