import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import academicController from '../controllers/academicController.js';

const router = express.Router();

router.use(protect);

router.get('/classes', authorize('admin', 'staff'), academicController.getAllClasses);
router.get('/classes/:id', authorize('admin', 'staff'), academicController.getClass);
router.post('/classes', authorize('admin'), academicController.createClass);
router.put('/classes/:id', authorize('admin'), academicController.updateClass);
router.delete('/classes/:id', authorize('admin'), academicController.deleteClass);
router.get('/stats', authorize('admin', 'staff'), academicController.getAcademicStats);

export default router;