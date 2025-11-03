// services/PageService.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export class PageService {
  // Generate slug from title
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  // Convert frontend field names to database field names
  static convertToDatabaseFields(pageData) {
    const dbFields = {
      title: pageData.title,
      slug: pageData.slug,
      content: pageData.content,
      status: pageData.status,
      
      // Map to actual database column names
      seo_title: pageData.metaTitle || pageData.seo_title,
      seo_description: pageData.metaDescription || pageData.seo_description,
      
      is_home_page: pageData.isHomePage || pageData.is_home_page || false,
      is_published: pageData.isPublished || pageData.is_published || pageData.status === 'published',
      
      published_at: pageData.publishedAt || pageData.published_at,
      template: pageData.template || 'default',
      featured_image: pageData.featuredImage || pageData.featured_image,
      author_id: pageData.authorId || pageData.author_id,
      category: pageData.category || 'general',
      seo_data: pageData.seoData || pageData.seo_data || {},
      
      // Timestamps
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(dbFields).forEach(key => {
      if (dbFields[key] === undefined) {
        delete dbFields[key];
      }
    });

    console.log('🗃️ Final database fields:', dbFields);
    return dbFields;
  }

  // Convert database field names to frontend field names
  static convertToFrontendFields(pageData) {
    if (!pageData) return null;
    
    return {
      id: pageData.id,
      title: pageData.title,
      slug: pageData.slug,
      content: pageData.content,
      status: pageData.status,
      metaTitle: pageData.seo_title, // Map from seo_title
      metaDescription: pageData.seo_description, // Map from seo_description
      isHomePage: pageData.is_home_page,
      isPublished: pageData.is_published,
      publishedAt: pageData.published_at,
      template: pageData.template,
      featuredImage: pageData.featured_image,
      authorId: pageData.author_id,
      author: pageData.author_id, // For compatibility
      category: pageData.category,
      seoData: pageData.seo_data,
      createdAt: pageData.created_at,
      updatedAt: pageData.updated_at
    };
  }

  // Get all pages
  static async getAllPages() {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(page => this.convertToFrontendFields(page));
  }

  // Get published pages only
  static async getPublishedPages() {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('is_published', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(page => this.convertToFrontendFields(page));
  }

  // Get page by slug
  static async getPageBySlug(slug) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return this.convertToFrontendFields(data);
  }

  // Get published page by slug
  static async getPublishedPageBySlug(slug) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return this.convertToFrontendFields(data);
  }

  // Get home page
  static async getHomePage() {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('is_home_page', true)
      .eq('is_published', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return this.convertToFrontendFields(data);
  }

  // Get page by ID
  static async getPageById(id) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.convertToFrontendFields(data);
  }

  // Create new page
  static async createPage(pageData) {
    const dbData = this.convertToDatabaseFields(pageData);
    
    // Auto-generate slug if not provided
    if (!dbData.slug && dbData.title) {
      dbData.slug = this.generateSlug(dbData.title);
    }

    // Add created_at timestamp
    dbData.created_at = new Date().toISOString();

    // Ensure only one home page exists
    if (dbData.is_home_page) {
      await supabase
        .from('pages')
        .update({ is_home_page: false })
        .neq('id', dbData.id || '');
    }

    const { data, error } = await supabase
      .from('pages')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }
    return this.convertToFrontendFields(data);
  }

  // Update page by ID
  static async updatePageById(id, pageData) {
    const dbData = this.convertToDatabaseFields(pageData);

    // Ensure only one home page exists
    if (dbData.is_home_page) {
      await supabase
        .from('pages')
        .update({ is_home_page: false })
        .neq('id', id);
    }

    const { data, error } = await supabase
      .from('pages')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }
    return this.convertToFrontendFields(data);
  }

  // Update page by slug
  static async updatePageBySlug(slug, pageData) {
    // First get the page to get its ID
    const page = await this.getPageBySlug(slug);
    if (!page) throw new Error('Page not found');

    return this.updatePageById(page.id, pageData);
  }

  // Delete page by ID
  static async deletePageById(id) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }

  // Delete page by slug
  static async deletePageBySlug(slug) {
    const page = await this.getPageBySlug(slug);
    if (!page) throw new Error('Page not found');

    return this.deletePageById(page.id);
  }
}

// Export individual functions for backward compatibility
export const getAllPages = PageService.getAllPages;
export const getPublishedPages = PageService.getPublishedPages;
export const getPageBySlug = PageService.getPageBySlug;
export const getPublishedPageBySlug = PageService.getPublishedPageBySlug;
export const getHomePage = PageService.getHomePage;
export const getPageById = PageService.getPageById;
export const createPage = PageService.createPage;
export const updatePage = PageService.updatePageById;
export const updatePageBySlug = PageService.updatePageBySlug;
export const deletePage = PageService.deletePageById;
export const deletePageBySlug = PageService.deletePageBySlug;

export default PageService;