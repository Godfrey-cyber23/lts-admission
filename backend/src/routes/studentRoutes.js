import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllStudents,
  getStudent,
  createStudentFromAdmission,
  updateStudent,
  deleteStudent,
  getStudentStats
} from '../controllers/studentController.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'staff'), getAllStudents);
router.get('/stats', authorize('admin', 'staff'), getStudentStats);
router.get('/:id', authorize('admin', 'staff'), getStudent);
router.post('/from-admission', authorize('admin'), createStudentFromAdmission);
router.post('/', authorize('admin'), createStudentFromAdmission);
router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

export default router;