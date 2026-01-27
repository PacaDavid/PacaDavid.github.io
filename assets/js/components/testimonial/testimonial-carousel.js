// Testimonial Carousel Component
// Creates a carousel of testimonials with navigation
// Usage: createTestimonialCarousel()

(function() {
    'use strict';
    
    // Hard-coded testimonials
    const TESTIMONIALS = [
        {
            logo: 'https://cdn.shopify.com/s/files/1/0814/8369/4394/files/adv_andrew.png?v=1734381535',
            logoAlt: 'Dr. Andrew Findlaytor, DVM',
            quote: 'I recommend Pacagen to my patients because it gets to the root of our allergy flare-ups. It\'s a safe, effective solution that people with allergies can trust.',
            source: 'Dr. Andrew Findlaytor, DVM | Licensed Veterinarian'
        },
        {
            logo: 'https://cdn.shopify.com/s/files/1/0814/8369/4394/files/basil_square.jpg?v=1743016680',
            logoAlt: 'Dr. Basil Kahwash, MD',
            quote: 'Pacagen\'s technology is a game-changer for allergy sufferers - by targeting and reducing cat dander, it represents a proactive approach to symptoms beyond taking medications.',
            source: 'Dr. Basil Kahwash, MD | Board Certified Allergist'
        }
    ];
    
    const TITLE = 'Trusted by Doctors, Vets, and Experts';
    
    function createTestimonialCarousel() {
        if (!TESTIMONIALS || TESTIMONIALS.length === 0) {
            console.warn('TestimonialCarousel: No testimonials available');
            return '';
        }
        
        // Generate slides HTML
        const slidesHTML = TESTIMONIALS.map((testimonial, index) => {
            const logoHTML = testimonial.logo 
                ? `<div class="testimonial-logo"><img src="${testimonial.logo}" alt="${testimonial.logoAlt || 'Logo'}"></div>`
                : '';
            
            return `
                <div class="testimonial-slide ${index === 0 ? 'active' : ''}" data-slide-index="${index}">
                    <div class="testimonial-content">
                        ${logoHTML}
                        <div class="testimonial-quote">${testimonial.quote || ''}</div>
                    </div>
                    ${testimonial.source ? `<div class="testimonial-source">${testimonial.source}</div>` : ''}
                </div>
            `;
        }).join('');
        
        // Generate dots HTML
        const dotsHTML = TESTIMONIALS.map((_, index) => 
            `<button class="testimonial-dot ${index === 0 ? 'active' : ''}" data-slide-index="${index}" aria-label="Go to slide ${index + 1}"></button>`
        ).join('');
        
        const carouselId = `testimonial-carousel-${Date.now()}`;
        
        return `
            <section class="testimonial-section">
                <h2 class="testimonial-title">${TITLE}</h2>
                <div class="testimonial-carousel" id="${carouselId}">
                    ${slidesHTML}
                    <div class="testimonial-navigation">
                        <div class="testimonial-dots">
                            ${dotsHTML}
                        </div>
                    </div>
                </div>
            </section>
        `.trim();
    }
    
    // Initialize carousel functionality
    function initTestimonialCarousel(carouselElement) {
        if (!carouselElement) return;
        
        const slides = carouselElement.querySelectorAll('.testimonial-slide');
        const dots = carouselElement.querySelectorAll('.testimonial-dot');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Set all slides to the same height (using the tallest one)
        function setEqualHeights() {
            if (slides.length === 0) return;
            
            let maxHeight = 0;
            const originalStyles = [];
            
            // Store original styles and make all slides visible temporarily to measure them
            slides.forEach((slide, index) => {
                originalStyles[index] = {
                    display: slide.style.display,
                    visibility: slide.style.visibility,
                    position: slide.style.position,
                    opacity: slide.style.opacity,
                    height: slide.style.height
                };
                
                // Make visible but hidden for measurement
                slide.style.display = 'block';
                slide.style.visibility = 'hidden';
                slide.style.position = 'absolute';
                slide.style.opacity = '0';
                slide.style.height = 'auto';
            });
            
            // Force reflow to get accurate measurements
            carouselElement.offsetHeight;
            
            // Find the tallest slide
            slides.forEach(slide => {
                const height = slide.scrollHeight || slide.offsetHeight;
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });
            
            // Set all slides to the max height and restore their display state
            slides.forEach((slide, index) => {
                slide.style.height = maxHeight + 'px';
                slide.style.visibility = '';
                slide.style.position = '';
                slide.style.opacity = '';
                
                // Restore display state
                if (index === currentSlide) {
                    slide.style.display = 'block';
                    slide.style.opacity = '1';
                } else {
                    slide.style.display = 'none';
                    slide.style.opacity = '0';
                }
            });
            
            // Set carousel container min-height to prevent shifting
            if (maxHeight > 0) {
                carouselElement.style.minHeight = maxHeight + 'px';
            }
        }
        
        function showSlide(index) {
            // Remove active class from all slides and dots
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.display = 'none';
                slide.style.opacity = '0';
            });
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            if (slides[index]) {
                slides[index].style.display = 'block';
                slides[index].classList.add('active');
                // Ensure height is maintained
                if (slides[index].style.height) {
                    // Height already set, just show it
                    slides[index].style.opacity = '1';
                } else {
                    // Use setTimeout to ensure display change happens before opacity
                    setTimeout(() => {
                        slides[index].style.opacity = '1';
                    }, 10);
                }
            }
            if (dots[index]) {
                dots[index].classList.add('active');
            }
            
            currentSlide = index;
        }
        
        // Set equal heights after content is loaded
        // Use multiple attempts to ensure it works after images load
        setTimeout(setEqualHeights, 100);
        setTimeout(setEqualHeights, 500);
        
        // Also set heights on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setEqualHeights, 250);
        });
        
        // Auto-scroll functionality
        let autoScrollInterval = null;
        
        function startAutoScroll() {
            stopAutoScroll(); // Clear any existing interval
            autoScrollInterval = setInterval(() => {
                const next = (currentSlide + 1) % totalSlides;
                showSlide(next);
            }, 5000); // Change slide every 5 seconds
        }
        
        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }
        
        function goToSlide(index) {
            showSlide(index);
            stopAutoScroll();
            setTimeout(startAutoScroll, 10000); // Resume after 10 seconds
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Touch/swipe functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let isSwiping = false;
        
        // Get the testimonial section for better touch area
        const testimonialSection = carouselElement.closest('.testimonial-section') || carouselElement;
        
        testimonialSection.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = true;
        }, { passive: true });
        
        testimonialSection.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            // Prevent scrolling if user is swiping horizontally
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - touchStartX);
            const diffY = Math.abs(currentY - touchStartY);
            
            // If horizontal swipe is more dominant, prevent default scroll
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        testimonialSection.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
            isSwiping = false;
        }, { passive: true });
        
        testimonialSection.addEventListener('touchcancel', () => {
            isSwiping = false;
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - go to next slide
                    const next = (currentSlide + 1) % totalSlides;
                    goToSlide(next);
                } else {
                    // Swipe right - go to previous slide
                    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
                    goToSlide(prev);
                }
            }
        }
        
        // Pause auto-scroll on hover
        carouselElement.addEventListener('mouseenter', stopAutoScroll);
        carouselElement.addEventListener('mouseleave', startAutoScroll);
        
        // Initialize
        showSlide(0);
        
        // Set heights after initial display
        setTimeout(() => {
            setEqualHeights();
            startAutoScroll();
        }, 50);
    }
    
    // Auto-detect and initialize placeholder elements
    function autoDetectAndInit() {
        // Look for data attribute placeholders
        const placeholders = document.querySelectorAll('[data-testimonial-carousel]:not([data-processed])');
        
        placeholders.forEach(placeholder => {
            placeholder.dataset.processed = 'true';
            
            // Replace placeholder with carousel HTML
            const carouselHTML = createTestimonialCarousel();
            placeholder.outerHTML = carouselHTML;
        });
        
        // Initialize any carousels that haven't been initialized yet
        const carousels = document.querySelectorAll('.testimonial-carousel:not([data-initialized])');
        carousels.forEach(carousel => {
            carousel.dataset.initialized = 'true';
            initTestimonialCarousel(carousel);
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
    window.initTestimonialCarousel = initTestimonialCarousel;
    window.createTestimonialCarousel = createTestimonialCarousel;
})();
