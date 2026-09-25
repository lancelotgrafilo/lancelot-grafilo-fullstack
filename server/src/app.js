import express from 'express';
import healthRouter from './routes/health.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/api/health', healthRouter);

// These two must be last: notFoundHandler catches unmatched routes,
// and errorHandler catches anything passed to next(err).
app.use(notFoundHandler);
app.use(errorHandler);

export default app;