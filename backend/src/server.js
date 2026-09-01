import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import postureRoutes from './routes/postureRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import groceryRoutes from './routes/groceryRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json({ limit: '15mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'FITVISION AI Core Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Register Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/posture', postureRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/progress', progressRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[FITVISION AI Backend Error]:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`⚡ FITVISION AI Backend API Server running on port ${PORT}`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);
});
