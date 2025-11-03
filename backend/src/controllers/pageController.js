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
    metaTitle: req.body.metaTitle,
    metaDescription: req.body.metaDescription,
    isHomePage: req.body.isHomePage || false,
    isPublished: req.body.isPublished || false,
    publishedAt: req.body.publishedAt,
    template: req.body.template || 'default',
    featuredImage: req.body.featuredImage,
    authorId: req.body.authorId,
    author: req.body.author, // For compatibility
    category: req.body.category || 'general',
    seoData: req.body.seoData || {}
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

export const deletePageById = catchAsync(async (req, res, next) => {
  const pageId = parseInt(req.params.id, 10);
  
  if (isNaN(pageId)) {
    return next(new AppError('Invalid page ID', 400));
  }

  const page = await PageService.getPageById(pageId);
  
  if (!page) {
    return next(new AppError('No page found with that ID', 404));
  }

  await PageService.deletePageById(pageId);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const updatePageByIdentifier = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  const pageData = { ...req.body };

  // Remove undefined values
  Object.keys(pageData).forEach(key => {
    if (pageData[key] === undefined) {
      delete pageData[key];
    }
  });

  let page;
  // Check if the identifier is a number (ID) or a string (slug)
  if (!isNaN(identifier)) {
    // It's an ID
    page = await PageService.updatePageById(parseInt(identifier, 10), pageData);
  } else {
    // It's a slug
    page = await PageService.updatePageBySlug(identifier, pageData);
  }
  
  if (!page) {
    return next(new AppError('No page found with that ID or slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      page
    }
  });
});

export const deletePageByIdentifier = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;

  if (!isNaN(identifier)) {
    await PageService.deletePageById(parseInt(identifier, 10));
  } else {
    await PageService.deletePageBySlug(identifier);
  }

  res.status(204).json({
    status: 'success',
    data: null
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
  deletePageById,
  updatePageById,
  updatePageByIdentifier,
  deletePageByIdentifier,
};

export default pageController;