// Main JavaScript file for Health Pet Insider

// Head Component - Insert favicon and stylesheets
function insertHeadElements(pageType = 'root') {
    // Same webfont files as index.html so header wordmark (Playfair) matches everywhere
    if (!document.querySelector('link[href*="Playfair+Display"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap';
        fontLink.setAttribute('data-hpi-fonts', 'playfair');
        document.head.appendChild(fontLink);
    }

    // Check if head elements already exist to prevent duplicates
    if (document.querySelector('link[rel="icon"]')) {
        return; // Already inserted
    }
    
    // Determine the correct path based on page type
    const assetPath = pageType === 'blog' ? '../assets' : 'assets';
    
    // Create the head elements
    const headElements = `
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="${assetPath}/images/favicon.ico">
        <link rel="icon" type="image/png" sizes="16x16" href="${assetPath}/images/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="${assetPath}/images/favicon-32x32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="${assetPath}/images/apple-touch-icon.png">
        <link rel="manifest" href="${assetPath}/images/site.webmanifest">

        <!-- Additional Meta Tags -->
        <meta name="theme-color" content="#2c5aa0">
        <meta name="msapplication-TileColor" content="#2c5aa0">
    `;
    
    // Insert the elements into the head
    document.head.insertAdjacentHTML('beforeend', headElements);
    
    // Load stylesheets with proper loading detection
    loadStylesheets(assetPath);
}

// Load stylesheets and show content when ready
function loadStylesheets(assetPath) {
    let stylesheetsLoaded = 0;
    const totalStylesheets = 2;
    let contentShown = false;
    
    function showContent() {
        if (!contentShown) {
            contentShown = true;
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
        }
    }
    
    function onStylesheetLoad() {
        stylesheetsLoaded++;
        if (stylesheetsLoaded === totalStylesheets) {
            // All stylesheets loaded, show the content
            showContent();
        }
    }
    
    // Fallback: Show content after 2 seconds even if CSS doesn't load
    setTimeout(showContent, 2000);
    
    // Load main stylesheet
    const mainCSS = document.createElement('link');
    mainCSS.rel = 'stylesheet';
    mainCSS.href = `${assetPath}/css/style.css`;
    mainCSS.onload = onStylesheetLoad;
    mainCSS.onerror = onStylesheetLoad; // Show content even if CSS fails
    document.head.appendChild(mainCSS);
    
    // Load Bootstrap CSS
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css';
    bootstrapCSS.integrity = 'sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr';
    bootstrapCSS.crossOrigin = 'anonymous';
    bootstrapCSS.onload = onStylesheetLoad;
    bootstrapCSS.onerror = onStylesheetLoad; // Show content even if CSS fails
    document.head.appendChild(bootstrapCSS);
}

/** True on the blog listing page (same page as article grid + filters). */
function isBlogIndexPage() {
    const path = (window.location.pathname || '').replace(/\/+$/, '') || '/';
    return /\/blog\/index\.html$/i.test(path)
        || /\/blog\/index$/i.test(path)
        || /(\/|^)blog$/i.test(path);
}

// Navigation Component - Insert navigation HTML (brand + pill nav + wave)
function insertNavigation(pageType = 'root', currentPage = '') {
    const homePath = pageType === 'blog' ? '../index.html' : 'index.html';
    const blogPath = pageType === 'blog' ? 'index.html' : 'blog/index.html';
    const blogIndexBase = pageType === 'blog' ? 'index.html' : 'blog/index.html';

    const onBlogIndex = pageType === 'blog' && isBlogIndexPage();

    const catPillHref = currentPage === 'home'
        ? '#section-cat'
        : (onBlogIndex ? '#category-cat' : `${blogIndexBase}#category-cat`);
    const dogPillHref = currentPage === 'home'
        ? '#section-dog'
        : (onBlogIndex ? '#category-dog' : `${blogIndexBase}#category-dog`);
    const homeCarePillHref = currentPage === 'home'
        ? '#section-home-care'
        : (onBlogIndex ? '#category-home-care' : `${blogIndexBase}#category-home-care`);

    const allArticlesHref = onBlogIndex ? '#blog-articles' : blogPath;
    const allArticlesActive = currentPage === 'blog' && !onBlogIndex;

    const waveSvg = '<svg class="site-header__wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0,105 C220,10 430,190 700,95 S1160,12 1440,72 L1440,160 L0,160 Z"/></svg>';

    const navigationHTML = `
        <header class="site-header">
            <div class="site-header__brand">
                <div class="site-header__inner site-header__brand-inner">
                    <a class="site-header__brand-link" href="${homePath}" aria-label="Health Pet Insider home">
                        <span class="site-header__wordmark">Health Pet Insider</span>
                    </a>
                </div>
            </div>
            <nav class="site-header__nav-pills" aria-label="Primary">
                <div class="site-header__inner">
                    <ul class="site-header__pill-list">
                        <li><a class="site-header__pill${currentPage === 'home' ? ' is-active' : ''}" href="${homePath}">Home</a></li>
                        <li><a class="site-header__pill" href="${catPillHref}">Cat</a></li>
                        <li><a class="site-header__pill" href="${dogPillHref}">Dog</a></li>
                        <li><a class="site-header__pill" href="${homeCarePillHref}">Home care</a></li>
                        <li><a class="site-header__pill${allArticlesActive ? ' is-active' : ''}" href="${allArticlesHref}">All articles</a></li>
                    </ul>
                </div>
            </nav>
            <div class="site-header__wave">${waveSvg}</div>
        </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', navigationHTML);
}

// Footer Component - Insert footer HTML (compact social row + link rows + brand strip)
function insertFooter(pageType = 'root') {
    const privacyPath = pageType === 'blog' ? '../privacy-policy.html' : 'privacy-policy.html';
    const termsPath = pageType === 'blog' ? '../terms-of-service.html' : 'terms-of-service.html';
    const homePath = pageType === 'blog' ? '../index.html' : 'index.html';
    const logoPath = pageType === 'blog' ? '../assets/images/healthpetinsiderlogo.png' : 'assets/images/healthpetinsiderlogo.png';

    const fbUrl = 'https://www.facebook.com/people/Health-Pet-Insider/61579650292093/';
    const igUrl = 'https://www.instagram.com/healthpetinsider';

    const iconFb = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
    const iconIg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="footer-ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#FFDC80"/><stop offset="45%" stop-color="#E1306C"/><stop offset="100%" stop-color="#833AB4"/></linearGradient></defs><path fill="url(#footer-ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

    const footerHTML = `
        <footer class="site-footer">
            <div class="site-footer__inner">
                <p class="site-footer__tagline">Stay connected for tips and healthy pet insights.</p>
                <div class="site-footer__social" role="list">
                    <a class="site-footer__social-link" href="${fbUrl}" target="_blank" rel="noopener noreferrer" aria-label="Health Pet Insider on Facebook" role="listitem">${iconFb}</a>
                    <a class="site-footer__social-link" href="${igUrl}" target="_blank" rel="noopener noreferrer" aria-label="Health Pet Insider on Instagram" role="listitem">${iconIg}</a>
                </div>
                <div class="site-footer__subscribe-block">
                    <form class="site-footer__subscribe" action="#" method="post" aria-label="Subscribe to email updates">
                        <label class="site-footer__subscribe-label" for="site-footer-email">Get tips in your inbox</label>
                        <div class="site-footer__subscribe-controls">
                            <input type="email" id="site-footer-email" class="site-footer__subscribe-input" name="email" placeholder="Email address" autocomplete="email" inputmode="email" required>
                            <button type="submit" class="site-footer__subscribe-btn">Subscribe</button>
                        </div>
                    </form>
                </div>
                <div class="site-footer__brand-row">
                    <a class="site-footer__logo-link" href="${homePath}"><img src="${logoPath}" alt="Health Pet Insider" class="site-footer__logo" width="180" height="40" loading="lazy"></a>
                    <div class="site-footer__legal">
                        <nav class="site-footer__legal-links" aria-label="Legal">
                            <a href="${privacyPath}">Privacy Policy</a>
                            <span class="site-footer__legal-sep" aria-hidden="true">|</span>
                            <a href="${termsPath}">Terms of Service</a>
                        </nav>
                        <p class="site-footer__copyright">&copy; 2026 Health Pet Insider. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

/** Blog articles and listing live under a /blog/… path (including /blog and /blog/index.html). */
function isInBlogPath() {
    const p = window.location.pathname || '';
    return /(^|\/)blog(\/|$)/.test(p);
}

// Load components immediately when script loads (before DOM ready)
(function() {
    const pageType = isInBlogPath() ? 'blog' : 'root';
    
    function isHomePage() {
        const p = window.location.pathname || '';
        if (isInBlogPath()) return false;
        const segments = p.split('/').filter(Boolean);
        if (segments.length === 0) return true;
        const last = segments[segments.length - 1];
        if (last === 'index.html') return true;
        if (p.endsWith('/') && last.indexOf('.') === -1) return true;
        return false;
    }

    let currentPage = '';
    if (isInBlogPath()) {
        currentPage = 'blog';
    } else if (window.location.pathname.includes('quiz.html')) {
        currentPage = 'quiz';
    } else if (isHomePage()) {
        currentPage = 'home';
    }
    
    // Insert head elements immediately
    insertHeadElements(pageType);
    
    // Insert navigation and footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!document.querySelector('.site-header')) {
                insertNavigation(pageType, currentPage);
            }
            if (!document.querySelector('.site-footer')) {
                insertFooter(pageType);
            }
            initBlogListingPage();
        });
    } else {
        // DOM already loaded
        if (!document.querySelector('.site-header')) {
            insertNavigation(pageType, currentPage);
        }
        if (!document.querySelector('.site-footer')) {
            insertFooter(pageType);
        }
        initBlogListingPage();
    }
})();

function badgeTextToBlogCategory(text) {
    const t = (text || '').trim();
    if (t === 'Dogs' || t === 'Dog Allergies') return 'dog';
    if (t === 'Home Care' || t === 'Recommended Products') return 'home-care';
    if (t === 'Guest Contributor') return 'dog';
    return 'cat';
}

function applyBlogArticleCategoryData() {
    document.querySelectorAll('.blog-index .blog-grid .blog-card').forEach(function(card) {
        const badge = card.querySelector('.category-badge');
        card.setAttribute('data-blog-category', badgeTextToBlogCategory(badge ? badge.textContent : ''));
    });
}

function syncBlogListingFromHash() {
    if (!isBlogIndexPage()) return;
    const validHashes = ['#blog-articles', '#category-cat', '#category-dog', '#category-home-care'];
    const hashToFilter = {
        '#blog-articles': 'all',
        '#category-cat': 'cat',
        '#category-dog': 'dog',
        '#category-home-care': 'home-care'
    };
    let h = window.location.hash || '#blog-articles';
    if (validHashes.indexOf(h) === -1) h = '#blog-articles';
    const filter = hashToFilter[h] || 'all';
    const grid = document.querySelector('.blog-index .blog-grid');
    if (grid) {
        if (filter === 'all') grid.removeAttribute('data-filter');
        else grid.setAttribute('data-filter', filter);
    }
    document.querySelectorAll('.site-header .site-header__pill').forEach(function(a) {
        a.classList.remove('is-active');
    });
    document.querySelectorAll('.site-header .site-header__pill').forEach(function(a) {
        if (a.getAttribute('href') === h) a.classList.add('is-active');
    });
}

function initBlogListingPage() {
    if (!isBlogIndexPage() || !document.querySelector('.blog-index .blog-grid')) return;
    applyBlogArticleCategoryData();
    syncBlogListingFromHash();
}

// Same-page #anchors: smooth scroll (delegation; works with injected nav and any document ready state)
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    // Blog index: header pills use hash for article filter — let the browser update the hash (blog page uses scroll-behavior: smooth)
    if (isBlogIndexPage() && link.closest('.site-header__nav-pills') && link.classList.contains('site-header__pill')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

window.addEventListener('hashchange', function() {
    syncBlogListingFromHash();
});

// Wait for DOM to be fully loaded for additional functionality
document.addEventListener('DOMContentLoaded', function() {
    const footerSubscribe = document.querySelector('.site-footer__subscribe');
    if (footerSubscribe) {
        footerSubscribe.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
});