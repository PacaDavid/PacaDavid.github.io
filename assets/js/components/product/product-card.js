// Product Card Component
// Creates the actual product card HTML
// Usage: createProductCard({ imagePath: 'assets/images/img.png', alt: 'Product', url: '...', description: '...', reviewText: '...' })
// Dependencies: product-reviews.js (optional, for review data)

(function() {
    'use strict';
    
    function createProductCard(config) {
        const {
            imagePath,
            alt,
            url,
            description,
            reviewText = '',
            clickable = true
        } = config;
        
        if (!imagePath || !alt) return '';
        
        if (clickable && url) {
            return `
                <a href="${url}" class="pacagen-link d-flex w-md-65 justify-content-center align-items-center text-decoration-none">
                    <div class="card p-2">
                        <div class="row mx-auto">
                            <div class="col-5 col-sm-4 col-md-3 p-0 px-md-2">
                                <img src="${imagePath}" class="rounded-4" alt="${alt}">
                            </div>
                            <div class="col-7 col-sm-8 col-md-9">
                                <h2 class="card-title"><b>${alt}</b></h2>
                                ${reviewText ? `<p class="card-reviews mb-1">${reviewText}</p>` : ''}
                                <p class="card-description mb-0">${description || ''}</p>
                            </div>
                        </div>
                    </div>
                </a>
            `;
        } else {
            return `
                <div class="article-content-image d-flex">
                    <img src="${imagePath}" class="article-img" alt="${alt}">
                </div>
            `;
        }
    }
    
    window.createProductCard = createProductCard;
})();

