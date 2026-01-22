// Breadcrumb Component
// Simple breadcrumb navigation
// Usage: createBreadcrumb({ homePath: 'index.html', homeText: 'Home' })

(function() {
    'use strict';
    
    function createBreadcrumb(config = {}) {
        const { homePath = 'index.html', homeText = 'Home' } = config;
        
        return `
            <div class="breadcrumb-section">
                <div class="breadcrumb">
                    <a href="${homePath}" class="custom-btn btn-sm shadow-sm">${homeText}</a>
                </div>
            </div>
        `;
    }
    
    window.createBreadcrumb = createBreadcrumb;
})();

