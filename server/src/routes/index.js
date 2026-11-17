import { Router } from 'express';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/public', publicRoutes);

export default router;
