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

  // Get all pages
  static async getAllPages() {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
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
    return data;
  }

  // Get page by slug
  static async getPageBySlug(slug) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
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
    return data;
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
    return data;
  }

  // Get page by ID
  static async getPageById(id) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create new page
  static async createPage(pageData) {
    // Auto-generate slug if not provided
    if (!pageData.slug && pageData.title) {
      pageData.slug = this.generateSlug(pageData.title);
    }

    // Ensure only one home page exists
    if (pageData.is_home_page) {
      await supabase
        .from('pages')
        .update({ is_home_page: false })
        .neq('id', pageData.id || '');
    }

    const { data, error } = await supabase
      .from('pages')
      .insert([pageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update page by ID
  static async updatePageById(id, pageData) {
    // Ensure only one home page exists
    if (pageData.is_home_page) {
      await supabase
        .from('pages')
        .update({ is_home_page: false })
        .neq('id', id);
    }

    const { data, error } = await supabase
      .from('pages')
      .update(pageData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
export const updatePage = PageService.updatePageById; // Default to update by ID
export const updatePageBySlug = PageService.updatePageBySlug;
export const deletePage = PageService.deletePageById; // Default to delete by ID
export const deletePageBySlug = PageService.deletePageBySlug;

export default PageService;