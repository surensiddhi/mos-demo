// ==========================================
// API CONFIGURATION - MERCANTILE OFFICE SYSTEMS
// ==========================================

// 🔄 SWITCH THIS TO 'false' WHEN CONNECTING TO SUPABASE
const USE_MOCK_DATA = true;  // ← CHANGE TO false AFTER APPROVAL

// ==========================================
// IMPORT MOCK DATA
// ==========================================
import {
    mockProducts,
    mockSliders,
    mockNews,
    mockTestimonials,
    mockGallery,
    mockSettings
} from './mock-data.js';

// ==========================================
// MOCK API FUNCTIONS
// ==========================================

// ----- Products -----
export async function getProducts(filters = {}) {
    if (USE_MOCK_DATA) {
        let results = [...mockProducts];
        
        // Mock filtering
        if (filters.category) {
            results = results.filter(p => p.category === filters.category);
        }
        if (filters.brand) {
            results = results.filter(p => p.brand === filters.brand);
        }
        if (filters.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.description.toLowerCase().includes(q)
            );
        }
        
        return results;
    } else {
        // 🔗 SUPABASE CONNECTION (DISABLED)
        // const supabase = createClient(...);
        // let query = supabase.from('products').select('*');
        // if (filters.category) query = query.eq('category', filters.category);
        // if (filters.brand) query = query.eq('brand', filters.brand);
        // const { data } = await query;
        // return data;
        
        console.warn('🔗 Supabase not connected. Returning mock data.');
        return mockProducts; // Fallback
    }
}

export async function getProductById(id) {
    if (USE_MOCK_DATA) {
        return mockProducts.find(p => p.id === id) || null;
    } else {
        // const { data } = await supabase.from('products').select('*').eq('id', id).single();
        // return data;
        return mockProducts.find(p => p.id === id) || null;
    }
}

// ----- Sliders -----
export async function getSliders() {
    if (USE_MOCK_DATA) {
        return mockSliders;
    } else {
        // const { data } = await supabase.from('sliders').select('*').eq('is_active', true).order('sort_order');
        // return data;
        return mockSliders;
    }
}

// ----- News -----
export async function getNews(limit = null) {
    if (USE_MOCK_DATA) {
        let results = [...mockNews];
        if (limit) results = results.slice(0, limit);
        return results;
    } else {
        // const { data } = await supabase.from('news').select('*').eq('is_published', true).order('published_date', { ascending: false }).limit(limit || 10);
        // return data;
        return mockNews.slice(0, limit || 10);
    }
}

export async function getNewsById(id) {
    if (USE_MOCK_DATA) {
        return mockNews.find(n => n.id === id) || null;
    } else {
        // const { data } = await supabase.from('news').select('*').eq('id', id).single();
        // return data;
        return mockNews.find(n => n.id === id) || null;
    }
}

// ----- Testimonials -----
export async function getTestimonials() {
    if (USE_MOCK_DATA) {
        return mockTestimonials;
    } else {
        // const { data } = await supabase.from('testimonials').select('*').eq('is_approved', true);
        // return data;
        return mockTestimonials;
    }
}

// ----- Gallery -----
export async function getGalleryItems(limit = null) {
    if (USE_MOCK_DATA) {
        let results = [...mockGallery];
        if (limit) results = results.slice(0, limit);
        return results;
    } else {
        // const { data } = await supabase.from('gallery_items').select('*').eq('is_published', true).order('sort_order').limit(limit || 20);
        // return data;
        return mockGallery.slice(0, limit || 20);
    }
}

// ----- Settings -----
export async function getSettings() {
    if (USE_MOCK_DATA) {
        return mockSettings;
    } else {
        // const { data } = await supabase.from('site_settings').select('*').limit(1).single();
        // return data;
        return mockSettings;
    }
}

// ----- Contact Form -----
export async function submitContact(formData) {
    if (USE_MOCK_DATA) {
        console.log('📨 Mock Contact Form Submission:', formData);
        return { 
            success: true, 
            message: '✅ Thank you! Your message has been received. (MOCK MODE)' 
        };
    } else {
        // const { data, error } = await supabase.from('contact_submissions').insert([formData]);
        // if (error) throw error;
        // return { success: true, data };
        return { 
            success: true, 
            message: '✅ Thank you! Your message has been received.' 
        };
    }
}

// ----- Subscribe -----
export async function subscribeNewsletter(email) {
    if (USE_MOCK_DATA) {
        console.log('📧 Mock Newsletter Subscribe:', email);
        return { success: true };
    } else {
        // const { data } = await supabase.from('subscribers').insert([{ email }]);
        // return { success: true };
        return { success: true };
    }
}

// ----- Search -----
export async function searchSite(query) {
    if (USE_MOCK_DATA) {
        const q = query.toLowerCase();
        const products = mockProducts.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.description.toLowerCase().includes(q)
        );
        const news = mockNews.filter(n => 
            n.title.toLowerCase().includes(q) || 
            n.excerpt.toLowerCase().includes(q)
        );
        return { products, news };
    } else {
        // Search in Supabase
        // const { data: products } = await supabase.from('products').select('*').ilike('name', `%${query}%`);
        // const { data: news } = await supabase.from('news').select('*').ilike('title', `%${query}%`);
        // return { products, news };
        return { products: [], news: [] };
    }
}

// ==========================================
// EXPORT TOGGLE FOR DEBUGGING
// ==========================================
export const isMockMode = USE_MOCK_DATA;
console.log(`🔧 API Mode: ${USE_MOCK_DATA ? 'MOCK' : 'LIVE (Supabase)'}`);