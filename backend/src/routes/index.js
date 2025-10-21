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

const router = Router();

// Add route validation middleware
router.use((req, res, next) => {
  console.log(`Incoming path: ${req.path}`);
  next();
});

router.use('/auth', authRoutes);

// Mount routes with validation
const mountRoutes = () => {
  console.log('Mounting routes...');
  
  try {
    router.use('/auth', authRoutes);
    console.log('✅ Auth routes mounted');
    
    router.use('/admissions', admissionRoutes);
    console.log('✅ Admission routes mounted');
    
    router.use('/pages', pageRoutes);
    console.log('✅ Page routes mounted');
    
    router.use('/programs', programRoutes);
    console.log('✅ Program routes mounted');
    router.use('/dashboard', dashboardRoutes);
    
    router.use('/students', studentRoutes);
    console.log('✅ Student routes mounted');

    router.use('/academic', academicRoutes);
    console.log('✅ Academic routes mounted');
    
    router.use('/finance', financeRoutes);
    console.log('✅ Finance routes mounted');
    
    router.use('/staff', staffRoutes);
    console.log('✅ Staff routes mounted');
    
    router.use('/events', eventRoutes);
    console.log('✅ Event routes mounted');

    return router;
  } catch (err) {
    console.error('Route mounting failed:'.red, err);
    throw err;
  }
};

export default mountRoutes();