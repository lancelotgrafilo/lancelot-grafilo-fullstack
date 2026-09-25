import { Router } from 'express';
import { listProjects, getProjectBySlug } from '../controllers/projectsController.js';

const router = Router();

router.get('/', listProjects);
router.get('/:slug', getProjectBySlug);

export default router;