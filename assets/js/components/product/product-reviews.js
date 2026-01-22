// Product Reviews Data
// Centralized reviews database
// Usage: getProductReview(url) returns [rating, reviewCount]

(function() {
    'use strict';
    
    const PRODUCT_REVIEWS = {
        "https://www.pacagen.com/products/cat-allergen-neutralizing-spray": ["4.72 out of 5 stars", "(600+ reviews)"],
        "https://www.pacagen.com/products/dog-allergen-neutralizing-spray": ["4.87 out of 5 stars", ""],
        "https://www.pacagen.com/products/dust-allergen-neutralizing-spray": ["5.00 out of 5 stars", ""],
        "https://pacagen.com/en-us/products/cat-allergen-reducing-supplement": ["4.80 out of 5 stars", "(200+ reviews)"],
        "https://www.pacagen.com/products/cat-allergen-reducing-supplement": ["4.80 out of 5 stars", "(200+ reviews)"],
        "https://www.pacagen.com/products/allergen-neutralizing-spray": ["4.72 out of 5 stars", "(600+ reviews)"]
    };
    
    function getProductReview(url) {
        return PRODUCT_REVIEWS[url] || ["", ""];
    }
    
    function formatReviewText(review) {
        if (!review[0]) return '';
        return `★★★★★ &nbsp ${review[0]} ${review[1] || ''}`;
    }
    
    window.getProductReview = getProductReview;
    window.formatReviewText = formatReviewText;
    window.PRODUCT_REVIEWS = PRODUCT_REVIEWS; // Also expose for direct access if needed
})();

