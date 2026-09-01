import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ') && isSupabaseConfigured) {
    const token = authHeader.split(' ')[1];
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) {
        req.user = user;
        req.userId = user.id;
        return next();
      }
    } catch (err) {
      console.warn('Auth token verification error:', err.message);
    }
  }

  // Fallback demo user header / default ID
  req.userId = req.headers['x-user-id'] || 'demo-user-123';
  req.user = { id: req.userId, email: 'athlete@fitvision.ai' };
  next();
}
