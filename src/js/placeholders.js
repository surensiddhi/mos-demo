// ==========================================
// PLACEHOLDER IMAGE GENERATOR
// Generates inline SVG data-URIs so the demo
// looks clean even without real image files.
// ==========================================

function svgDataUri(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Generic product / news placeholder with a label
export function placeholder(label = 'Image', bg = '#eef2f7', fg = '#1a3a6b') {
    const text = String(label).slice(0, 28);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="${bg}"/>
        <text x="300" y="195" font-family="Inter,sans-serif" font-size="26" font-weight="700" fill="${fg}" text-anchor="middle">${text}</text>
        <text x="300" y="228" font-family="Inter,sans-serif" font-size="13" fill="#9aa7b5" text-anchor="middle">Mercantile Office Systems</text>
    </svg>`;
    return svgDataUri(svg);
}

// Wide hero/slider placeholder
export function placeholderSlide(label = '') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="800" viewBox="0 0 1600 800">
        <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#1a3a6b"/>
                <stop offset="1" stop-color="#0e1f3d"/>
            </linearGradient>
        </defs>
        <rect width="1600" height="800" fill="url(#g)"/>
        <circle cx="1350" cy="650" r="320" fill="rgba(212,160,48,0.08)"/>
        <text x="120" y="420" font-family="Inter,sans-serif" font-size="22" fill="rgba(255,255,255,0.25)">${label}</text>
    </svg>`;
    return svgDataUri(svg);
}

// Brand logo placeholders (text-based, no external files needed)
export function brandLogo(name) {
    const colors = { EPSON: '#000000', Acer: '#0066b3' };
    const color = colors[name] || '#1a3a6b';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
        <text x="100" y="42" font-family="Inter,sans-serif" font-size="32" font-weight="900" fill="${color}" text-anchor="middle" letter-spacing="1">${name}</text>
    </svg>`;
    return svgDataUri(svg);
}

// Attach a global onerror fallback to any <img> that fails to load
export function attachImageFallbacks(root = document) {
    root.querySelectorAll('img').forEach(img => {
        if (img.dataset.fbBound) return;
        img.dataset.fbBound = '1';
        img.addEventListener('error', () => {
            const label = img.alt || 'Image';
            img.src = placeholder(label);
        }, { once: true });
    });
}
