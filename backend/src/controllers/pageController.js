  
import Page from '../models/Page.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getPages = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Page.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const pages = await features.query;

  res.status(200).json({
    status: 'success',
    results: pages.length,
    data: {
      pages
    }
  });
});

export const getPublishedPages = catchAsync(async (req, res, next) => {
  const pages = await Page.find({ isPublished: true })
    .select('-isPublished -lastUpdatedBy');
  
  res.status(200).json({
    status: 'success',
    results: pages.length,
    data: {
      pages
    }
  });
});

export const getPage = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ slug: req.params.slug });
  
  if (!page) {
    return next(new AppError('No page found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      page
    }
  });
});

export const getPublishedPage = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ 
    slug: req.params.slug, 
    isPublished: true 
  });
  
  if (!page) {
    return next(new AppError('No published page found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      page
    }
  });
});

export const createPage = catchAsync(async (req, res, next) => {
  const newPage = await Page.create({
    ...req.body,
    lastUpdatedBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      page: newPage
    }
  });
});

export const updatePage = catchAsync(async (req, res, next) => {
  const page = await Page.findOneAndUpdate(
    { slug: req.params.slug },
    {
      ...req.body,
      lastUpdated: Date.now(),
      lastUpdatedBy: req.user.id
    },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!page) {
    return next(new AppError('No page found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      page
    }
  });
});

export const deletePage = catchAsync(async (req, res, next) => {
  const page = await Page.findOneAndDelete({ slug: req.params.slug });
  
  if (!page) {
    return next(new AppError('No page found with that slug', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const pageController = {
  getPages,
  getPublishedPages,
  getPage,
  getPublishedPage,
  createPage,
  updatePage,
  deletePage
};

export default pageController;