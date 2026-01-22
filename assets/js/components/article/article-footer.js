// Article Footer Component
// Standard article footer with links
// Usage: createArticleFooter({ pageType: 'root' })

(function() {
    'use strict';
    
    function createArticleFooter(config = {}) {
        const { pageType = 'root' } = config;
        const homePath = pageType === 'blog' ? '../index.html' : 'index.html';
        const blogPath = pageType === 'blog' ? 'index.html' : '/blog/index.html';
        
        return `
            <footer class="article-footer">
                <p>Find more helpful healthy pet info on our <a href="${homePath}">homepage</a> or explore <a href="${blogPath}">all articles</a></p>
            </footer>
        `;
    }
    
    window.createArticleFooter = createArticleFooter;
})();

