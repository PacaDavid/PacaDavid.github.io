// Product Components Bundle
// Convenience script that loads all product components in correct order
// Usage: <script src="assets/js/product-components-bundle.js"></script>

(function() {
    'use strict';
    
    const scripts = [
        'components/product/product-reviews.js',
        'components/product/product-card.js',
        'components/product/product-showcase.js'
    ];
    
    // Detect the correct base path by finding the current script's location
    function getBasePath() {
        const currentScript = document.currentScript || 
            (function() {
                const scripts = document.getElementsByTagName('script');
                return scripts[scripts.length - 1];
            })();
        
        if (currentScript && currentScript.src) {
            // Extract the directory path from the script's src
            const scriptPath = currentScript.src;
            const match = scriptPath.match(/(.*\/)product-components-bundle\.js/);
            if (match) {
                return match[1];
            }
        }
        
        // Fallback: detect based on URL path
        const isInBlog = window.location.pathname.includes('/blog/');
        return isInBlog ? '../assets/js/' : 'assets/js/';
    }
    
    const basePath = getBasePath();
    
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = basePath + src;
        // Don't use defer on dynamically created scripts - use onload callback instead
        if (callback) {
            script.onload = callback;
            script.onerror = function() {
                console.error('Failed to load script:', src);
                callback(); // Continue even if script fails
            };
        }
        document.head.appendChild(script);
    }
    
    // Load scripts sequentially to ensure dependencies
    function loadScriptsSequentially(index) {
        if (index >= scripts.length) {
            // All scripts loaded, fire custom event
            window.dispatchEvent(new CustomEvent('productComponentsLoaded'));
            return;
        }
        
        loadScript(scripts[index], function() {
            loadScriptsSequentially(index + 1);
        });
    }
    
    // Start loading
    loadScriptsSequentially(0);
})();
