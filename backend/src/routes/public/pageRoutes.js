// routes/pages.js
import express from 'express';
import {
  getPages,
  getPublishedPages,
  getPage,
  createPage,
  getHomePage,
  deletePageByIdentifier,
  updatePageByIdentifier,
  getPageById,
  updatePageById,
  deletePageById
} from '../../controllers/pageController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/published', getPublishedPages);
router.get('/home', getHomePage);
router.get('/:slug', getPage);

// Protect all following routes
router.use(protect);

// Admin routes
router.get('/', authorize('admin', 'editor', 'staff'), getPages);
router.post('/', authorize('admin', 'editor', 'staff'), createPage);

// Identifier-based operations (works with both ID and slug)
router.put('/:identifier', authorize('admin', 'editor', 'staff'), updatePageByIdentifier);
router.delete('/:identifier', authorize('admin', 'editor', 'staff'), deletePageByIdentifier);

// Explicit ID-based operations (optional)
router.get('/id/:id', authorize('admin', 'editor', 'staff'), getPageById);
router.put('/id/:id', authorize('admin', 'editor', 'staff'), updatePageById);
router.delete('/id/:id', authorize('admin', 'editor', 'staff'), deletePageById);

export default router;