// Ad Type A Component
// Background image ad with logo, headline, body, and CTA
// Usage: createAdTypeA({ backgroundImage: 'image.png', logo: 'BRAND', headline: '...', ... })

(function() {
    'use strict';
    
    function createAdTypeA(config) {
        const {
            backgroundImage,
            logo,
            logoDark = '',  // Part of logo that should be darker
            headline,
            body,
            productName = '',  // Product name in body (will be wrapped in span)
            ctaText = 'Learn More',
            ctaUrl = '',
            ctaTarget = '_blank',
            pageType = 'root'
        } = config;
        
        if (!backgroundImage || !logo || !headline || !body) return '';
        
        // Resolve image path
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        const imagePath = backgroundImage.startsWith('http') || backgroundImage.startsWith('/')
            ? backgroundImage
            : `${assetPath}/images/${backgroundImage}`;
        
        // Build logo with optional dark part
        const logoHTML = logoDark 
            ? `${logo}<span class="ad-logo-dark"> ${logoDark}</span>`
            : logo;
        
        // Build body with optional product name highlight
        let bodyHTML = body;
        if (productName) {
            bodyHTML = body.replace(
                productName, 
                `<span class="ad-product-name">${productName}</span>`
            );
        }
        
        // Build CTA (link or span)
        const ctaHTML = ctaUrl
            ? `<a href="${ctaUrl}" target="${ctaTarget}" rel="noopener noreferrer" class="ad-cta">${ctaText}</a>`
            : `<span class="ad-cta">${ctaText}</span>`;
        
        return `
            <div class="ad-section ads-type-a" style="background-image: url('${imagePath}');">
                <div class="ad-logo">${logoHTML}</div>
                <div class="ad-headline">${headline}</div>
                <div class="ad-body">${bodyHTML}</div>
                <div class="ad-cta-wrapper">${ctaHTML}</div>
                <span class="ad-label">Ad</span>
            </div>
        `;
    }
    
    window.createAdTypeA = createAdTypeA;
})();

