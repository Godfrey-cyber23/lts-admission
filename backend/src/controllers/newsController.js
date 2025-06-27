import News from '../models/News.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * @desc    Get all news articles
 * @route   GET /api/news
 * @access  Public
 */
export const getNews = asyncHandler(async (req, res) => {
  // Filter by featured status if query param exists
  const filter = req.query.featured 
    ? { isFeatured: req.query.featured === 'true' } 
    : {};

  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Create new news article
 * @route   POST /api/news
 * @access  Private/Admin
 */
export const createNews = asyncHandler(async (req, res) => {
  // Add logged in user as author
  req.body.author = req.user.id;

  // Handle image upload if present
  if (req.file) {
    const result = await uploadToCloudinary.upload(req.file.path, {
      folder: 'news',
      transformation: { width: 1200, crop: 'limit' }
    });
    req.body.image = {
      url: result.secure_url,
      public_id: result.public_id
    };
  }

  const news = await News.create(req.body);

  res.status(201).json({
    success: true,
    data: news
  });
});

/**
 * @desc    Update news article
 * @route   PUT /api/news/:id
 * @access  Private/Admin
 */
export const updateNews = asyncHandler(async (req, res, next) => {
  let news = await News.findById(req.params.id);

  if (!news) {
    return next(new ErrorResponse(`News article not found with id of ${req.params.id}`, 404));
  }

  // Verify ownership or admin status
  if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this news article', 401));
  }

  // Handle image update if new file provided
  if (req.file) {
    // Delete old image if exists
    if (news.image?.public_id) {
      await uploadToCloudinary.destroy(news.image.public_id);
    }

    const result = await uploadToCloudinary.upload(req.file.path, {
      folder: 'news',
      transformation: { width: 1200, crop: 'limit' }
    });
    req.body.image = {
      url: result.secure_url,
      public_id: result.public_id
    };
  }

  news = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: news
  });
});

/**
 * @desc    Delete news article
 * @route   DELETE /api/news/:id
 * @access  Private/Admin
 */
export const deleteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ErrorResponse(`News article not found with id of ${req.params.id}`, 404));
  }

  // Verify ownership or admin status
  if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this news article', 401));
  }

  // Delete associated image if exists
  if (news.image?.public_id) {
    await uploadToCloudinary.destroy(news.image.public_id);
  }

  await news.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

export const validateNews = (req, res, next) => {
  // Validate required fields
  if (!req.body.title || !req.body.content) {
    return next(new ErrorResponse('Title and content are required', 400));
  }

  // Validate image if present
  if (req.file && !req.file.mimetype.match(/image.*/)) {
    return next(new ErrorResponse('Only image files are allowed', 400));
  }

  next();
};

/**
 * @desc    Toggle featured status of news article
 * @route   PUT /api/news/:id/feature
 * @access  Private/Admin
 */
export const toggleFeatured = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ErrorResponse(`News article not found with id of ${req.params.id}`, 404));
  }

  news.isFeatured = !news.isFeatured;
  await news.save();

  res.status(200).json({
    success: true,
    data: news
  });
});

const newsController = {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  toggleFeatured,
  validateNews
};

export default newsController;