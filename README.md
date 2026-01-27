# Health Pet Insider - Component System

## Component Hierarchy

```
components/
├── article/
│   ├── fold.js              # Main article header component (handles title, author, date, breadcrumb, image - all self-contained)
│   ├── breadcrumb.js        # Breadcrumb navigation (optional dependency for fold.js)
│   └── article-footer.js    # Article footer component
├── ads/
│   └── ad.js                # Ad component (background image ads)
├── comparison-table/
│   └── comparison-table.js  # Reusable comparison table with brand selector for mobile responsiveness
├── product/
│   ├── product-showcase.js  # Product showcase card
│   ├── product-card.js      # Product card component
│   └── product-reviews.js   # Product reviews component
└── testimonial/
    └── testimonial-carousel.js  # Testimonial carousel component
```

## Reusable CSS Components

- `highlight-box` - Callout box component for highlighting important information

## Component Bundles

### Product Components Bundle (`product-components-bundle.js`)
Loads product components in order:
- `product-reviews.js`
- `product-card.js`
- `product-showcase.js`
