import { Router } from 'express';
import { listExperience } from '../controllers/experienceController.js';

const router = Router();

router.get('/', listExperience);

export default router;