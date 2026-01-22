// Date Component
// Displays publication/update date
// Usage: createDateSection('Updated on July 25, 2025')

(function() {
    'use strict';
    
    function createDateSection(dateText) {
        if (!dateText) return '';
        
        return `
            <div class="container py-2">
                <div class="row align-items-center">
                    <div class="col-md-6 text-md-start mt-2 mb-2 mt-md-0 text-muted">
                        ${dateText}
                    </div>
                </div>
            </div>
        `;
    }
    
    window.createDateSection = createDateSection;
})();

