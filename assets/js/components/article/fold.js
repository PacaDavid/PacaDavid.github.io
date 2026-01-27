// Fold Component (Article Header/Fold)
// Creates the fold section with title, optional author, optional leading title, optional breadcrumb, optional date, and image
// Usage: createFold({ title: 'Title', authorName: 'Author', authorImage: 'img.png', leadingTitle: 'Subtitle', imageSrc: 'hero.png', breadcrumb: true, dateText: 'Updated on...', pageType: 'root' })
// Dependencies: breadcrumb.js (optional, has fallback)

(function() {
    'use strict';
    
    function createFold(config) {
        const {
            title,
            authorName = null,
            authorImage = null,
            authorImageAlt = null,
            leadingTitle = null,
            imageSrc,
            imageAlt,
            imageCaption = '',
            breadcrumb = false,
            homePath = 'index.html',
            homeText = 'Home',
            dateText = '',
            pageType = 'root'
        } = config;
        
        if (!title) {
            console.error('Fold component requires title');
            return '';
        }
        
        // Breadcrumb (optional)
        let breadcrumbHTML = '';
        if (breadcrumb) {
            if (typeof createBreadcrumb !== 'undefined') {
                breadcrumbHTML = createBreadcrumb({ homePath, homeText });
            } else {
                // Fallback if breadcrumb component not loaded
                breadcrumbHTML = `
                    <div class="breadcrumb-section">
                        <div class="breadcrumb">
                            <a href="${homePath}" class="custom-btn btn-sm shadow-sm">${homeText}</a>
                        </div>
                    </div>
                `;
            }
        }
        
        // Date section (optional)
        let dateHTML = '';
        if (dateText) {
            dateHTML = `
                <div class="container py-2">
                    <div class="row align-items-center">
                        <div class="col-md-12 text-center mt-2 mb-2 mt-md-0 text-muted">
                            ${dateText}
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Author section (optional)
        let authorHTML = '';
        if (authorName) {
            const assetPath = pageType === 'blog' ? '../assets' : 'assets';
            const authorImagePath = authorImage 
                ? (authorImage.startsWith('/') || authorImage.startsWith('http')
                    ? authorImage 
                    : `${assetPath}/images/${authorImage}`)
                : null;
            const authorImgHTML = authorImagePath 
                ? `<img class="author-image" src="${authorImagePath}" alt="${authorImageAlt || `Author ${authorName}`}">`
                : '';
            authorHTML = `
                <div class="author-section">
                    <span class="by-text">By ${authorName}</span>
                    ${authorImgHTML}
                </div>
            `;
        }
        
        // Leading title (optional subtitle)
        const leadingTitleHTML = leadingTitle 
            ? `<h2 class="fold-leading-title">${leadingTitle}</h2>`
            : '';
        
        // Image (optional, but common)
        let imageHTML = '';
        if (imageSrc) {
            const assetPath = pageType === 'blog' ? '../assets' : 'assets';
            const imagePath = imageSrc.startsWith('http') || imageSrc.startsWith('/')
                ? imageSrc
                : `${assetPath}/images/${imageSrc}`;
            
            const captionHTML = imageCaption 
                ? `<p class="fold-image-caption mt-1">${imageCaption}</p>`
                : '';
            
            imageHTML = `
                <div class="fold-image-wrapper">
                    <img src="${imagePath}" alt="${imageAlt || ''}" class="fold-image">
                    ${captionHTML}
                </div>
            `;
        }
        
        return `
            ${breadcrumbHTML}
            <div class="fold-section">
                <h1 class="fold-title">${title}</h1>
                ${authorHTML}
                ${dateHTML}
                ${leadingTitleHTML}
                ${imageHTML}
            </div>
        `;
    }
    
    window.createFold = createFold;
})();

