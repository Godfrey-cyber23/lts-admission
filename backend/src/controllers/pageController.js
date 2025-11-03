// controllers/pageController.js
import PageService from '../services/PageService.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getPages = catchAsync(async (req, res, next) => {
  const pages = await PageService.getAllPages();

  res.status(200).json({
    status: 'success',
    results: pages.length,
    data: {
      pages
    }
  });
});

export const getPublishedPages = catchAsync(async (req, res, next) => {
  const pages = await PageService.getPublishedPages();

  res.status(200).json({
    status: 'success',
    results: pages.length,
    data: {
      pages
    }
  });
});

export const getPage = catchAsync(async (req, res, next) => {
  const page = await PageService.getPageBySlug(req.params.slug);
  
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
  const page = await PageService.getPublishedPageBySlug(req.params.slug);
  
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
  const pageData = {
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    status: req.body.status || 'draft',
    meta_title: req.body.metaTitle || req.body.meta_title,
    meta_description: req.body.metaDescription || req.body.meta_description,
    is_home_page: req.body.isHomePage || req.body.is_home_page || false,
    is_published: req.body.isPublished || req.body.is_published || false,
    published_at: req.body.publishedAt || req.body.published_at,
    template: req.body.template || 'default',
    featured_image: req.body.featuredImage || req.body.featured_image,
    author_id: req.body.authorId || req.body.author_id,
    category: req.body.category || 'general',
    seo_data: req.body.seoData || req.body.seo_data || {}
  };

  const newPage = await PageService.createPage(pageData);

  res.status(201).json({
    status: 'success',
    data: {
      page: newPage
    }
  });
});

export const updatePage = catchAsync(async (req, res, next) => {
  const pageData = {
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    status: req.body.status,
    meta_title: req.body.metaTitle || req.body.meta_title,
    meta_description: req.body.metaDescription || req.body.meta_description,
    is_home_page: req.body.isHomePage || req.body.is_home_page,
    is_published: req.body.isPublished || req.body.is_published,
    published_at: req.body.publishedAt || req.body.published_at,
    template: req.body.template,
    featured_image: req.body.featuredImage || req.body.featured_image,
    author_id: req.body.authorId || req.body.author_id,
    category: req.body.category,
    seo_data: req.body.seoData || req.body.seo_data
  };

  // Remove undefined values
  Object.keys(pageData).forEach(key => {
    if (pageData[key] === undefined) {
      delete pageData[key];
    }
  });

  const page = await PageService.updatePageBySlug(req.params.slug, pageData);
  
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

export const getHomePage = catchAsync(async (req, res, next) => {
  const page = await PageService.getHomePage();
  
  if (!page) {
    return next(new AppError('Home page not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      page
    }
  });
});


export const deletePage = catchAsync(async (req, res, next) => {
  await PageService.deletePageBySlug(req.params.slug);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Additional controller for ID-based operations
export const getPageById = catchAsync(async (req, res, next) => {
  const page = await PageService.getPageById(req.params.id);
  
  if (!page) {
    return next(new AppError('No page found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      page
    }
  });
});

export const updatePageById = catchAsync(async (req, res, next) => {
  const pageData = { ...req.body };
  
  // Remove undefined values
  Object.keys(pageData).forEach(key => {
    if (pageData[key] === undefined) {
      delete pageData[key];
    }
  });

  const page = await PageService.updatePageById(req.params.id, pageData);
  
  if (!page) {
    return next(new AppError('No page found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      page
    }
  });
});

export const deletePageById = catchAsync(async (req, res, next) => {
  await PageService.deletePageById(req.params.id);

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
  getHomePage,
  createPage,
  updatePage,
  deletePage,
  getPageById,
  updatePageById,
  deletePageById
};

export default pageController;