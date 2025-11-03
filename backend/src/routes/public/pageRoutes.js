// routes/pages.js
import express from 'express';
import {
  getPages,
  getPublishedPages,
  getPage,
  createPage,
  getHomePage,
  deletePageByIdentifier,
  updatePageByIdentifier
} from '../../controllers/pageController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/published', getPublishedPages);
router.get('/home', getHomePage); // Use getHomePage instead of getPublishedPage
router.get('/:slug', getPage);

// Protect all following routes
router.use(protect);

// Admin routes for slug-based operations
router.get('/', authorize('admin', 'editor', 'staff'), getPages);
router.post('/', authorize('admin', 'editor', 'staff'), createPage);
router.delete('/:identifier', authorize('admin', 'editor', 'staff'), deletePageByIdentifier);

router.put('/:identifier', authorize('admin', 'editor', 'staff'), updatePageByIdentifier);

export default router;