import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { subscribe, unsubscribe, getSubscribers, deleteSubscriber } from '../controllers/userController.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// Public route for subscribing
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail()
], catchAsync(subscribe));

// Admin-only routes
router.use(protect); // All following routes require authentication
router.use(authorize('admin', 'superadmin')); // All following routes require admin role

router.route('/')
  .get(catchAsync(getSubscribers));

router.route('/:id')
  .delete(catchAsync(deleteSubscriber));

export default router;