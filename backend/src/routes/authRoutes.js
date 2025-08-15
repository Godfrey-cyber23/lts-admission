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

// Public routes
router.post('/register', registerAdmin);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.put('/update-details', updateDetails);
router.put('/update-password', updatePassword);

export default router;