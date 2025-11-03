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
        console.log('🔄 Converting to database fields...');
        console.log('📥 Input page data keys:', Object.keys(pageData));

        const dbFields = {
            // Only include fields that are provided in the update
            ...(pageData.title !== undefined && { title: pageData.title }),
            ...(pageData.slug !== undefined && { slug: pageData.slug }),
            ...(pageData.content !== undefined && { content: pageData.content }),
            ...(pageData.status !== undefined && { status: pageData.status }),

            // Handle meta fields safely
            ...(pageData.metaTitle !== undefined && {
                seo_title: pageData.metaTitle || ''
            }),
            ...(pageData.metaDescription !== undefined && {
                seo_description: pageData.metaDescription || ''
            }),

            ...(pageData.isHomePage !== undefined && {
                is_home_page: Boolean(pageData.isHomePage)
            }),
            ...(pageData.isPublished !== undefined && {
                is_published: Boolean(pageData.isPublished)
            }),

            ...(pageData.publishedAt !== undefined && {
                published_at: pageData.publishedAt
            }),
            ...(pageData.template !== undefined && {
                template: pageData.template
            }),
            ...(pageData.featuredImage !== undefined && {
                featured_image: pageData.featuredImage || ''
            }),
            ...(pageData.authorId !== undefined && {
                author_id: pageData.authorId
            }),
            ...(pageData.category !== undefined && {
                category: pageData.category
            }),
            ...(pageData.seoData !== undefined && {
                seo_data: pageData.seoData || {}
            }),

            // Always update the timestamp
            updated_at: new Date().toISOString()
        };

        console.log('📤 Output database fields:', dbFields);
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
        console.log('🔄 UPDATE PAGE BY ID STARTED ====================');
        console.log('📝 Page ID:', id);
        console.log('📦 Page data received:', pageData);

        try {
            // Use the partial update converter
            const dbData = this.convertPartialUpdateToDatabaseFields(pageData);
            console.log('🗃️ Database data to update:', dbData);

            // Ensure only one home page exists (only if isHomePage is being set to true)
            if (dbData.is_home_page === true) {
                console.log('🏠 Setting as home page - updating others...');
                const { error: homePageError } = await supabase
                    .from('pages')
                    .update({ is_home_page: false })
                    .neq('id', id);

                if (homePageError) {
                    console.error('❌ Error updating other home pages:', homePageError);
                    throw homePageError;
                }
            }

            console.log('📤 Sending update to Supabase...');
            const { data, error } = await supabase
                .from('pages')
                .update(dbData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('❌ Supabase update error details:');
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                console.error('Error hint:', error.hint);
                console.error('Full error object:', JSON.stringify(error, null, 2));
                throw error;
            }

            console.log('✅ Update successful, data:', data);
            return this.convertToFrontendFields(data);
        } catch (error) {
            console.error('💥 CRITICAL ERROR in updatePageById:');
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
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