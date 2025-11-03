// routes/pages.js
import { Router } from 'express';
import { getAllPages, getHomePage, getPageBySlug, createPage, updatePage, deletePage } from '../services/PageService.js';
const router = Router();

// GET /api/pages - Get all pages
router.get('/', async (req, res) => {
  try {
    const pages = await getAllPages();
    res.json({ 
      success: true, 
      data: pages,
      count: pages.length 
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pages',
      error: error.message 
    });
  }
});

// GET /api/pages/home - Get home page
router.get('/home', async (req, res) => {
  try {
    const page = await getHomePage();
    if (!page) {
      return res.status(404).json({ 
        success: false, 
        message: 'Home page not found' 
      });
    }
    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching home page:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch home page',
      error: error.message 
    });
  }
});

// GET /api/pages/:slug - Get page by slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await getPageBySlug(req.params.slug);
    if (!page) {
      return res.status(404).json({ 
        success: false, 
        message: 'Page not found' 
      });
    }
    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch page',
      error: error.message 
    });
  }
});

// POST /api/pages - Create new page
router.post('/', async (req, res) => {
  try {
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

    const page = await createPage(pageData);
    
    res.status(201).json({ 
      success: true, 
      message: 'Page created successfully',
      data: page 
    });
  } catch (error) {
    console.error('Error creating page:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ 
        success: false, 
        message: 'Page with this slug already exists' 
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: 'Failed to create page',
      error: error.message 
    });
  }
});

// PUT /api/pages/:id - Update page
router.put('/:id', async (req, res) => {
  try {
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

    const page = await updatePage(req.params.id, pageData);
    
    res.json({ 
      success: true, 
      message: 'Page updated successfully',
      data: page 
    });
  } catch (error) {
    console.error('Error updating page:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ 
        success: false, 
        message: 'Page with this slug already exists' 
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: 'Failed to update page',
      error: error.message 
    });
  }
});

// DELETE /api/pages/:id - Delete page
router.delete('/:id', async (req, res) => {
  try {
    await deletePage(req.params.id);
    res.json({ 
      success: true, 
      message: 'Page deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete page',
      error: error.message 
    });
  }
});

export default router;