import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
} from '../controllers/staffController.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin'), getAllStaff);
router.get('/:id', authorize('admin'), getStaff);
router.post('/', authorize('admin'), createStaff);
router.put('/:id', authorize('admin'), updateStaff);
router.delete('/:id', authorize('admin'), deleteStaff);

export default router;