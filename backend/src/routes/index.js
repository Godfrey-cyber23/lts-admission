import { Router } from 'express';
import authRoutes from './authRoutes.js';
import admissionRoutes from './admissionRoutes.js';
import adminRoutes from './adminRoutes.js';
import pageRoutes from './public/pageRoutes.js';
import programRoutes from './public/programRoutes.js';
import galleryRoutes from './public/galleryRoutes.js';
import newsRoutes from './public/newsRoutes.js';

const router = Router();

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Public routes
router.use('/auth', authRoutes);
router.use('/admissions', admissionRoutes);

// Admin routes (protected)
router.use('/admin', adminRoutes);

// Public content routes
router.use('/pages', pageRoutes);
router.use('/programs', programRoutes);
router.use('/gallery', galleryRoutes);
router.use('/news', newsRoutes);

export default router;