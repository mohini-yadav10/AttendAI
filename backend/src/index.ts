import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import classRoutes from './routes/classes';
import studentRoutes from './routes/students';
import sessionRoutes from './routes/sessions';
import attendanceRoutes from './routes/attendance';
import analyticsRoutes from './routes/analytics';
import auditRoutes from './routes/audit';
import aiRoutes from './routes/ai';

const app: Application = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl/Postman) or matching frontend
      if (!origin || origin.startsWith('http://localhost:') || origin === config.frontendUrl) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev
      }
    },
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'attendai-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai', aiRoutes);

// Catch-all 404 handler for undefined API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.baseUrl}` });
});

// Centralized error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    try {
      await connectDatabase();
    } catch (dbErr: unknown) {
      logger.warn(`Could not connect to MongoDB on start: ${(dbErr as Error).message}. Running with fallback settings.`);
    }

    const server = app.listen(config.port, () => {
      logger.info(`AttendAI Backend server running on port ${config.port} in ${config.nodeEnv} mode`);
    });

    const shutdown = async () => {
      logger.info('Gracefully shutting down AttendAI server...');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
