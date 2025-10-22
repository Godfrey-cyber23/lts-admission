import { Router } from 'express';
import authRoutes from './authRoutes.js';
import admissionRoutes from './admissionRoutes.js';
import pageRoutes from './public/pageRoutes.js';
import programRoutes from './public/programRoutes.js';
import galleryRoutes from './public/galleryRoutes.js';
import newsRoutes from './public/newsRoutes.js';

const router = Router();

// Add route validation middleware
router.use((req, res, next) => {
  console.log(`Incoming path: ${req.path}`);
  next();
});

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
    
    router.use('/gallery', galleryRoutes);
    console.log('✅ Gallery routes mounted');
    
    router.use('/news', newsRoutes);
    console.log('✅ News routes mounted');
    
    return router;
  } catch (err) {
    console.error('Route mounting failed:'.red, err);
    throw err;
  }
};

export default mountRoutes();