import { Router } from 'express';
import { listExperience, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { doubleCsrfProtection } from '../middleware/csrf.js';

const router = Router();

router.get('/', listExperience);
router.post('/', requireAuth, doubleCsrfProtection, createExperience);
router.put('/:id', requireAuth, doubleCsrfProtection, updateExperience);
router.delete('/:id', requireAuth, doubleCsrfProtection, deleteExperience);

export default router;