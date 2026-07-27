import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import habitsRoutes from '../modules/habits/habits.routes';
import checkinsRoutes from '../modules/checkins/checkins.routes';
import { AppError } from '../errors/AppError';

const router = Router();

const getServiceInfo = () => ({
  success: true,
  message: 'HabitPulse API Service Ready',
  apiV1BaseUrl: '/api/v1',
  documentation: '/api-docs',
  timestamp: new Date().toISOString(),
});

router.get('/', (_req, res) => {
  res.json(getServiceInfo());
});

router.get('/api/v1', (_req, res) => {
  res.json(getServiceInfo());
});

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/habits', habitsRoutes);
router.use('/api/v1/habits/:habitId/checkin', checkinsRoutes);

router.use((_req, _res, next) => {
  next(new AppError(404, 'Requested endpoint route does not exist. Check /api-docs for available endpoints.'));
});

export default router;
