// Ad Type B Component
// Two-row layout ad with brand name/image and promo content
// Usage: createAdTypeB({ brandName: 'Brand', brandImage: 'image.png', ... })

(function() {
    'use strict';
    
    function createAdTypeB(config) {
        const {
            brandName,
            brandImage,
            imageAlt = '',
            promoTitle,
            promoSubtext,
            pageType = 'root'
        } = config;
        
        if (!brandName || !promoTitle || !promoSubtext) return '';
        
        // Resolve image path
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        const imagePath = brandImage 
            ? (brandImage.startsWith('http') || brandImage.startsWith('/')
                ? brandImage
                : `${assetPath}/images/${brandImage}`)
            : null;
        
        const imageHTML = imagePath
            ? `<div class="ad-brand-image">
                <img src="${imagePath}" alt="${imageAlt || brandName}">
               </div>`
            : '';
        
        return `
            <div class="ad-section ads-type-b">
                <div class="ad-row-1">
                    <div class="ad-brand-name">${brandName}</div>
                    ${imageHTML}
                </div>
                <div class="ad-row-2">
                    <div class="ad-promo-title">${promoTitle}</div>
                    <div class="ad-promo-subtext">${promoSubtext}</div>
                </div>
                <span class="ad-label">Ad</span>
            </div>
        `;
    }
    
    window.createAdTypeB = createAdTypeB;
})();

