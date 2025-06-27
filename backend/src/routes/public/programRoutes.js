import express from 'express';
import {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
} from '../../controllers/programController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPrograms);
router.get('/:id', getProgram);

// Protect all following routes
router.use(protect);

// Admin routes
router.post('/', 
  authorize('admin', 'editor'), 
  createProgram
);

router.put('/:id', 
  authorize('admin', 'editor'), 
  updateProgram
);

router.delete('/:id', 
  authorize('admin'), 
  deleteProgram
);

export default router;