import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';

import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/application.routes';
import dashboardRoutes from './routes/dashboard.routes';
import scraperRoutes from './routes/scraper.routes';
import aiRoutes from './routes/ai.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './docs/swagger';

// Initialize express app
const app: Application = express();

// Global Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// --- Base Application Routes ---

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Added: Base /api handler so your browser test doesn't 404
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Welcome to the Job Portal API!' });
});

// Added: Base /api/v1 handler 
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Job Portal API v1 is active' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- API Feature Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/scrape/jobs', scraperRoutes);
app.use('/api/v1/ai', aiRoutes);

// Handle undefined routes (This was catching your /api request)
app.all('*', notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;