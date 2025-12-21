import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import categoriesRoutes from './routes/categories.routes';
import requestsRoutes from './routes/requests.routes';
import volunteersRoutes from './routes/volunteers.routes';
import assignmentsRoutes from './routes/assignments.routes';
import reviewsRoutes from './routes/reviews.routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Volunteer Help System API',
    version: '1.0.0',
    description: 'API for matching volunteers with people who need help',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      requests: '/api/requests',
      volunteers: '/api/volunteers',
      assignments: '/api/assignments',
      reviews: '/api/reviews',
    },
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/reviews', reviewsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      code: 'not_found',
      message: 'Endpoint not found',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
