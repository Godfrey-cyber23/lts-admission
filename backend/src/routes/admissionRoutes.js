import express from 'express';
import admissionController from '../controllers/admissionController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public route for form submission
router.post(
  '/',
  upload.fields([
    { name: 'underFiveCard', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 }
  ]),
  (req, res, next) => {
    console.log('Received files:', req.files);
    console.log('Received body:', req.body);
    next();
  },
  admissionController.createAdmission
);

// Protected routes
router.use(protect);

router.get('/', authorize('admin', 'staff'), admissionController.getAllAdmissions);
router.get('/:id', authorize('admin', 'staff'), admissionController.getAdmission);
router.put('/:id/status', authorize('admin', 'staff'), admissionController.updateAdmissionStatus);
router.put('/:id/assign', authorize('admin'), admissionController.assignAdmission);
router.post('/:id/notes', authorize('admin', 'staff'), admissionController.addNote);
router.delete('/:id', authorize('superadmin'), admissionController.deleteAdmission);

export default router;