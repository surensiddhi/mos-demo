// ==========================================
// MAIN APPLICATION - MERCANTILE OFFICE SYSTEMS
// ==========================================

import {
    getSliders,
    getProducts,
    getNews,
    getTestimonials,
    getSettings,
    isMockMode
} from './api.js';

import {
    placeholder,
    placeholderSlide,
    brandLogo,
    attachImageFallbacks
} from './placeholders.js';

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🏢 Mercantile Office Systems Loaded');
    console.log(`🔧 Mode: ${isMockMode ? 'MOCK' : 'LIVE'}`);
    
    await initAll();
});

// ---- Initialize Everything ----
async function initAll() {
    await initSlider();
    await initProducts();
    await initNews();
    await initTestimonials();
    await initFooter();
    await initHeader();
    await initMobileMenu();
    await initWhatsApp();
    await initYear();
    initBrandLogos();
    initPlaceholderLinks();

    // Catch any image that fails to load and swap in a clean placeholder
    attachImageFallbacks(document);
    
    // Show mock mode banner (optional)
    if (isMockMode) {
        showMockBanner();
    }
}

// ---- Mock Mode Banner ----
function showMockBanner() {
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #d4a030;
        color: #1a1a2e;
        padding: 8px 20px;
        border-radius: 50px;
        font-size: 12px;
        font-weight: 600;
        z-index: 9998;
        box-shadow: 0 4px 20px rgba(212, 160, 48, 0.3);
        letter-spacing: 0.5px;
    `;
    banner.textContent = '🔄 MOCK MODE - Static Data Only';
    document.body.appendChild(banner);
}

// ---- Header ----
async function initHeader() {
    try {
        const settings = await getSettings();
        if (settings) {
            // Update logo if needed
            // document.querySelector('#site-logo').src = settings.logo_url || '/src/images/logo.svg';
        }
    } catch (error) {
        console.error('Header error:', error);
    }
}

// ---- Footer ----
async function initFooter() {
    try {
        const settings = await getSettings();
        if (settings) {
            const address = document.querySelector('#footer-address');
            const phone = document.querySelector('#footer-phone');
            const email = document.querySelector('#footer-email');
            
            if (address) address.textContent = settings.address || 'Kathmandu, Nepal';
            if (phone) phone.textContent = settings.phone || '+977-1-XXXXXXXX';
            if (email) email.textContent = settings.email || 'info@mercantile.com.np';
            
            // Social links
            const socialLinks = document.querySelector('#social-links');
            if (socialLinks) {
                const links = [];
                if (settings.facebook_url) links.push({ icon: 'fab fa-facebook-f', url: settings.facebook_url });
                if (settings.youtube_url) links.push({ icon: 'fab fa-youtube', url: settings.youtube_url });
                if (settings.instagram_url) links.push({ icon: 'fab fa-instagram', url: settings.instagram_url });
                if (settings.linkedin_url) links.push({ icon: 'fab fa-linkedin-in', url: settings.linkedin_url });
                
                socialLinks.innerHTML = links.map(l => `
                    <a href="${l.url}" target="_blank" rel="noopener noreferrer">
                        <i class="${l.icon}"></i>
                    </a>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Footer error:', error);
    }
}

// ---- Slider ----
async function initSlider() {
    const slides = await getSliders();
    const track = document.querySelector('#slider-track');
    const dots = document.querySelector('#slider-dots');
    
    if (!track || slides.length === 0) return;
    
    track.innerHTML = slides.map((slide, index) => `
        <div class="slide" data-index="${index}">
            <div class="slide-bg" style="background-image: url('${slide.image || placeholderSlide(slide.subtitle || '')}')"></div>
            <div class="container">
                <div class="slide-content">
                    ${slide.title ? `<span class="slide-tag">${slide.title}</span>` : ''}
                    <h1>${slide.subtitle || 'Welcome'}</h1>
                    <p>${slide.description || ''}</p>
                    <div class="btn-group">
                        ${slide.button_url ? `
                            <a href="${slide.button_url}" class="btn btn-primary">
                                ${slide.button_text || 'Learn More'} <i class="fas fa-arrow-right"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Preload slide backgrounds with fallback to placeholder
    slides.forEach((slide, index) => {
        if (!slide.image) return;
        const probe = new Image();
        probe.onerror = () => {
            const el = track.querySelector(`.slide[data-index="${index}"] .slide-bg`);
            if (el) el.style.backgroundImage = `url('${placeholderSlide(slide.subtitle || '')}')`;
        };
        probe.src = slide.image;
    });
    
    if (dots && slides.length > 1) {
        dots.innerHTML = slides.map((_, index) => `
            <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
        `).join('');
    }
    
    initSliderControls(slides.length);
}

function initSliderControls(totalSlides) {
    if (totalSlides <= 1) return;
    
    let currentIndex = 0;
    const track = document.querySelector('#slider-track');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('#slider-prev');
    const nextBtn = document.querySelector('#slider-next');
    
    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
    });
    
    let autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000);
    
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
        slider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000);
        });
    }
}

// ---- Products ----
async function initProducts() {
    const container = document.querySelector('#products-grid');
    if (!container) return;
    
    const products = await getProducts({});
    const featured = products.slice(0, 4); // Show first 4
    
    if (featured.length === 0) {
        container.innerHTML = '<p class="text-center">No products available.</p>';
        return;
    }
    
    container.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image || placeholder(product.name)}" alt="${product.name}" loading="lazy">
                ${product.brand === 'EPSON' ? '<span class="product-badge">EPSON</span>' : ''}
                ${product.brand === 'Acer' ? '<span class="product-badge" style="background:#0066b3;color:#fff;">Acer</span>' : ''}
            </div>
            <div class="product-body">
                <div class="product-brand">${product.brand}</div>
                <h3>${product.name}</h3>
                <div class="product-specs">${product.specs || product.description?.substring(0, 60) + '...' || ''}</div>
                <div class="product-price">${product.price}</div>
                <a href="#" class="product-link">
                    View Details <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');

    attachImageFallbacks(container);
}

// ---- News ----
async function initNews() {
    const container = document.querySelector('#news-grid');
    if (!container) return;
    
    const news = await getNews(3);
    
    if (news.length === 0) {
        container.innerHTML = '<p class="text-center">No news available.</p>';
        return;
    }
    
    container.innerHTML = news.map(item => `
        <div class="news-card">
            <div class="news-image">
                <img src="${item.image || placeholder(item.category || 'News')}" alt="${item.title}" loading="lazy">
            </div>
            <div class="news-body">
                <div class="news-meta">
                    <span class="category">${item.category || 'News'}</span>
                    <span>${item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.excerpt || ''}</p>
                <a href="#" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');

    attachImageFallbacks(container);
}

// ---- Testimonials ----
async function initTestimonials() {
    // Simple display - can be enhanced later
    const testimonials = await getTestimonials();
    console.log('📝 Testimonials loaded:', testimonials.length);
}

// ---- Mobile Menu ----
function initMobileMenu() {
    const toggle = document.querySelector('#mobile-toggle');
    const nav = document.querySelector('#main-nav');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('mobile-open');
            document.body.classList.toggle('menu-open');
        });
        
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('mobile-open');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// ---- WhatsApp ----
async function initWhatsApp() {
    try {
        const settings = await getSettings();
        const link = document.querySelector('#whatsapp-link');
        const cta = document.querySelector('#whatsapp-cta');
        const number = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '9779851234567';
        const url = `https://wa.me/${number}`;
        
        if (link) link.href = url;
        if (cta) cta.href = url;
    } catch (error) {
        console.error('WhatsApp error:', error);
    }
}

// ---- Current Year ----
function initYear() {
    const yearSpan = document.querySelector('#current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ---- Brand & About Logos (replace missing image files) ----
function initBrandLogos() {
    const epson = document.querySelector('.brand-card.epson .brand-logo');
    const acer = document.querySelector('.brand-card.acer .brand-logo');
    if (epson) epson.src = brandLogo('EPSON');
    if (acer) acer.src = brandLogo('Acer');

    const about = document.querySelector('.about-image img');
    if (about) {
        about.addEventListener('error', () => {
            about.src = placeholder('Our Showroom');
        }, { once: true });
        // Trigger fallback immediately if the source is missing
        if (about.complete && about.naturalWidth === 0) {
            about.src = placeholder('Our Showroom');
        }
    }
}

// ---- Placeholder Page Links (single-page demo) ----
function initPlaceholderLinks() {
    const links = document.querySelectorAll('a[data-page]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('This page is part of the full site — coming after approval.');
        });
    });
}

// ---- Lightweight Toast ----
let toastTimer = null;
function showToast(message) {
    let toast = document.querySelector('#demo-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'demo-toast';
        toast.style.cssText = `
            position: fixed; bottom: 150px; left: 50%; transform: translateX(-50%);
            background: #1a3a6b; color: #fff; padding: 12px 24px; border-radius: 50px;
            font-size: 14px; font-weight: 500; z-index: 9999; box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            opacity: 0; transition: opacity 0.3s ease; max-width: 90%; text-align: center;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2600);
}

// ---- Sticky Header ----
window.addEventListener('scroll', () => {
    const header = document.querySelector('#main-header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ---- Export for debugging ----
export { 
    initSlider, 
    initProducts, 
    initNews, 
    initFooter, 
    initWhatsApp 
};