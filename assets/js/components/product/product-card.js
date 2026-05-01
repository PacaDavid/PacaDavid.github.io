// Product Card Component
// Creates the actual product card HTML
// Usage: createProductCard({ imagePath, alt, url, description, reviewText, clickable, ctaLabel })
// CTA uses .shop-button (same green style as sitewide Pacagen CTAs). Card is not one giant <a> so the CTA can be a proper link.
// Dependencies: product-reviews.js (optional, for review data)

(function() {
    'use strict';

    function escapeAttr(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function createProductCard(config) {
        const {
            imagePath,
            alt,
            url,
            description,
            reviewText = '',
            clickable = true,
            ctaLabel
        } = config;

        if (!imagePath || !alt) return '';

        const label = (ctaLabel != null && String(ctaLabel).trim() !== '')
            ? String(ctaLabel).trim()
            : 'Shop now';

        if (clickable && url) {
            const safeUrl = escapeAttr(url);
            return `
                <div class="pacagen-product-display pacagen-link d-flex w-md-65 justify-content-center align-items-center">
                    <div class="card p-2 w-100">
                        <div class="pacagen-product-display__grid">
                            <div class="pacagen-product-display__title">
                                <h2 class="card-title mb-0">
                                    <a href="${safeUrl}" class="pacagen-product-display__title-link text-decoration-none"><b>${escapeHtml(alt)}</b></a>
                                </h2>
                            </div>
                            <div class="pacagen-product-display__media">
                                <a href="${safeUrl}" class="d-inline-block pacagen-product-display__media-link" tabindex="-1">
                                    <img src="${imagePath}" class="rounded-4 pacagen-product-display__img" alt="${escapeAttr(alt)}">
                                </a>
                            </div>
                            <div class="pacagen-product-display__body">
                                ${reviewText ? `<p class="card-reviews mb-1">${reviewText}</p>` : ''}
                                <p class="card-description mb-0">${description || ''}</p>
                                <div class="pacagen-product-display__cta">
                                    <a href="${safeUrl}" class="shop-button">${escapeHtml(label)}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

