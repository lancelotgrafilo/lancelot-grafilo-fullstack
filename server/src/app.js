import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import healthRouter from './routes/health.js';
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import experienceRouter from './routes/experience.js';
import contactRouter from './routes/contact.js';
import authRouter from './routes/auth.js';
import messagesRouter from './routes/messages.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use('/api', apiLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/health', healthRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;