import express from 'express';
import helmet from 'helmet';
import healthRouter from './routes/health.js';
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import experienceRouter from './routes/experience.js';
import contactRouter from './routes/contact.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use('/api', apiLimiter);
app.use(express.json({ limit: '10kb' }));

app.use('/api/health', healthRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/contact', contactRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;