// Global Component Initialization Helper
// Handles timing issues when components load asynchronously
// Usage: initComponentsWhenReady(callback)

(function() {
    'use strict';
    
    // Track which components are loaded via events
    const componentStatus = {
        product: false,
        ads: false
    };
    
    // Set up event listeners IMMEDIATELY (before bundles start loading)
    // This ensures we catch events even if they fire before initComponentsWhenReady is called
    window.addEventListener('productComponentsLoaded', function() {
        componentStatus.product = true;
    }, { once: false });
    
    window.addEventListener('adsComponentsLoaded', function() {
        componentStatus.ads = true;
    }, { once: false });
    
    // Check if article components are loaded
    function areArticleComponentsLoaded() {
        return typeof createFold !== 'undefined' &&
               typeof createArticleFooter !== 'undefined';
    }
    
    // Check if product components are loaded
    function areProductComponentsLoaded() {
        return typeof createProductShowcase !== 'undefined';
    }
    
    // Check if ad components are loaded
    function areAdComponentsLoaded() {
        return typeof createAd !== 'undefined';
    }
    
    // Wait for components to be ready, then execute callback
    function initComponentsWhenReady(callback, options = {}) {
        const {
            waitForArticle = true,
            waitForProduct = false,
            waitForAds = false,
            maxRetries = 50, // 2.5 seconds max - increased for reliability
            retryDelay = 50
        } = options;
        
        let retries = 0;
        let rafId = null;
        let callbackExecuted = false;
        
        function executeCallback() {
            if (callbackExecuted) return;
            callbackExecuted = true;
            
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            try {
                callback();
            } catch (error) {
                console.error('Error initializing components:', error);
            }
        }
        
        // Check if components are ready
        function checkComponentsReady() {
            // If functions are available, use them (regardless of event status)
            // The event status is just a hint, but function availability is what matters
            const articleReady = !waitForArticle || areArticleComponentsLoaded();
            const productReady = !waitForProduct || areProductComponentsLoaded();
            const adsReady = !waitForAds || areAdComponentsLoaded();
            return articleReady && productReady && adsReady;
        }
        
        // CRITICAL FIX: Check immediately if components are already loaded
        // This handles the case where events fired before initComponentsWhenReady was called
        // OR where components loaded synchronously/very quickly
        if (checkComponentsReady()) {
            executeCallback();
            return; // Exit early - components are already ready
        }
        
        // Set up one-time listeners for this specific call
        let eventListenersSetup = false;
        function setupEventListeners() {
            if (eventListenersSetup) return;
            eventListenersSetup = true;
            
            if (waitForProduct) {
                const productHandler = function() {
                    if (checkComponentsReady()) {
                        executeCallback();
                    }
                };
                window.addEventListener('productComponentsLoaded', productHandler, { once: true });
            }
            
            if (waitForAds) {
                const adsHandler = function() {
                    if (checkComponentsReady()) {
                        executeCallback();
                    }
                };
                window.addEventListener('adsComponentsLoaded', adsHandler, { once: true });
            }
        }
        
        // Set up listeners immediately
        setupEventListeners();
        
        // Polling fallback (in case events don't fire or components load before listeners are set)
        function checkAndInit() {
            if (callbackExecuted) return;
            
            retries++;
            
            if (checkComponentsReady()) {
                executeCallback();
            } else if (retries < maxRetries) {
                rafId = requestAnimationFrame(function() {
                    setTimeout(checkAndInit, retryDelay);
                });
            } else {
                // Max retries reached - try anyway
                console.warn('Component initialization timeout. Some components may not be loaded.');
                executeCallback();
            }
        }
        
        // Start polling as fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                requestAnimationFrame(checkAndInit);
            });
        } else {
            requestAnimationFrame(checkAndInit);
        }
    }
    
    // Expose globally
    window.initComponentsWhenReady = initComponentsWhenReady;
})();
