import express from 'express';
import {
  getPages,
  getPublishedPages,
  getPage,
  getPublishedPage,
  createPage,
  updatePage,
  deletePage
} from '../../controllers/pageController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPages);
router.get('/:slug', getPage);

// Protect all following routes
router.use(protect);

// Admin routes
router.post('/', 
  authorize('admin', 'editor'), 
  createPage
);

router.put('/:slug', 
  authorize('admin', 'editor'), 
  updatePage
);

router.delete('/:slug', 
  authorize('admin', 'editor'), 
  deletePage
);

router.get('/', getPublishedPages);
router.get('/:slug', getPublishedPage);

export default router;