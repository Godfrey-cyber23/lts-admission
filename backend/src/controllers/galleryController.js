import Gallery from '../models/Gallery.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * @desc    Get all galleries
 * @route   GET /api/galleries
 * @access  Public
 */
export const getGalleries = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single gallery
 * @route   GET /api/galleries/:id
 * @access  Public
 */
export const getGallery = asyncHandler(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id).populate('createdBy', 'firstName lastName');

  if (!gallery) {
    return next(new ErrorResponse(`Gallery not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: gallery
  });
});

/**
 * @desc    Create new gallery
 * @route   POST /api/galleries
 * @access  Private/Admin
 */
export const createGallery = asyncHandler(async (req, res) => {
  // Add logged in user as creator
  req.body.createdBy = req.user.id;

  const gallery = await Gallery.create(req.body);

  res.status(201).json({
    success: true,
    data: gallery
  });
});

/**
 * @desc    Update gallery
 * @route   PUT /api/galleries/:id
 * @access  Private/Admin
 */
export const updateGallery = asyncHandler(async (req, res, next) => {
  let gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return next(new ErrorResponse(`Gallery not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is gallery owner or admin
  if (gallery.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this gallery`, 401));
  }

  gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: gallery
  });
});

/**
 * @desc    Delete gallery
 * @route   DELETE /api/galleries/:id
 * @access  Private/Admin
 */
export const deleteGallery = asyncHandler(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return next(new ErrorResponse(`Gallery not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is gallery owner or admin
  if (gallery.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this gallery`, 401));
  }

  // Delete images from cloud storage first
  if (gallery.images && gallery.images.length > 0) {
    await Promise.all(
      gallery.images.map(async (image) => {
        await uploadToCloudinary.destroy(image.public_id);
      })
    );
  }

  await gallery.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Add images to gallery
 * @route   POST /api/galleries/:id/images
 * @access  Private/Admin
 */
export const addImages = asyncHandler(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return next(new ErrorResponse(`Gallery not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is gallery owner or admin
  if (gallery.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this gallery`, 401));
  }

  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse(`Please upload at least one image`, 400));
  }

  // Upload images to cloudinary
  const uploadResults = await Promise.all(
    req.files.map(file => uploadToCloudinary.upload(file.path, {
      folder: `galleries/${gallery._id}`,
      transformation: { width: 1200, height: 800, crop: 'limit' }
    }))
  );

  // Add images to gallery
  const newImages = uploadResults.map(result => ({
    url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height
  }));

  gallery.images = [...gallery.images, ...newImages];
  await gallery.save();

  res.status(200).json({
    success: true,
    data: gallery
  });
});

/**
 * @desc    Remove image from gallery
 * @route   DELETE /api/galleries/:id/images/:imageId
 * @access  Private/Admin
 */
export const removeImage = asyncHandler(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return next(new ErrorResponse(`Gallery not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is gallery owner or admin
  if (gallery.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this gallery`, 401));
  }

  // Find image to remove
  const imageIndex = gallery.images.findIndex(
    img => img._id.toString() === req.params.imageId
  );

  if (imageIndex === -1) {
    return next(new ErrorResponse(`Image not found with id of ${req.params.imageId}`, 404));
  }

  // Remove from cloud storage
  await uploadToCloudinary.destroy(gallery.images[imageIndex].public_id);

  // Remove from array
  gallery.images.splice(imageIndex, 1);
  await gallery.save();

  res.status(200).json({
    success: true,
    data: gallery
  });
});

const galleryController = {
  getGalleries,
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
  addImages,
  removeImage
};

export default galleryController;