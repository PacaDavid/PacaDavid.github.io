# Component System Documentation for HPI

## Structure

```
components/
  article/
    fold.js              - Article header/fold component
    content-section.js   - Content section component
    breadcrumb.js        - Breadcrumb navigation
    author.js            - Author name and image
    date.js              - Publication/update date
    article-header.js    - Composite header
    blog-header.js       - Blog header
    article-footer.js    - Article footer
```

## Usage

### Fold Component

```javascript
initComponentsWhenReady(function() {
    const pageType = window.location.pathname.includes('/blog/') ? 'blog' : 'root';
    
    document.getElementById('article-fold').innerHTML = createFold({
        title: 'Article Title',
        authorName: 'John Doe',              // Optional
        authorImage: 'author.png',           // Optional
        authorImageAlt: 'Author photo',      // Optional
        leadingTitle: 'Subtitle',           // Optional
        imageSrc: 'hero-image.png',          // Required
        imageAlt: 'Hero image description',  // Required
        imageCaption: 'Image caption',       // Optional
        breadcrumb: true,                    // Optional
        homePath: 'index.html',               // Optional
        homeText: 'Home',                     // Optional
        dateText: 'Published on Jan 1, 2025', // Optional
        pageType: pageType                    // Required: 'root' or 'blog'
    });
}, { waitForArticle: true });
```

### Content Section Component

```javascript
initComponentsWhenReady(function() {
    const pageType = window.location.pathname.includes('/blog/') ? 'blog' : 'root';
    
    document.getElementById('content-section-1').innerHTML = createContentSection({
        title: 'Section Title',              // Optional
        paragraph: 'Single paragraph text',   // Or use 'paragraphs' array
        paragraphs: [                        // Array of paragraphs
            'First paragraph text...',
            'Second paragraph text...'
        ],
        imageSrc: 'image.png',               // Optional
        imageAlt: 'Image description',        // Optional
        imageCaption: 'Caption text',         // Optional
        additionalContent: '<ul><li>Item</li></ul>', // Optional HTML
        pageType: pageType                    // Required: 'root' or 'blog'
    });
}, { waitForArticle: true });
```




# archived
# PacaDavid.github.io
Health Pet Insider | For all your pet needs


## Usage of product card

- inserts product card as a child element of \#pacagen-spray-showcase
- add appropriate class to element. typically classes are: d-flex justify-content-center align-items-center mb-3, but adjust as needed based on context
- Wrap function call in a DOMContentLoaded event listener to make sure that element exists before attempting to query.
- sample usage below:
```
        document.addEventListener('DOMContentLoaded', function() {
            const pacagenSprayShowcase = createProductShowcase({
                image: 'canshand.png', //filename for image - function automatically routes to correct directory
                alt: 'Cat Allergen Neutralizing Spray', // image alt text
                description: 'Breaks down 98% of cat allergens on contact', // product description
                url: 'https://www.pacagen.com/products/cat-allergen-neutralizing-spray', // target url when clicked
                pageType: 'root' // use "blog" when calling function withing ./blog, else use "root"
            });
            document.getElementById('pacagen-spray-showcase').innerHTML = pacagenSprayShowcase;
        });
```


#archived
# PacaDavid.github.io
Health Pet Insider | For all your pet needs


## Usage of product card

- inserts product card as a child element of \#pacagen-spray-showcase
- add appropriate class to element. typically classes are: d-flex justify-content-center align-items-center mb-3, but adjust as needed based on context
- Wrap function call in a DOMContentLoaded event listener to make sure that element exists before attempting to query.
- sample usage below:
```
        document.addEventListener('DOMContentLoaded', function() {
            const pacagenSprayShowcase = createProductShowcase({
                image: 'canshand.png', //filename for image - function automatically routes to correct directory
                alt: 'Cat Allergen Neutralizing Spray', // image alt text
                description: 'Breaks down 98% of cat allergens on contact', // product description
                url: 'https://www.pacagen.com/products/cat-allergen-neutralizing-spray', // target url when clicked
                pageType: 'root' // use "blog" when calling function withing ./blog, else use "root"
            });
            document.getElementById('pacagen-spray-showcase').innerHTML = pacagenSprayShowcase;
        });
```
