// Author Component
// Displays author name and optional image
// Usage: createAuthorSection({ authorName: 'John Doe', authorImage: 'john.png', pageType: 'root' })

(function() {
    'use strict';
    
    function createAuthorSection(config) {
        const { 
            authorName, 
            authorImage = null, 
            imageAlt = null,
            pageType = 'root'
        } = config;
        
        if (!authorName) return '';
        
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        const imagePath = authorImage 
            ? (authorImage.startsWith('/') || authorImage.startsWith('http')
                ? authorImage 
                : `${assetPath}/images/${authorImage}`)
            : null;
        
        const imageHTML = imagePath 
            ? `<img class="author-image" src="${imagePath}" alt="${imageAlt || `Author ${authorName}`}">`
            : '';
        
        return `
            <div class="author-section">
                <span class="by-text">By ${authorName}</span>
                ${imageHTML}
            </div>
        `;
    }
    
    window.createAuthorSection = createAuthorSection;
})();

