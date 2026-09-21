import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const body = {
    status: 'ok',
    database: 'connected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  try {
    await pool.query('SELECT 1');
    res.json(body);
  } catch (err) {
    console.error('Health check failed:', err.message);
    res.status(503).json({ ...body, status: 'degraded', database: 'unreachable' });
  }
});

export default router;