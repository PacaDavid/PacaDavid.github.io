// Tracking Utilities Component
// Handles cookie management and Pacagen link tracking
// Usage: Include in <head> or before closing </body>
// Uses event delegation to handle clicks on links with class 'pacagen-link'

(function() {
    'use strict';
    
    /**
     * Get a cookie value by name
     * @param {string} name - Cookie name
     * @returns {string} Cookie value or empty string
     */
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }
    
    /**
     * Handle Pacagen link clicks with tracking and cookie forwarding
     * @param {string} baseUrl - Base URL to redirect to
     */
    function handlePacagenClick(baseUrl) {
        // Track the click event
        if (typeof cvg !== 'undefined') {
            cvg({ method: "track", eventName: "HealthPetInsiderPacagenClick" });
        }
        
        // Get cookie values
        let uid = getCookie('__cvg_uid');
        let sid = getCookie('__cvg_sid');
        
        // Build the final URL with parameters
        let finalUrl = baseUrl;
        if (uid || sid) {
            finalUrl += (finalUrl.includes('?') ? '&' : '?');
            if (uid) finalUrl += `__cvg_uid=${encodeURIComponent(uid)}`;
            if (uid && sid) finalUrl += '&';
            if (sid) finalUrl += `__cvg_sid=${encodeURIComponent(sid)}`;
        }
        
        // Redirect after 200ms delay
        setTimeout(() => {
            window.location.href = finalUrl;
        }, 200);
    }
    
    /**
     * Set up event delegation for Pacagen links
     */
    function setupPacagenLinkTracking() {
        document.addEventListener('click', function(e) {
            // Check if clicked element or its parent is a Pacagen link
            let link = e.target.closest('a.pacagen-link');
            if (link && link.href) {
                e.preventDefault();
                handlePacagenClick(link.href);
            }
        });
    }
    
    // Initialize event delegation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPacagenLinkTracking);
    } else {
        setupPacagenLinkTracking();
    }
    
    // Make functions globally available (for backward compatibility if needed)
    window.getCookie = getCookie;
    window.f = handlePacagenClick;
})();

