import express from 'express';
import { protect } from '../middleware/auth.js';
import { getStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Protect all dashboard routes
router.use(protect);

// Dashboard statistics route
router.get('/stats', getStats);

export default router;