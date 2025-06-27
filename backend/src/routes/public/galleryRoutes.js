import express from 'express';
import galleryController from '../../controllers/galleryController.js';
import { protect, authorize } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// Protect all gallery routes
router.use(protect, authorize('admin', 'editor'));

/**
 * @desc    Get all galleries
 * @route   GET /api/galleries
 * @access  Private (Admin/Editor)
 */
router.get('/', galleryController.getGalleries);

/**
 * @desc    Create new gallery
 * @route   POST /api/galleries
 * @access  Private (Admin/Editor)
 */
router.post('/', 
  upload.array('images', 10), // Limit to 10 images
  galleryController.createGallery
);

/**
 * @desc    Get single gallery
 * @route   GET /api/galleries/:id
 * @access  Private (Admin/Editor)
 */
router.get('/:id', galleryController.getGallery);

/**
 * @desc    Update gallery details
 * @route   PUT /api/galleries/:id
 * @access  Private (Admin/Editor)
 */
router.put('/:id', galleryController.updateGallery);

/**
 * @desc    Delete gallery
 * @route   DELETE /api/galleries/:id
 * @access  Private (Admin/Editor)
 */
router.delete('/:id', galleryController.deleteGallery);

/**
 * @desc    Add images to existing gallery
 * @route   POST /api/galleries/:id/images
 * @access  Private (Admin/Editor)
 */
router.post('/:id/images',
  upload.array('images', 5), // Limit to 5 additional images
  galleryController.addImages
);

/**
 * @desc    Remove image from gallery
 * @route   DELETE /api/galleries/:id/images/:imageId
 * @access  Private (Admin/Editor)
 */
router.delete('/:id/images/:imageId', 
  galleryController.removeImage
);

export default router;