import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateToken } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { registerSchema, loginSchema, refreshSchema, updateProfileSchema, changePasswordSchema } from './auth.validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/refresh', validateRequest(refreshSchema), AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authenticateToken, AuthController.getMe);
router.patch('/profile', authenticateToken, validateRequest(updateProfileSchema), AuthController.updateProfile);
router.patch('/password', authenticateToken, validateRequest(changePasswordSchema), AuthController.changePassword);

export default router;
