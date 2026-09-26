import express from 'express';
import healthRouter from './routes/health.js';
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import experienceRouter from './routes/experience.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/api/health', healthRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/experience', experienceRouter);

// These two must be last: notFoundHandler catches unmatched routes,
// and errorHandler catches anything passed to next(err).
app.use(notFoundHandler);
app.use(errorHandler);

export default app;