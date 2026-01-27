// Ad Component
// Creates an ad with background image, logo, headline, body, and CTA
// Usage: createAd({ backgroundImage: 'img.png', logo: 'BRAND', logoDark: 'NAME', headline: '...', body: '...', productName: '...', ctaText: '...', ctaUrl: '...', pageType: 'root' })

(function() {
    'use strict';
    
    function resolveImagePath(image, pageType) {
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        return image.startsWith('http') || image.startsWith('/')
            ? image
            : `${assetPath}/images/${image}`;
    }
    
    function createAd(config) {
        const {
            backgroundImage,
            logo,
            logoDark,
            headline,
            body,
            productName,
            ctaText,
            ctaUrl,
            pageType = 'root'
        } = config;
        
        if (!backgroundImage || !headline || !body) {
            console.warn('createAd: Missing required parameters');
            return '';
        }
        
        const imagePath = resolveImagePath(backgroundImage, pageType);
        const logoHTML = logo ? `<div class="ad-logo">${logo}${logoDark ? `<span class="ad-logo-dark"> ${logoDark}</span>` : ''}</div>` : '';
        
        // Insert productName into body if it exists
        let bodyHTML = body;
        if (productName) {
            bodyHTML = body.replace(new RegExp(productName, 'g'), `<span class="ad-product-name">${productName}</span>`);
        }
        
        const ctaHTML = ctaText ? `
              <div class="ad-cta-wrapper">
                <span class="ad-cta">${ctaText}</span>
              </div>` : '';
        
        const isClickable = ctaUrl && ctaUrl !== '#';
        const wrapperClass = isClickable ? 'ad-section ad ad-clickable' : 'ad-section ad';
        const wrapperTag = isClickable ? 'a' : 'div';
        const hrefAttr = isClickable ? `href="${ctaUrl}"` : '';
        
        return `
            <${wrapperTag} class="${wrapperClass}" style="background-image: url('${imagePath}');" ${hrefAttr}>
              ${logoHTML}
              <div class="ad-headline">${headline}</div>
              <div class="ad-body">
                ${bodyHTML}
              </div>
              ${ctaHTML}
              <span class="ad-label">Ad</span>
            </${wrapperTag}>
        `.trim();
    }
    
    window.createAd = createAd;
})();


