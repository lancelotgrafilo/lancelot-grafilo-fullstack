import { Router } from 'express';
import { createMessage } from '../controllers/contactController.js';

const router = Router();

router.post('/', createMessage);

export default router;