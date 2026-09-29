import { Router } from 'express';
import { listSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillsController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { doubleCsrfProtection } from '../middleware/csrf.js';

const router = Router();

router.get('/', listSkills);
router.post('/', requireAuth, doubleCsrfProtection, createSkill);
router.put('/:id', requireAuth, doubleCsrfProtection, updateSkill);
router.delete('/:id', requireAuth, doubleCsrfProtection, deleteSkill);

export default router;