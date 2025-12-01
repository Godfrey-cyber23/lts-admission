import { Router } from 'express';
import authRoutes from './authRoutes.js';
import admissionRoutes from './admissionRoutes.js';
import pageRoutes from './public/pageRoutes.js';
import programRoutes from './public/programRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import studentRoutes from './studentRoutes.js';
import staffRoutes from './staffRoutes.js';
import academicRoutes from './academicRoutes.js';
import financeRoutes from './financeRoutes.js';
import eventRoutes from './eventRoutes.js';
import subscriberRoutes from './subscriberRoutes.js';

const router = Router();

router.use((req, res, next) => {
  console.log(`Incoming path: ${req.path}`);
  next();
});


router.use('/auth', authRoutes);
router.use('/admissions', admissionRoutes);
router.use('/pages', pageRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/programs', programRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/students', studentRoutes);
router.use('/academic', academicRoutes);
router.use('/finance', financeRoutes);
router.use('/staff', staffRoutes);
router.use('/events', eventRoutes);

export default router;