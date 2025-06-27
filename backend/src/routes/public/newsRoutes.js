import express from 'express';
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  toggleFeatured,
  validateNews
} from '../../controllers/newsController.js';
import { protect, authorize } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

/**
 * @desc    Get all published news articles
 * @route   GET /api/news
 * @access  Public
 */
router.get('/', getNews);

// Protect all following routes
router.use(protect);

/**
 * @desc    Create new news article
 * @route   POST /api/news
 * @access  Private (Admin/Editor)
 */
router.post('/', 
  authorize('admin', 'editor'),
  upload.single('image'),
  validateNews,
  createNews
);

/**
 * @desc    Update news article
 * @route   PUT /api/news/:id
 * @access  Private (Admin/Editor)
 */
router.put('/:id', 
  authorize('admin', 'editor'),
  upload.single('image'),
  validateNews,
  updateNews
);

/**
 * @desc    Delete news article
 * @route   DELETE /api/news/:id
 * @access  Private (Admin/Editor)
 */
router.delete('/:id', 
  authorize('admin', 'editor'),
  deleteNews
);

/**
 * @desc    Toggle featured status
 * @route   PUT /api/news/:id/feature
 * @access  Private (Admin)
 */
router.put('/:id/feature', 
  authorize('admin'),
  toggleFeatured
);

export default router;