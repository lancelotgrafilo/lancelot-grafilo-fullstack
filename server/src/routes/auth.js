import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);

export default router;