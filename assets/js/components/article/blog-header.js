// Blog Header Component
// Simple blog header with title and date (for blog pages)
// Usage: createBlogHeader({ title: 'Title', dateText: 'Published on Date' })

(function() {
    'use strict';
    
    function createBlogHeader(config) {
        const {
            title,
            dateText = '',
            breadcrumb = false,
            homePath = 'index.html'
        } = config;
        
        if (!title) return '';
        
        const breadcrumbHTML = breadcrumb 
            ? (typeof createBreadcrumb !== 'undefined' 
                ? createBreadcrumb({ homePath, homeText: 'Home' })
                : '')
            : '';
        
        const dateHTML = dateText 
            ? `<p class="article-meta">${dateText}</p>`
            : '';
        
        return `
            ${breadcrumbHTML}
            <header class="article-header">
                <h1>${title}</h1>
                ${dateHTML}
            </header>
        `;
    }
    
    window.createBlogHeader = createBlogHeader;
})();

