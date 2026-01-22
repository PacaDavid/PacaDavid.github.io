// Content Section Component
// Creates a content section with title, paragraph(s), optional image, and optional additional content
// Usage: createContentSection({ title: 'Title', paragraph: 'Text...' or ['Text1...', 'Text2...'], imageSrc: 'img.png', imageAlt: 'Alt', additionalContent: '<ul>...</ul>', pageType: 'root' })

(function() {
    'use strict';
    
    function createContentSection(config) {
        const {
            title,
            paragraph,
            paragraphs = null, // Support multiple paragraphs as array
            imageSrc = null,
            imageAlt = null,
            imageCaption = '',
            additionalContent = '', // For lists, callouts, or other HTML
            pageType = 'root'
        } = config;
        
        // Handle paragraph(s) - support both single string and array
        let paragraphsHTML = '';
        if (paragraphs && Array.isArray(paragraphs)) {
            // Use paragraphs array if provided
            paragraphsHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        } else if (paragraph) {
            // Single paragraph (string)
            paragraphsHTML = `<p>${paragraph}</p>`;
        }
        
        // Image HTML (optional)
        let imageHTML = '';
        if (imageSrc) {
            const assetPath = pageType === 'blog' ? '../assets' : 'assets';
            const imagePath = imageSrc.startsWith('http') || imageSrc.startsWith('/')
                ? imageSrc
                : `${assetPath}/images/${imageSrc}`;
            
            const captionHTML = imageCaption 
                ? `<p class="content-section-caption mt-1">${imageCaption}</p>`
                : '';
            
            imageHTML = `
                <div class="article-content-image d-flex">
                    <img src="${imagePath}" class="article-img" alt="${imageAlt || ''}">
                    ${captionHTML}
                </div>
            `;
        }
        
        // Title is optional - only render if provided
        const titleHTML = title ? `<h2>${title}</h2>` : '';
        
        // Only render if there's content (title, paragraphs, image, or additionalContent)
        if (!title && !paragraphsHTML && !imageHTML && !additionalContent) {
            console.warn('Content section has no content');
            return '';
        }
        
        return `
            <div class="article-section">
                ${imageHTML}
                ${titleHTML}
                ${paragraphsHTML}
                ${additionalContent}
            </div>
        `;
    }
    
    // Helper to create multiple content sections at once
    function createContentSections(sections, pageType = 'root') {
        if (!Array.isArray(sections)) return '';
        
        return sections.map(section => 
            createContentSection({ ...section, pageType })
        ).join('');
    }
    
    window.createContentSection = createContentSection;
    window.createContentSections = createContentSections;
})();

