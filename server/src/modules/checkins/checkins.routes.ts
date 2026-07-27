import { Router } from 'express';
import { CheckinsController } from './checkins.controller';
import { authenticateToken } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { checkInSchema } from './checkins.validation';

const router = Router({ mergeParams: true });

router.use(authenticateToken);

router.post('/', validateRequest(checkInSchema), CheckinsController.toggleCheckIn);

export default router;
