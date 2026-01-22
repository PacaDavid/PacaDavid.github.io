// Product Showcase Component (Main)
// High-level function that combines product card with reviews
// Usage: createProductShowcase({ image: 'img.png', alt: 'Product', url: '...', pageType: 'root' })
// Dependencies: product-reviews.js, product-card.js

(function() {
    'use strict';
    
    function resolveImagePath(image, pageType) {
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        return image.startsWith('http') || image.startsWith('/')
            ? image
            : `${assetPath}/images/${image}`;
    }
    
    function createProductShowcase(config) {
        const {
            image,
            alt,
            url,
            description,
            clickable = true,
            pageType = 'root'
        } = config;
        
        if (!image || !alt) return '';
        
        // Check if dependencies are loaded
        if (typeof createProductCard === 'undefined') {
            console.error('Product card component not loaded. Please include: product-card.js');
            return '';
        }
        
        // Resolve image path
        const imagePath = resolveImagePath(image, pageType);
        
        // Get review text if reviews module is available
        let reviewText = '';
        if (url && typeof getProductReview !== 'undefined' && typeof formatReviewText !== 'undefined') {
            const review = getProductReview(url);
            reviewText = formatReviewText(review);
        }
        
        // Create and return product card
        return createProductCard({
            imagePath,
            alt,
            url,
            description,
            reviewText,
            clickable
        });
    }
    
    function insertProductShowcase(targetSelector, config) {
        const target = document.querySelector(targetSelector);
        if (target) {
            target.innerHTML = createProductShowcase(config);
        }
    }
    
    window.createProductShowcase = createProductShowcase;
    window.insertProductShowcase = insertProductShowcase;
})();

