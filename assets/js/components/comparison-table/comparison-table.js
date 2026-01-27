// Comparison Table Component
// Creates a reusable comparison table with brand selector for mobile responsiveness
// Usage: createComparisonTable(config) - pageType is auto-detected

(function() {
    'use strict';
    
    // Auto-detect page type based on URL
    function getPageType() {
        return window.location.pathname.includes('/blog/') ? 'blog' : 'root';
    }
    
    // Resolve image paths based on page type
    function resolveImagePath(image, pageType) {
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        return image.startsWith('http') || image.startsWith('/')
            ? image
            : `${assetPath}/images/${image}`;
    }
    
    // Create a single table cell
    function createCell(cellData, pageType, className = '') {
        if (!cellData) {
            return `<td${className ? ` class="${className}"` : ''}></td>`;
        }
        
        // If cellData is a string, treat it as plain text
        if (typeof cellData === 'string') {
            const cellClass = cellData.includes('<strong>') || cellData.includes('<b>') 
                ? className 
                : className ? `sign-cell ${className}` : 'sign-cell';
            return `<td class="${cellClass}">${cellData}</td>`;
        }
        
        // If cellData is an object with type and content
        if (typeof cellData === 'object') {
            let cellContent = '';
            let cellClass = className ? `sign-cell ${className}` : 'sign-cell';
            
            if (cellData.type === 'yes') {
                const imagePath = resolveImagePath('yes-sign.png', pageType);
                cellContent = `<img src="${imagePath}" alt="Yes">`;
            } else if (cellData.type === 'no') {
                const imagePath = resolveImagePath('no-sign.png', pageType);
                cellContent = `<img src="${imagePath}" alt="No">`;
            } else if (cellData.type === 'warning') {
                const imagePath = resolveImagePath('warning-sign.png', pageType);
                cellContent = `<img src="${imagePath}" alt="Warning">`;
                if (cellData.text) {
                    cellContent += ` ${cellData.text}`;
                }
            } else if (cellData.text) {
                cellContent = cellData.text;
                // If it's not a sign cell, adjust class
                if (!cellData.type) {
                    cellClass = className || '';
                }
            }
            
            return `<td class="${cellClass}">${cellContent}</td>`;
        }
        
        return `<td${className ? ` class="${className}"` : ''}></td>`;
    }
    
    // Main function to create comparison table HTML
    function createComparisonTable(config) {
        const {
            rows = [],
            brands = [],
            tableId = 'comparison-table',
            selectorId = 'brand-select'
        } = config;
        
        // Auto-detect page type
        const pageType = getPageType();
        
        if (!rows || rows.length === 0) {
            console.warn('ComparisonTable: No rows provided');
            return '';
        }
        
        if (!brands || brands.length === 0) {
            console.warn('ComparisonTable: No brands provided');
            return '';
        }
        
        // Generate brand selector options
        const brandOptions = brands.map((brand, index) => {
            const selected = index === 0 ? ' selected' : '';
            return `<option value="${brand.value}"${selected}>${brand.name}</option>`;
        }).join('');
        
        // Generate table header
        const headerCells = [
            '<th>Feature</th>',
            '<th>Pacagen</th>',
            ...brands.map(brand => `<th class="col-${brand.value}">${brand.name}</th>`)
        ].join('');
        
        // Generate table rows
        const tableRows = rows.map(row => {
            const cells = [
                `<td>${row.feature}</td>`,
                createCell(row.pacagen, pageType),
                ...brands.map(brand => {
                    const brandData = row[brand.value];
                    return createCell(brandData, pageType, `col-${brand.value}`);
                })
            ].join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        
        // Generate brand selector HTML
        const selectorHTML = `
            <div class="brand-selector">
                <label for="${selectorId}">Compare Pacagen with:</label>
                <select id="${selectorId}" onchange="updateComparison(this.value)">
                    ${brandOptions}
                </select>
            </div>
        `;
        
        // Generate table HTML
        const tableHTML = `
            <div class="d-flex justify-content-center align-items-center mb-4">
                <div class="table-wrapper">
                    <table class="comparison-table" id="${tableId}" border="1">
                        <tr>${headerCells}</tr>
                        ${tableRows}
                    </table>
                </div>
            </div>
        `;
        
        return selectorHTML + tableHTML;
    }
    
    // Update comparison table visibility based on selected brand
    function updateComparison(selectedBrand) {
        // Find all comparison tables on the page
        const tables = document.querySelectorAll('.comparison-table');
        
        if (tables.length === 0) return;
        
        // Update each table
        tables.forEach(table => {
            updateComparisonForTable(table, selectedBrand);
        });
    }
    
    // Helper function to update a specific table
    function updateComparisonForTable(table, selectedBrand) {
        // Get all brand columns (excluding Feature and Pacagen columns)
        const brandColumns = table.querySelectorAll('[class*="col-"]');
        
        // On desktop (>= 769px), show all columns
        if (window.innerWidth >= 769) {
            brandColumns.forEach(cell => {
                cell.style.display = 'table-cell';
            });
            return;
        }
        
        // On mobile, show only selected brand
        brandColumns.forEach(cell => {
            const classes = cell.className.split(' ');
            const hasSelectedBrand = classes.some(cls => cls === `col-${selectedBrand}`);
            cell.style.display = hasSelectedBrand ? 'table-cell' : 'none';
        });
    }
    
    // Initialize comparison table functionality
    function initComparisonTable(tableElement) {
        if (!tableElement) return;
        
        const selectorId = 'brand-select';
        const brandSelect = document.getElementById(selectorId);
        
        if (brandSelect) {
            // Initialize with default selection
            updateComparison(brandSelect.value);
            
            // Handle resize to update display
            let resizeTimeout;
            const handleResize = function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    if (brandSelect) {
                        updateComparison(brandSelect.value);
                    }
                }, 250);
            };
            
            // Remove existing listeners if any, then add new one
            window.removeEventListener('resize', handleResize);
            window.addEventListener('resize', handleResize);
        }
    }
    
    // Auto-detect and initialize placeholder elements or existing tables
    function autoDetectAndInit() {
        // Look for data attribute placeholders
        const placeholders = document.querySelectorAll('[data-comparison-table]:not([data-processed])');
        
        placeholders.forEach(placeholder => {
            placeholder.dataset.processed = 'true';
            
            // Get config from data attribute (JSON)
            const configJson = placeholder.getAttribute('data-comparison-table');
            let config = {};
            
            try {
                config = JSON.parse(configJson);
            } catch (e) {
                console.warn('ComparisonTable: Invalid config JSON', e);
            }
            
            // Remove pageType from config if present (auto-detected now)
            delete config.pageType;
            
            // Replace placeholder with table HTML
            const tableHTML = createComparisonTable(config);
            placeholder.outerHTML = tableHTML;
        });
        
        // Initialize any tables that haven't been initialized yet
        const tables = document.querySelectorAll('.comparison-table:not([data-initialized])');
        tables.forEach(table => {
            table.dataset.initialized = 'true';
            initComparisonTable(table);
        });
    }
    
    // Initialize when DOM is ready
    function initializeOnReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoDetectAndInit);
        } else {
            autoDetectAndInit();
        }
    }
    
    // Watch for dynamically added elements
    function setupMutationObserver() {
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
                autoDetectAndInit();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Initialize
    initializeOnReady();
    setupMutationObserver();
    
    // Expose functions for manual use
    window.updateComparison = updateComparison;
    window.initComparisonTable = initComparisonTable;
    window.createComparisonTable = createComparisonTable;
})();
