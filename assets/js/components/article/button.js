// Button Component
// Creates a button with text and optional URL
// Usage: createButton({ text: 'Click Me', url: 'https://example.com', className: 'shop-button custom-class' })
// If URL is provided, returns an <a> tag. If not, returns a <button> tag.

(function() {
    'use strict';
    
    function createButton(config) {
        const {
            text,
            url = null,
            className = 'shop-button',
            additionalClasses = '',  // Optional: add more classes without replacing default
            wrapper = true,
            onClick = null
        } = config;
        
        if (!text) {
            console.error('Button component requires text');
            return '';
        }
        
        // Combine className and additionalClasses
        const allClasses = additionalClasses 
            ? `${className} ${additionalClasses}`.trim()
            : className;
        
        // If URL is provided, create a link
        if (url) {
            const linkHTML = `<a href="${url}" class="${allClasses}">${text}</a>`;
            return wrapper ? `<div class="shop-button-wrapper">${linkHTML}</div>` : linkHTML;
        }
        
        // If no URL, create a button element
        const buttonHTML = onClick 
            ? `<button class="${allClasses}" onclick="${onClick}">${text}</button>`
            : `<button class="${allClasses}">${text}</button>`;
        
        return wrapper ? `<div class="shop-button-wrapper">${buttonHTML}</div>` : buttonHTML;
    }
    
    window.createButton = createButton;
})();

