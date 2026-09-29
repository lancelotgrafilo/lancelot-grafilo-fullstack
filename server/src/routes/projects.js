import { Router } from 'express';
import {
  listProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { doubleCsrfProtection } from '../middleware/csrf.js';

const router = Router();

router.get('/', listProjects);
router.get('/admin/:id', requireAuth, getProjectById);
router.get('/:slug', getProjectBySlug);
router.post('/', requireAuth, doubleCsrfProtection, createProject);
router.put('/:id', requireAuth, doubleCsrfProtection, updateProject);
router.delete('/:id', requireAuth, doubleCsrfProtection, deleteProject);

export default router;