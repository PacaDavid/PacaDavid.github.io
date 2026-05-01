// Related articles — in-article recommendations (not site footer).
// Auto-injects into #related-articles when present. Uses site-root paths in the catalog;
// links are rewritten for pages under /blog/ vs site root.
// Thumbnails: missing or broken hero URLs fall back to the site logo (same asset as header/footer).

(function () {
    'use strict';

    /** @type {{ path: string, title: string, snippet: string, image: string, category?: string }[]} */
    /* Each `image` matches that article’s fold hero (imageSrc) or first in-content hero image. */
    var RELATED_CATALOG = [
        {
            path: 'blog/how-cat-allergies-work.html',
            title: 'How Cat Allergies Work: The Science Behind Cat Allergies',
            snippet: 'What triggers reactions, how Fel d 1 spreads, and what actually helps.',
            image: 'https://cdn.shopify.com/s/files/1/0814/8369/4394/files/Blog_Images_17.png?v=1751541168',
            category: 'Cat allergies'
        },
        {
            path: 'blog/understanding-fel-d-1.html',
            title: 'Understanding Fel d 1: The Cat Allergen',
            snippet: 'Why this one protein drives most cat allergy symptoms.',
            image: 'assets/images/understanding_feld1.png',
            category: 'Cat allergies'
        },
        {
            path: 'best-cat-allergy-sprays.html',
            title: 'Best Cat Allergy Sprays in 2026',
            snippet: 'How sprays differ—and what to look for in a targeted neutralizer.',
            image: 'assets/images/bestcatsprays.png',
            category: 'Guides'
        },
        {
            path: 'blog/how-to-get-rid-of-cat-allergies.html',
            title: 'How to Get Rid of Cat Allergies',
            snippet: 'Practical steps to lower triggers and feel better at home.',
            image: 'https://cdn.shopify.com/s/files/1/0814/8369/4394/files/Man-Sneezing_1024x1024.jpg?v=1701804580',
            category: 'Cat allergies'
        },
        {
            path: 'blog/worst-cats-for-allergies.html',
            title: 'Allergic to Cats? Cat Breeds to Approach With Care',
            snippet: 'Fel d 1 levels, grooming habits, and what “hypoallergenic” really means.',
            image: 'assets/images/Persian-cat-3.jpg',
            category: 'Cat allergies'
        },
        {
            path: 'blog/how-dog-allergies-work.html',
            title: 'How Dog Allergies Work: The Science Behind Dog Allergies',
            snippet: 'Canine allergens, where they hide, and how reactions unfold.',
            image: 'https://cdn.shopify.com/s/files/1/0814/8369/4394/files/Dog_Allergies.png?v=1750374562',
            category: 'Dog allergies'
        },
        {
            path: '5-best-fixes-for-dog-allergies.html',
            title: '5 Best Fixes for Dog Allergies (Without Endless Baths)',
            snippet: 'Home habits, air quality, and targeted care that scale.',
            image: 'assets/images/woman-dog-allergies.png',
            category: 'Dog allergies'
        },
        {
            path: 'blog/best-home-air-purifiers.html',
            title: 'Best Air Purifiers for the Home',
            snippet: 'What matters for pet dander and everyday indoor triggers.',
            image: 'assets/images/best-air-purifier.png',
            category: 'Home care'
        },
        {
            path: '5-ways-to-manage-allergens.html',
            title: '5 Ways to Manage Allergens in the Home',
            snippet: 'Room-by-room habits that cut down what you breathe in.',
            image: 'assets/images/man-sneezing.png',
            category: 'Home care'
        },
        {
            path: 'best-supplement-for-cat-allergies.html',
            title: 'Best Supplement for Cat Allergies (2026)',
            snippet: 'What the science says about reducing Fel d 1 at the source.',
            image: 'assets/images/woman-with-kittens.png',
            category: 'Cat allergies'
        },
        {
            path: 'love-your-cat-lose-the-allergies.html',
            title: 'Love Your Cat, Lose the Allergies',
            snippet: 'A closer look at allergen-reducing approaches built around real homes.',
            image: 'assets/images/cat-owner.png',
            category: 'Cat allergies'
        },
        {
            path: 'real-reason-why-cat-allergies.html',
            title: 'The Real Reason Cats Trigger Allergies',
            snippet: 'Why reactions stick around—and how households are adapting.',
            image: 'assets/images/img-cat-product-hero.png',
            category: 'Cat allergies'
        },
        {
            path: 'why-househoulds-are-neutralizing-allergens.html',
            title: 'Why More Households Are Neutralizing Allergens Earlier',
            snippet: 'A calmer framing for sensitive homes, pets, and daily air.',
            image: 'assets/images/hero.png',
            category: 'Home care'
        },
        {
            path: 'blog/can-allergies-cause-a-cough.html',
            title: 'Can Allergies Cause a Cough?',
            snippet: 'When to suspect allergens—and when to talk with a clinician.',
            image: 'assets/images/Allergery_Cough.png',
            category: 'Wellness'
        },
        {
            path: '9-things-cat-parents-swear-by.html',
            title: '9 Things Cat Parents Swear By',
            snippet: 'Small upgrades that make shared spaces easier to live in.',
            image: 'assets/images/img-cat-product-hero.jpg',
            category: 'Cat life'
        },
        {
            path: 'blog/treat-cat-allergies-naturally.html',
            title: 'How to Treat Cat Allergies Naturally',
            snippet: 'Environment-first ideas that pair well with medical guidance.',
            image: 'https://cdn.shopify.com/s/files/1/0814/8369/4394/files/Blog_Images_16.png?v=1752441156',
            category: 'Cat allergies'
        }
    ];

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeAttr(s) {
        return escapeHtml(s).replace(/'/g, '&#39;');
    }

    /** For inline onerror="...this.src='…'" */
    function escapeJsSingleQuoted(s) {
        return String(s).replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
    }

    function inBlogPath() {
        return (window.location.pathname || '').indexOf('/blog/') !== -1;
    }

    /** Site-root key like `blog/foo.html` or `page.html` */
    function currentArticleKey() {
        var pathname = (window.location.pathname || '').replace(/\/+/g, '/');
        var parts = pathname.split('/').filter(Boolean);
        if (!parts.length) return '';
        var last = parts[parts.length - 1];
        if (last === 'index.html' || last === '') return '';
        if (inBlogPath()) {
            return 'blog/' + last;
        }
        return last;
    }

    /** @param {string} rootPath e.g. blog/x.html or guide.html */
    function hrefForArticle(rootPath) {
        var inBlog = inBlogPath();
        var targetBlog = rootPath.indexOf('blog/') === 0;
        if (inBlog && targetBlog) {
            return rootPath.replace(/^blog\//, '');
        }
        if (inBlog && !targetBlog) {
            return '../' + rootPath;
        }
        if (!inBlog && targetBlog) {
            return rootPath;
        }
        return rootPath.split('/').pop();
    }

    /** Hero URLs: site-relative `assets/...` or `/assets/...` need `../` when current page is under /blog/. */
    function resolveImageSrc(url) {
        if (!url) return '';
        if (/^https?:\/\//i.test(url)) return url;
        var pathOnly = url.replace(/^\//, '');
        if (inBlogPath()) return '../' + pathOnly;
        return pathOnly;
    }

    var RELATED_THUMB_FALLBACK = 'assets/images/healthpetinsiderlogo.png';

    function relatedThumbFallbackSrc() {
        return resolveImageSrc(RELATED_THUMB_FALLBACK);
    }

    function hashPickIndex(seed, modulo, salt) {
        var h = salt || 0;
        var str = seed + '|' + String(salt);
        for (var i = 0; i < str.length; i++) {
            h = ((h << 5) - h) + str.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h) % modulo;
    }

    function pickArticles(excludeKey, limit) {
        var pool = RELATED_CATALOG.filter(function (a) {
            return a.path !== excludeKey;
        });
        var out = [];
        var seed = excludeKey || window.location.pathname || 'home';
        var i = 0;
        while (out.length < limit && pool.length) {
            var idx = hashPickIndex(seed, pool.length, i);
            out.push(pool.splice(idx, 1)[0]);
            i++;
        }
        return out;
    }

    function createRelatedArticlesHtml(options) {
        var opts = options || {};
        var heading = opts.heading != null ? String(opts.heading) : 'Related articles';
        var limit = opts.limit != null ? Math.min(6, Math.max(1, opts.limit)) : 3;
        var exclude = opts.excludePath != null ? opts.excludePath : currentArticleKey();
        var items = pickArticles(exclude, limit);
        if (!items.length) return '';

        var hId = 'related-articles-heading';
        var parts = [
            '<section class="related-articles" aria-labelledby="' + hId + '">',
            '<h2 id="' + hId + '" class="related-articles__heading">' + escapeHtml(heading) + '</h2>',
            '<ul class="related-articles__list">'
        ];

        items.forEach(function (item) {
            var href = escapeAttr(hrefForArticle(item.path));
            var fallbackRaw = relatedThumbFallbackSrc();
            var primaryRaw = item.image ? resolveImageSrc(item.image) : '';
            var heroMissing = !primaryRaw;
            var displayRaw = heroMissing ? fallbackRaw : primaryRaw;
            var imgSrc = escapeAttr(displayRaw);
            var imgAlt = escapeAttr(item.title);
            var imgClass = 'related-articles__img' + (heroMissing ? ' related-articles__img--fallback' : '');
            var onerrorAttr = '';
            if (!heroMissing && primaryRaw !== fallbackRaw) {
                var fbJs = escapeJsSingleQuoted(fallbackRaw);
                onerrorAttr =
                    ' onerror="this.onerror=null;this.src=\'' +
                    fbJs +
                    '\';this.classList.add(\'related-articles__img--fallback\')"';
            }
            var cat = item.category || 'Health Pet Insider';
            parts.push(
                '<li class="related-articles__item">' +
                    '<a class="related-articles__link" href="' + href + '">' +
                        '<span class="related-articles__media">' +
                            '<img class="' + imgClass + '" src="' + imgSrc + '" alt="' + imgAlt + '" width="120" height="120" loading="lazy" decoding="async"' + onerrorAttr + '>' +
                        '</span>' +
                        '<span class="related-articles__body">' +
                            '<span class="related-articles__eyebrow">' + escapeHtml(cat) + '</span>' +
                            '<span class="related-articles__title">' + escapeHtml(item.title) + '</span>' +
                            '<span class="related-articles__snippet">' + escapeHtml(item.snippet) + '</span>' +
                        '</span>' +
                    '</a>' +
                '</li>'
            );
        });

        parts.push('</ul></section>');
        return parts.join('');
    }

    function mount() {
        var el = document.getElementById('related-articles');
        if (!el) return;
        var limit = parseInt(el.getAttribute('data-related-count'), 10);
        if (isNaN(limit)) limit = 3;
        var heading = el.getAttribute('data-related-heading');
        el.innerHTML = createRelatedArticlesHtml({
            limit: limit,
            heading: heading || undefined
        });
    }

    window.createRelatedArticlesHtml = createRelatedArticlesHtml;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
