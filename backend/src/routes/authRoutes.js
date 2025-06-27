import express from 'express';
import {
  registerAdmin,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateDetails,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Admin registration (first admin only)
router.post('/register', registerAdmin);

// User login
router.post('/login', login);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Get current user (protected)
router.get('/me', protect, getMe);

// Update user details
router.put('/update-details', protect, updateDetails);

// Update password
router.put('/update-password', protect, updatePassword);

export default router;