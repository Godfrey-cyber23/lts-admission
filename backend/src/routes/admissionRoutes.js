import express from 'express';
import {
  getAllAdmissions,
  getAdmission,
  createAdmission,
  updateAdmissionStatus,
  assignAdmission,
  addNote,
  deleteAdmission
} from '../controllers/admissionController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * @desc    Public admission submission
 * @route   POST /api/admissions
 * @access  Public
 */
router.post('/', 
  upload.fields([
    { name: 'underFiveCard', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 }
  ]),
  createAdmission
);

// Protect all following routes
router.use(protect);

/**
 * @desc    Get all admissions
 * @route   GET /api/admissions
 * @access  Private (Admin/Staff)
 */
router.get('/', 
  authorize('admin', 'staff'),
  getAllAdmissions
);

/**
 * @desc    Get single admission
 * @route   GET /api/admissions/:id
 * @access  Private (Admin/Staff)
 */
router.get('/:id', 
  authorize('admin', 'staff'),
  getAdmission
);

/**
 * @desc    Update admission status
 * @route   PUT /api/admissions/:id/status
 * @access  Private (Admin/Staff)
 */
router.put('/:id/status', 
  authorize('admin', 'staff'),
  updateAdmissionStatus
);

/**
 * @desc    Assign admission to staff member
 * @route   PUT /api/admissions/:id/assign
 * @access  Private (Admin)
 */
router.put('/:id/assign', 
  authorize('admin'),
  assignAdmission
);

/**
 * @desc    Add note to admission
 * @route   POST /api/admissions/:id/notes
 * @access  Private (Admin/Staff)
 */
router.post('/:id/notes', 
  authorize('admin', 'staff'),
  addNote
);

/**
 * @desc    Delete admission (Super Admin only)
 * @route   DELETE /api/admissions/:id
 * @access  Private (Super Admin)
 */
router.delete('/:id', 
  authorize('superadmin'),
  deleteAdmission
);

export default router;