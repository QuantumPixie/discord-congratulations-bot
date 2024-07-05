import { Router } from 'express';
import { sprintController } from '../controllers/sprintController';

const router = Router();

router.post('/sprints', sprintController.createSprint);
router.get('/sprints', sprintController.getAllSprints);
router.patch('/sprints/:id', sprintController.updateSprint);
router.delete('/sprints/:id', sprintController.deleteSprint);

export default router;
