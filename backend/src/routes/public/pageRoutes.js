// routes/pages.js
import express from 'express';
import {
  getPages,
  getPublishedPages,
  getPage,
  getPublishedPage,
  createPage,
  updatePage,
  deletePage,
  getPageById,
  updatePageById,
  deletePageById
} from '../../controllers/pageController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/published', getPublishedPages);
router.get('/home', getPublishedPage); // This should be a separate controller for home page
router.get('/:slug', getPage);

// Protect all following routes
router.use(protect);

// Admin routes for slug-based operations
router.get('/', authorize('admin', 'editor', 'staff'), getPages);
router.post('/', authorize('admin', 'editor', 'staff'), createPage);
router.put('/:slug', authorize('admin', 'editor', 'staff'), updatePage);
router.delete('/:slug', authorize('admin', 'editor', 'staff'), deletePage);

// ID-based operations (optional)
router.get('/id/:id', authorize('admin', 'editor', 'staff'), getPageById);
router.put('/id/:id', authorize('admin', 'editor', 'staff'), updatePageById);
router.delete('/id/:id', authorize('admin', 'editor', 'staff'), deletePageById);

export default router;