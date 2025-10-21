import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'staff'), getAllEvents);
router.get('/:id', authorize('admin', 'staff'), getEvent);
router.post('/', authorize('admin'), createEvent);
router.put('/:id', authorize('admin'), updateEvent);
router.delete('/:id', authorize('admin'), deleteEvent);

export default router;