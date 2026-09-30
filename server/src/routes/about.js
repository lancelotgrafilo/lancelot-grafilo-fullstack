import { Router } from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { doubleCsrfProtection } from '../middleware/csrf.js';

const router = Router();

router.get('/', getAbout);
router.put('/', requireAuth, doubleCsrfProtection, updateAbout);

export default router;