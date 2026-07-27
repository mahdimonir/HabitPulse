import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import habitsRoutes from '../modules/habits/habits.routes';
import checkinsRoutes from '../modules/checkins/checkins.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'HabitPulse API v1 Service Ready',
    documentation: '/api-docs',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/habits', habitsRoutes);
router.use('/habits/:habitId/checkin', checkinsRoutes);

export default router;
