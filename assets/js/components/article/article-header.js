// Article Header Component (Composite)
// Combines breadcrumb, title, author, and date
// Usage: createArticleHeader({ title: 'Title', authorName: 'Author', ... })
// Dependencies: breadcrumb.js, author.js, date.js

(function() {
    'use strict';
    
    function createBlogTitleSection(title) {
        if (!title) return '';
        
        return `
            <div class="blog-title-section">
                <h2 class="blog-title">${title}</h2>
            </div>
        `;
    }
    
    function createArticleHeader(config) {
        const {
            title,
            authorName,
            authorImage = null,
            dateText = '',
            homePath = 'index.html',
            pageType = 'root'
        } = config;
        
        if (!title) return '';
        
        // Check if dependencies are loaded
        if (typeof createBreadcrumb === 'undefined' || 
            typeof createAuthorSection === 'undefined' || 
            typeof createDateSection === 'undefined') {
            console.error('Article header dependencies not loaded. Please include: breadcrumb.js, author.js, date.js');
            return '';
        }
        
        return `
            ${createBreadcrumb({ homePath })}
            ${createBlogTitleSection(title)}
            ${createAuthorSection({ authorName, authorImage, pageType })}
            ${createDateSection(dateText)}
        `;
    }
    
    window.createBlogTitleSection = createBlogTitleSection;
    window.createArticleHeader = createArticleHeader;
})();

