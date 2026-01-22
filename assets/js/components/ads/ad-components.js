// Ad Components (Main)
// Convenience wrapper that exports both ad types
// Dependencies: ad-type-a.js, ad-type-b.js

(function() {
    'use strict';
    
    // Re-export functions if they exist (for convenience)
    // This allows importing just this file if both are needed
    if (typeof createAdTypeA !== 'undefined') {
        window.createAdTypeA = createAdTypeA;
    }
    
    if (typeof createAdTypeB !== 'undefined') {
        window.createAdTypeB = createAdTypeB;
    }
    
    // Helper function to create ad based on type
    function createAd(type, config) {
        if (type === 'a' || type === 'type-a') {
            if (typeof createAdTypeA === 'undefined') {
                console.error('Ad Type A component not loaded. Please include: ad-type-a.js');
                return '';
            }
            return createAdTypeA(config);
        } else if (type === 'b' || type === 'type-b') {
            if (typeof createAdTypeB === 'undefined') {
                console.error('Ad Type B component not loaded. Please include: ad-type-b.js');
                return '';
            }
            return createAdTypeB(config);
        }
        console.error(`Unknown ad type: ${type}`);
        return '';
    }
    
    window.createAd = createAd;
})();

