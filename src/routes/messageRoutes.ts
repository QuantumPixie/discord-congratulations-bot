import { Router } from 'express';
import { messageController } from '../controllers/messageController';

const router = Router();

router.post('/', messageController.sendMessage);
router.get('/', messageController.getAllMessages);
router.get('/user/:username', messageController.getMessagesByUsername);
router.get('/sprint/:sprint', messageController.getMessagesBySprint);

export default router;
