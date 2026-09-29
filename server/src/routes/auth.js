import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { loginLimiter } from '../middleware/rateLimiters.js';
import { generateCsrfToken, doubleCsrfProtection } from '../middleware/csrf.js';

const router = Router();

// The client fetches this once to get a CSRF token before logging in
router.get('/csrf-token', (req, res) => {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
});

router.post('/login', doubleCsrfProtection, loginLimiter, login);
router.post('/logout', requireAuth, doubleCsrfProtection, logout);
router.get('/me', requireAuth, me);

export default router;