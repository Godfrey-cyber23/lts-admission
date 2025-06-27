import express from 'express';
import userController from '../controllers/userController.js';
import dashboardController from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';
import pageRoutes from './public/pageRoutes.js';
import programRoutes from './public/programRoutes.js';
import galleryRoutes from './public/galleryRoutes.js';
import newsRoutes from './public/newsRoutes.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Dashboard routes
router.get('/dashboard/stats', dashboardController.getStats);

// Apply admin authorization to following routes
router.use(authorize('admin', 'superadmin'));

// User management routes
router.route('/users')
  .get(userController.getUsers)
  .post(userController.createUser);

router.route('/users/:id')
  .get(userController.getUser)  // Added missing GET endpoint
  .put(userController.updateUser)
  .delete(userController.deleteUser);

// Special permissions route (Superadmin only)
router.put('/users/:id/permissions', 
  authorize('superadmin'), 
  userController.updatePermissions
);

// Content management sub-routes
router.use('/pages', pageRoutes);
router.use('/programs', programRoutes);
router.use('/gallery', galleryRoutes);
router.use('/news', newsRoutes);

// API documentation route
router.get('/docs', (req, res) => {
  res.json({
    message: 'API Documentation',
    endpoints: {
      dashboard: '/dashboard/stats',
      users: {
        base: '/users',
        specific: '/users/:id',
        permissions: '/users/:id/permissions'
      },
      content: {
        pages: '/pages',
        programs: '/programs',
        gallery: '/gallery',
        news: '/news'
      }
    }
  });
});

export default router;