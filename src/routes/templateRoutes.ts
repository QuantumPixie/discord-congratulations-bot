import { Router } from 'express';
import { templateController } from '../controllers/templateController';

const router = Router();

router.post('/templates', templateController.createTemplate);
router.get('/templates', templateController.getAllTemplates);
router.patch('/templates/:id', templateController.updateTemplate);
router.delete('/templates/:id', templateController.deleteTemplate);

export default router;
