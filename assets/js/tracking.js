// Tracking Utilities Component
// Handles cookie management, attribution persistence, and main-domain link tracking.
// Usage: Include in <head> or before closing </body>.
//
// Attribution (persist + forward):
// - On landing, valid traffic parameters (see CAPTURE_KEYS) are stored as one
//   record (localStorage -> first-party cookie -> in-memory) for 30 days.
// - path_source identifies the original WL landing page slug; it is captured
//   once and never recomputed from later WL pages.
// - Outbound links to the main brand domains (TARGET_DOMAINS) are tagged with
//   the persisted parameters. The visitor's utm_source is forwarded as
//   `channel`; outbound utm_source is this site's initials (WL_INITIALS) —
//   Health Pet Insider -> "hpi".
// - window.f('https://...') keeps working for onclick-based redirects and
//   routes through the same buildOutboundUrl() utility.

(function () {
    'use strict';

    // Main brand domains, taken from the destination links already used
    // across this repo (apex — subdomains like www. match too).
    // To track another main brand, add its apex domain here.
    var TARGET_DOMAINS = [
        'pacagen.com',       // Pacagen
        'getreyou.com',      // RE:YOU
        'drinkwildtype.com'  // Wildtype
    ];

    // This WL site's initials, forwarded as utm_source on main-domain links.
    var WL_INITIALS = 'hpi'; // Health Pet Insider

    var STORAGE_KEY = 'hpi_attribution';
    var ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

    // Parameters captured from the landing URL and persisted together.
    var CAPTURE_KEYS = [
        'tw_source', 'tw_adid', 'cvg_source', 'cvg_adid', 'cvg_cid', 'fbclid',
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        'utm_id', 'campaign_id', 'ad_id',
        'path_source'
    ];

    // A conflicting value for any of these means a genuinely new ad visit.
    var AD_ID_KEYS = ['fbclid', 'tw_adid', 'cvg_adid', 'cvg_cid', 'utm_id', 'campaign_id', 'ad_id'];

    // Order params are applied to outbound URLs (utm_source/channel sit
    // between fbclid and the remaining utm_* params, per spec example).
    var FORWARD_ORDER = [
        'path_source',
        'tw_source', 'tw_adid', 'cvg_source', 'cvg_adid', 'cvg_cid', 'fbclid',
        'utm_source', 'channel',
        'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id',
        'campaign_id', 'ad_id'
    ];

    /* ---------------- basic helpers ---------------- */

    function getCookie(name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }

    function setCookie(name, value, expiresAt) {
        var cookie = name + '=' + encodeURIComponent(value) +
            '; expires=' + new Date(expiresAt).toUTCString() +
            '; path=/; SameSite=Lax';
        if (window.location.protocol === 'https:') cookie += '; Secure';
        document.cookie = cookie;
    }

    /* ---------------- value validation ---------------- */

    // Valid = non-empty after trim, reasonably sized, and not an unresolved
    // ad macro. Macros look like {{ad.id}} — including percent-encoded forms
    // (%7B%7Bad.id%7D%7D, possibly double-encoded), which decoding exposes.
    function isValidParamValue(raw) {
        if (raw === null || raw === undefined) return false;
        var value = String(raw).trim();
        if (!value || value.length > 1024) return false;
        var decoded = value;
        for (var i = 0; i < 3; i++) {
            if (/%[0-9a-fA-F]{2}/.test(decoded)) {
                try {
                    var next = decodeURIComponent(decoded);
                    if (next === decoded) break;
                    decoded = next;
                } catch (e) { break; }
            } else break;
        }
        if (/[{}]/.test(decoded)) return false;
        if (/%(7b|7d)/i.test(decoded)) return false;
        return true;
    }

    function cleanValue(raw) {
        return String(raw).trim();
    }

    /* ---------------- storage (localStorage -> cookie -> memory) ---------------- */

    var memoryRaw = null;

    function storageReadRaw() {
        try {
            var v = window.localStorage.getItem(STORAGE_KEY);
            if (v !== null && v !== undefined) return v;
        } catch (e) { /* storage blocked — fall through */ }
        try {
            var c = getCookie(STORAGE_KEY);
            if (c) {
                try { return decodeURIComponent(c); } catch (e) { return c; }
            }
        } catch (e) { /* cookies blocked — fall through */ }
        return memoryRaw;
    }

    function storageWriteRaw(raw, expiresAt) {
        try {
            window.localStorage.setItem(STORAGE_KEY, raw);
            if (window.localStorage.getItem(STORAGE_KEY) === raw) {
                memoryRaw = raw;
                return;
            }
        } catch (e) { /* fall through to cookie */ }
        try {
            setCookie(STORAGE_KEY, raw, expiresAt);
            if (getCookie(STORAGE_KEY)) {
                memoryRaw = raw;
                return;
            }
        } catch (e) { /* fall through to memory */ }
        memoryRaw = raw;
    }

    function storageClear() {
        memoryRaw = null;
        try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        try { setCookie(STORAGE_KEY, '', 0); } catch (e) {}
    }

    /* ---------------- attribution record ---------------- */

    function sanitizeParams(params) {
        var clean = {};
        if (!params || typeof params !== 'object') return clean;
        CAPTURE_KEYS.forEach(function (key) {
            if (isValidParamValue(params[key])) clean[key] = cleanValue(params[key]);
        });
        return clean;
    }

    // Returns the stored record { v, capturedAt, expiresAt, params } or null.
    // Expired or corrupt records are discarded.
    function loadAttributionRecord() {
        var raw = storageReadRaw();
        if (!raw) return null;
        var record;
        try { record = JSON.parse(raw); } catch (e) { storageClear(); return null; }
        if (!record || typeof record.capturedAt !== 'number' || !record.params) {
            storageClear();
            return null;
        }
        var expiresAt = typeof record.expiresAt === 'number'
            ? record.expiresAt
            : record.capturedAt + ATTRIBUTION_TTL_MS;
        if (Date.now() >= expiresAt) {
            storageClear();
            return null;
        }
        record.expiresAt = expiresAt;
        record.params = sanitizeParams(record.params);
        return record;
    }

    // Persisted params (copy), or {} when nothing valid is stored.
    function loadAttribution() {
        var record = loadAttributionRecord();
        return record ? Object.assign({}, record.params) : {};
    }

    function saveAttributionRecord(record) {
        storageWriteRaw(JSON.stringify(record), record.expiresAt);
        return record;
    }

    /* ---------------- path_source ---------------- */

    // Landing page slug: route/file name without extension; homepage -> "index".
    function generatePathSource(pathname) {
        var path = typeof pathname === 'string' ? pathname : (window.location.pathname || '');
        try { path = decodeURIComponent(path); } catch (e) { /* keep raw path */ }
        // Directory URLs (/, /blog/, /pages/…) serve their index file.
        if (!path || /\/$/.test(path)) return 'index';
        var segments = path.split('/').filter(function (s) { return s !== ''; });
        var slug = segments.length ? segments[segments.length - 1] : '';
        slug = slug.replace(/\.html?$/i, '');
        if (!slug || slug === 'index') return 'index';
        slug = slug.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
        return slug || 'index';
    }

    // The persisted (original landing) path_source; generated from the
    // current page only as a fallback before capture has run.
    function getPathSource() {
        var params = loadAttribution();
        return params.path_source || generatePathSource();
    }

    /* ---------------- capture ---------------- */

    function parseIncomingParams(search) {
        var incoming = {};
        var query = typeof search === 'string' ? search : (window.location.search || '');
        var searchParams;
        try {
            searchParams = new URLSearchParams(query.charAt(0) === '?' ? query.slice(1) : query);
        } catch (e) {
            return incoming;
        }
        CAPTURE_KEYS.forEach(function (key) {
            var value = searchParams.get(key);
            if (isValidParamValue(value)) incoming[key] = cleanValue(value);
        });
        return incoming;
    }

    /**
     * Capture valid params from the current (or supplied) URL into the
     * persisted record. Missing/empty params never overwrite stored values;
     * a conflicting ad identifier replaces the whole record (new ad visit).
     * @param {string} [search] - optional query string (defaults to location.search)
     * @returns {object|null} the stored record
     */
    function captureAttribution(search) {
        var incoming = parseIncomingParams(search);
        var existing = loadAttributionRecord();
        var now = Date.now();

        if (!existing) {
            var freshParams = Object.assign({}, incoming);
            if (!freshParams.path_source) freshParams.path_source = generatePathSource();
            return saveAttributionRecord({
                v: 1,
                capturedAt: now,
                expiresAt: now + ATTRIBUTION_TTL_MS,
                params: freshParams
            });
        }

        var hasConflict = AD_ID_KEYS.some(function (key) {
            return incoming[key] && existing.params[key] && incoming[key] !== existing.params[key];
        });

        if (hasConflict) {
            var newParams = Object.assign({}, incoming);
            if (!newParams.path_source) newParams.path_source = generatePathSource();
            return saveAttributionRecord({
                v: 1,
                capturedAt: now,
                expiresAt: now + ATTRIBUTION_TTL_MS,
                params: newParams
            });
        }

        // Same visit: merge partial updates. path_source is never recomputed
        // from later pages — the original landing value wins.
        var merged = Object.assign({}, existing.params);
        Object.keys(incoming).forEach(function (key) {
            if (key !== 'path_source') merged[key] = incoming[key];
        });
        if (!merged.path_source) {
            merged.path_source = incoming.path_source || generatePathSource();
        }
        return saveAttributionRecord({
            v: 1,
            capturedAt: existing.capturedAt,
            expiresAt: existing.expiresAt,
            params: merged
        });
    }

    /* ---------------- outbound URL building ---------------- */

    function isTargetDomain(hostname) {
        if (!hostname) return false;
        var host = hostname.toLowerCase().replace(/\.$/, '');
        return TARGET_DOMAINS.some(function (domain) {
            return host === domain || host.slice(-(domain.length + 1)) === '.' + domain;
        });
    }

    /**
     * Return a main-domain URL with all persisted attribution applied:
     * path_source + tw_/*\/cvg_*\//fbclid + utm_source=<initials> +
     * channel=<original utm_source> + remaining utm_*\/campaign_id\/ad_id.
     * Uses URL/URLSearchParams (existing params/fragment preserved, existing
     * keys updated in place — never duplicated). Non-target and non-http(s)
     * URLs are returned unchanged.
     */
    function buildOutboundUrl(urlString) {
        if (!urlString) return urlString;
        var url;
        try {
            url = new URL(urlString, window.location.href);
        } catch (e) {
            return urlString;
        }
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return urlString;
        if (!isTargetDomain(url.hostname)) return urlString;

        var params = loadAttribution();
        FORWARD_ORDER.forEach(function (key) {
            if (key === 'path_source') {
                url.searchParams.set('path_source', params.path_source || generatePathSource());
            } else if (key === 'utm_source') {
                url.searchParams.set('utm_source', WL_INITIALS);
            } else if (key === 'channel') {
                if (isValidParamValue(params.utm_source)) {
                    url.searchParams.set('channel', cleanValue(params.utm_source));
                }
            } else if (isValidParamValue(params[key])) {
                url.searchParams.set(key, cleanValue(params[key]));
            }
        });
        return url.toString();
    }

    // Backward-compatible alias (previous behaviour appended only path_source).
    function addPathSource(urlString) {
        return buildOutboundUrl(urlString);
    }

    /* ---------------- link tagging ---------------- */

    function decorateLink(link) {
        if (!link || !link.href) return;
        var decorated = buildOutboundUrl(link.href);
        if (decorated !== link.href) link.href = decorated;
    }

    /** Tag every main-domain anchor under root (defaults to the document). */
    function tagLinks(root) {
        var scope = root && root.querySelectorAll ? root : document;
        scope.querySelectorAll('a[href]').forEach(decorateLink);
    }

    function observeLinkAdditions() {
        if (typeof MutationObserver === 'undefined' || !document.body) return;
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'A') decorateLink(node);
                    if (node.querySelectorAll) node.querySelectorAll('a[href]').forEach(decorateLink);
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ---------------- navigation / SPA handling ---------------- */

    function handleRouteChange() {
        captureAttribution();
        tagLinks();
    }

    function patchHistory() {
        if (!window.history || window.history.__hpiAttributionPatched) return;
        ['pushState', 'replaceState'].forEach(function (method) {
            var original = window.history[method];
            if (typeof original !== 'function') return;
            window.history[method] = function () {
                var result = original.apply(this, arguments);
                handleRouteChange();
                return result;
            };
        });
        try { window.history.__hpiAttributionPatched = true; } catch (e) { /* frozen history */ }
        window.addEventListener('popstate', handleRouteChange);
        window.addEventListener('hashchange', handleRouteChange);
    }

    /* ---------------- Pacagen click helper (existing f() pattern) ---------------- */

    function handlePacagenClick(baseUrl) {
        if (typeof cvg !== 'undefined') {
            cvg({ method: 'track', eventName: 'HealthPetInsiderPacagenClick' });
        }

        var finalUrl = buildOutboundUrl(baseUrl);

        // Forward Converge cookies as before (via URL API, hash-safe).
        var uid = getCookie('__cvg_uid');
        var sid = getCookie('__cvg_sid');
        if (uid || sid) {
            try {
                var url = new URL(finalUrl, window.location.href);
                if (uid) url.searchParams.set('__cvg_uid', uid);
                if (sid) url.searchParams.set('__cvg_sid', sid);
                finalUrl = url.toString();
            } catch (e) {
                finalUrl += (finalUrl.indexOf('?') === -1 ? '?' : '&');
                if (uid) finalUrl += '__cvg_uid=' + encodeURIComponent(uid);
                if (uid && sid) finalUrl += '&';
                if (sid) finalUrl += '__cvg_sid=' + encodeURIComponent(sid);
            }
        }

        setTimeout(function () {
            window.location.href = finalUrl;
        }, 200);
    }

    function setupPacagenLinkTracking() {
        document.addEventListener('click', function (e) {
            var link = e.target && e.target.closest ? e.target.closest('a.pacagen-link') : null;
            if (link && link.href) {
                e.preventDefault();
                handlePacagenClick(link.href);
            }
        });
    }

    /* ---------------- init ---------------- */

    function initAttribution() {
        captureAttribution();
        tagLinks();
        observeLinkAdditions();
        patchHistory();
        setupPacagenLinkTracking();
        // Last-chance tagging at click time (capture phase, before
        // navigation and before the pacagen-link handler). Covers plain,
        // target=_blank, and modified (cmd/ctrl/middle) clicks.
        document.addEventListener('click', function (e) {
            var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (link) decorateLink(link);
        }, true);
    }

    // Capture as early as possible so even a fast first click is attributed.
    captureAttribution();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAttribution);
    } else {
        initAttribution();
    }

    /* ---------------- public API ---------------- */

    var api = {
        TARGET_DOMAINS: TARGET_DOMAINS.slice(),
        WL_INITIALS: WL_INITIALS,
        CAPTURE_KEYS: CAPTURE_KEYS.slice(),
        captureAttribution: captureAttribution,
        loadAttribution: loadAttribution,
        loadAttributionRecord: loadAttributionRecord,
        buildOutboundUrl: buildOutboundUrl,
        addPathSource: addPathSource,
        tagLinks: tagLinks,
        getPathSource: getPathSource,
        generatePathSource: generatePathSource,
        isTargetDomain: isTargetDomain,
        isValidParamValue: isValidParamValue
    };

    window.HPIAttribution = api;
    // Backward-compatible globals.
    window.getCookie = getCookie;
    window.f = handlePacagenClick;
    window.getPathSource = getPathSource;
    window.addPathSource = addPathSource;
    window.captureAttribution = captureAttribution;
    window.loadAttribution = loadAttribution;
    window.buildOutboundUrl = buildOutboundUrl;
    window.tagLinks = tagLinks;
})();
