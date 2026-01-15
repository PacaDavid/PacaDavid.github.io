// Main JavaScript file for Health Pet Insider

// Head Component - Insert favicon and stylesheets
function insertHeadElements(pageType = 'root') {
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

// Navigation Component - Insert navigation HTML
function insertNavigation(pageType = 'root', currentPage = '') {
    // Determine the correct paths based on page type
    const homePath = pageType === 'blog' ? '../index.html' : 'index.html';
    const logoPath = pageType === 'blog' ? '../assets/images/healthpetinsiderlogo.png' : 'assets/images/healthpetinsiderlogo.png';
    const blogPath = pageType === 'blog' ? 'index.html' : 'blog/index.html';
    
    // Create navigation HTML
    const navigationHTML = `
        <header>
            <nav>
                <a href="${homePath}"><img src="${logoPath}" alt="Health Pet Insider Logo" id="logo"></a>
                <ul class="p-0 mb-0">
                    <li><a href="${blogPath}" ${currentPage === 'blog' ? 'class="active"' : ''}>Articles</a></li>
                </ul>
            </nav>
        </header>
        <section class="scroll-banner py-2">
            <div class="scroll-content">
                <span>🐾  Pet Wellness Tips &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐕  Allergy Relief Insights &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐈  Nutrition Guides &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐾  Happy & Healthy Pets &nbsp;&nbsp;&nbsp;&nbsp;•</span>
                <span>🐾  Pet Wellness Tips &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐕  Allergy Relief Insights &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐈  Nutrition Guides &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐾  Happy & Healthy Pets &nbsp;&nbsp;&nbsp;&nbsp;•</span>
                <span>🐾  Pet Wellness Tips &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐕  Allergy Relief Insights &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐈  Nutrition Guides &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐾  Happy & Healthy Pets &nbsp;&nbsp;&nbsp;&nbsp;•</span>
                <span>🐾  Pet Wellness Tips &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐕  Allergy Relief Insights &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐈  Nutrition Guides &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; 🐾  Happy & Healthy Pets &nbsp;&nbsp;&nbsp;&nbsp;•</span>
            </div>
          </section>
    `;
    
    // Insert navigation at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navigationHTML);
}

// Footer Component - Insert footer HTML
function insertFooter(pageType = 'root') {
    // Determine the correct paths based on page type
    const privacyPath = pageType === 'blog' ? '../privacy-policy.html' : 'privacy-policy.html';
    const termsPath = pageType === 'blog' ? '../terms-of-service.html' : 'terms-of-service.html';
    
    // Create footer HTML
    const footerHTML = `
        <footer>
            <div class="container footer-HPI">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <p>&copy; 2026 Health Pet Insider. All rights reserved.</p>
                        <p>
                            <a href="${privacyPath}">Privacy Policy</a> | 
                            <a href="${termsPath}">Terms of Service</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    `;
    
    // Insert footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// Load components immediately when script loads (before DOM ready)
(function() {
    // Check if we're in a blog subdirectory
    const isInBlog = window.location.pathname.includes('/blog/');
    const pageType = isInBlog ? 'blog' : 'root';
    
    // Determine current page for active state
    let currentPage = '';
    if (window.location.pathname.includes('/blog/')) {
        currentPage = 'blog';
    } else if (window.location.pathname.includes('quiz.html')) {
        currentPage = 'quiz';
    }
    
    // Insert head elements immediately
    insertHeadElements(pageType);
    
    // Insert navigation and footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!document.querySelector('nav')) {
                insertNavigation(pageType, currentPage);
            }
            if (!document.querySelector('footer')) {
                insertFooter(pageType);
            }
        });
    } else {
        // DOM already loaded
        if (!document.querySelector('nav')) {
            insertNavigation(pageType, currentPage);
        }
        if (!document.querySelector('footer')) {
            insertFooter(pageType);
        }
    }
})();

function createProductShowcase(config) {
    const {
        image,
        alt,
        url,
        description,
        clickable = true,
        pageType = 'root'
    } = config;

    reviews ={
        "https://www.pacagen.com/products/cat-allergen-neutralizing-spray": ["4.72 out of 5 stars", "(600+ reviews)"],
        "https://www.pacagen.com/products/dog-allergen-neutralizing-spray": ["4.87 out of 5 stars", ""],
        "https://www.pacagen.com/products/dust-allergen-neutralizing-spray": ["5.00 out of 5 stars", ""],
        "https://pacagen.com/en-us/products/cat-allergen-reducing-supplement": ["4.80 out of 5 stars", "(200+ reviews)"],
        "https://www.pacagen.com/products/cat-allergen-reducing-supplement": ["4.80 out of 5 stars", "(200+ reviews)"],
        "https://www.pacagen.com/products/allergen-neutralizing-spray": ["4.72 out of 5 stars", "(600+ reviews)"]
    }
    
    // Determine the correct asset path
    const assetPath = pageType === 'blog' ? '../assets' : 'assets';
    
    if (clickable && url) {
        return `
        <a href="javascript:void(0)" class="d-flex w-md-65 justify-content-center align-items-center text-decoration-none" onclick="f('${url}')">
            <div class="card p-2">
                <div class="row mx-auto">
                    <div class="col-5 col-sm-4 col-md-3 p-0 px-md-2">
                        <img src="${assetPath}/images/${image}" class=" rounded-4" alt="${alt}">
                    </div>
                    <div class="col-7 col-sm-8 col-md-9">
                        <h2 class="card-title"><b>${alt}</b></h2>
                        <p class="card-reviews mb-1">★★★★★ &nbsp ${reviews[url][0]} ${reviews[url][1]}</p>
                        <p class="card-description mb-0">${description}</p>
                    </div>
                </div>
            </div>
        </a>
        `;
    } else {
        return `
            <div class="article-content-image d-flex">
                <img src="${assetPath}/images/${image}" class="article-img" alt="${alt}">
            </div>
        `;
    }
}

// Function to insert product showcase into page
function insertProductShowcase(targetSelector, config) {
    const target = document.querySelector(targetSelector);
    if (target) {
        target.insertAdjacentHTML('afterend', createProductShowcase(config));
    }
}

// Wait for DOM to be fully loaded for additional functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});