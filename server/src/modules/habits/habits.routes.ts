import { Router } from 'express';
import { HabitsController } from './habits.controller';
import { authenticateToken } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { createHabitSchema, updateHabitSchema } from './habits.validation';

const router = Router();

router.use(authenticateToken);

router.get('/', HabitsController.getHabits);
router.post('/', validateRequest(createHabitSchema), HabitsController.createHabit);
router.get('/:id', HabitsController.getHabitById);
router.patch('/:id', validateRequest(updateHabitSchema), HabitsController.updateHabit);
router.delete('/:id', HabitsController.deleteHabit);

export default router;
