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
} from '../controllers/pageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/published', getPublishedPages);
router.get('/home', getPublishedPage); // This should be a separate controller for home page
router.get('/:slug', getPage);

// Protect all following routes
router.use(protect);

// Admin routes for slug-based operations
router.get('/', authorize('admin', 'editor'), getPages);
router.post('/', authorize('admin', 'editor'), createPage);
router.put('/:slug', authorize('admin', 'editor'), updatePage);
router.delete('/:slug', authorize('admin', 'editor'), deletePage);

// ID-based operations (optional)
router.get('/id/:id', authorize('admin', 'editor'), getPageById);
router.put('/id/:id', authorize('admin', 'editor'), updatePageById);
router.delete('/id/:id', authorize('admin', 'editor'), deletePageById);

export default router;