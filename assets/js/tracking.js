// Tracking Utilities Component
// Handles cookie management and Pacagen link tracking
// Usage: Include in <head> or before closing </body>
// Uses event delegation to handle clicks on links with class 'pacagen-link'
//
// Path-source attribution: every outbound link to a main brand domain
// (Pacagen, RE:YOU, Wildtype) gets `?path_source=<current-page-slug>`
// appended — e.g. leaving /7-useful-gifts-new-cat-parents.html for
// pacagen.com produces:
//   https://pacagen.com/...?path_source=7-useful-gifts-new-cat-parents
// The homepage reports `path_source=home`.

(function() {
    'use strict';

    // Main brand domains (apex — subdomains like www. / en-us paths match too).
    // To track another brand, add its apex domain here.
    var TARGET_DOMAINS = [
        'pacagen.com',       // Pacagen
        'getreyou.com',      // RE:YOU
        'drinkwildtype.com'  // Wildtype
    ];

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
     * Current page as a path_source slug: URL path without leading slash or
     * .html extension, folders joined with '-'.
     * '/' and '/index.html' -> 'home'; '/blog/how-cat-allergies-work.html'
     * -> 'blog-how-cat-allergies-work'.
     * @returns {string}
     */
    function getPathSource() {
        var path = window.location.pathname || '';
        try { path = decodeURIComponent(path); } catch (e) { /* keep raw path */ }
        path = path.replace(/^\/+|\/+$/g, '');
        path = path.replace(/\.html?$/i, '');
        path = path.replace(/\/index$/i, '');
        if (!path || path === 'index') return 'home';
        return path
            .replace(/\//g, '-')
            .replace(/[^a-zA-Z0-9-_]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '') || 'home';
    }

    /**
     * True if a hostname is one of the main brand domains (or a subdomain).
     * @param {string} hostname
     * @returns {boolean}
     */
    function isTargetDomain(hostname) {
        if (!hostname) return false;
        var host = hostname.toLowerCase().replace(/\.$/, '');
        return TARGET_DOMAINS.some(function(domain) {
            return host === domain || host.slice(-(domain.length + 1)) === '.' + domain;
        });
    }

    /**
     * Return a URL string with path_source=<current page slug> set.
     * Non-target, non-http(s), and unparseable URLs are returned unchanged.
     * Existing query params and the hash fragment are preserved.
     * @param {string} urlString
     * @returns {string}
     */
    function addPathSource(urlString) {
        if (!urlString) return urlString;
        var url;
        try {
            url = new URL(urlString, window.location.href);
        } catch (e) {
            return urlString;
        }
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return urlString;
        if (!isTargetDomain(url.hostname)) return urlString;
        url.searchParams.set('path_source', getPathSource());
        return url.toString();
    }

    /**
     * Decorate a single anchor in place if it points at a target domain.
     * @param {HTMLAnchorElement} link
     */
    function decorateLink(link) {
        if (!link || !link.href) return;
        var decorated = addPathSource(link.href);
        if (decorated !== link.href) link.href = decorated;
    }

    /** Decorate every anchor currently in the document. */
    function decorateOutboundLinks() {
        document.querySelectorAll('a[href]').forEach(decorateLink);
    }

    // Decorate links added later (product showcases, related articles, ads…)
    function observeLinkAdditions() {
        if (typeof MutationObserver === 'undefined' || !document.body) return;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'A') decorateLink(node);
                    if (node.querySelectorAll) node.querySelectorAll('a[href]').forEach(decorateLink);
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function initPathSource() {
        decorateOutboundLinks();
        observeLinkAdditions();
        // Last-chance decoration at click time (capture phase, so it runs
        // before navigation and before the pacagen-link handler below).
        // Covers anything the observer missed and middle/ctrl clicks.
        document.addEventListener('click', function(e) {
            var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (link) decorateLink(link);
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPathSource);
    } else {
        initPathSource();
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

        // Build the final URL with parameters (path_source first)
        let finalUrl = addPathSource(baseUrl);
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
    window.getPathSource = getPathSource;
    window.addPathSource = addPathSource;
})();
