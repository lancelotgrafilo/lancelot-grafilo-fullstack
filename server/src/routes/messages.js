import { Router } from 'express';
import { listMessages, markRead, deleteMessage } from '../controllers/messagesController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { doubleCsrfProtection } from '../middleware/csrf.js';

const router = Router();

router.use(requireAuth);

router.get('/', listMessages);
router.patch('/:id/read', doubleCsrfProtection, markRead);
router.delete('/:id', doubleCsrfProtection, deleteMessage);

export default router;