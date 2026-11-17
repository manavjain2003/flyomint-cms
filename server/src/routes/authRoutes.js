import { Router } from 'express';
import { changePassword, forgotPassword, login, me, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { loginLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/forgot-password', loginLimiter, forgotPassword);
router.post('/reset-password', loginLimiter, resetPassword);
router.get('/me', authenticate, me);
router.post('/change-password', authenticate, changePassword);

export default router;
