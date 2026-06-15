import 'dotenv/config'; // MUST BE FIRST: Automatically loads .env before any other imports
import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import studentRoutes from './routes/studentRoutes.js';
import { testDbConnection } from './config/db.js';
import { startBusSimulation, stopBusSimulation } from './services/busSimulationService.js';

// Startup check logging
console.log('--- Startup Environment Check ---');
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log('---------------------------------');

const app = express();

// 1. Core Middleware
app.use(cors());
app.use(express.json());

// 2. Initial DB connection check
testDbConnection();

import authRoutes from './routes/authRoutes.js';

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Campus Bus Tracker API Running smoothly 🚀' });
});

// 4. Catch-all for undefined routes (404)
app.use(notFoundHandler);

// 5. Global centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);

  // 6. Start bus movement simulation automatically
  startBusSimulation();
});

// Graceful shutdown — stop simulation on process exit
process.on('SIGINT', () => {
  stopBusSimulation();
  process.exit(0);
});
process.on('SIGTERM', () => {
  stopBusSimulation();
  process.exit(0);
});
