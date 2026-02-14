// ============ SMOOTH SCROLL NAVIGATION ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            updateActiveNav();
        }
    });
});

function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============ HAMBURGER MENU ============
const hamburger = document.querySelector('.hamburger');
const navLinksMenu = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksMenu.style.display = navLinksMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinksMenu) navLinksMenu.style.display = 'none';
    });
});

// ============ GALLERY FUNCTIONALITY ============
document.addEventListener('DOMContentLoaded', function() {
    const IMAGES_PER_PAGE = 8;
    let currentFilter = 'all';
    let currentPage = 1;
    let allGalleryItems = [];
    let filteredItems = [];
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    allGalleryItems = Array.from(galleryItems);
    
    // Get all unique categories
    const availableCategories = [...new Set(allGalleryItems.map(item => item.getAttribute('data-category')))];
    
    function displayGalleryItems() {
        // Determine which items to show based on filter
        if (currentFilter === 'all') {
            filteredItems = allGalleryItems;
        } else {
            filteredItems = allGalleryItems.filter(item => 
                item.getAttribute('data-category') === currentFilter
            );
        }
        
        // Hide all items first
        allGalleryItems.forEach(item => {
            item.classList.remove('show');
        });
        
        // Show items for current page
        const startIndex = 0;
        const endIndex = currentPage * IMAGES_PER_PAGE;
        const itemsToShow = filteredItems.slice(startIndex, endIndex);
        
        itemsToShow.forEach((item, index) => {
            item.classList.add('show');
            item.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Remove old buttons
        removeButtons();
        
        // Create appropriate button(s)
        createButtons();
    }
    
    function removeButtons() {
        const existingMoreBtn = document.querySelector('.see-more-btn');
        const existingLessBtn = document.querySelector('.see-less-btn');
        if (existingMoreBtn) existingMoreBtn.remove();
        if (existingLessBtn) existingLessBtn.remove();
    }
    
    function createButtons() {
        const totalItems = filteredItems.length;
        const displayedItems = currentPage * IMAGES_PER_PAGE;
        
        // Create container for buttons if it doesn't exist
        let buttonContainer = document.querySelector('.gallery-button-container');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'gallery-button-container';
            galleryGrid.parentElement.appendChild(buttonContainer);
        }
        
        // Show "See More" if there are more items to load
        if (displayedItems < totalItems) {
            const seeMoreBtn = document.createElement('button');
            seeMoreBtn.className = 'see-more-btn';
            seeMoreBtn.textContent = 'See More';
            
            seeMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentPage++;
                displayGalleryItems();
                setTimeout(() => {
                    const newItems = galleryGrid.querySelectorAll('.gallery-item.show');
                    if (newItems.length > 0) {
                        newItems[newItems.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 100);
            });
            
            buttonContainer.appendChild(seeMoreBtn);
        }
        // Show "See Less" if we're viewing more than the first page
        else if (currentPage > 1) {
            const seeLessBtn = document.createElement('button');
            seeLessBtn.className = 'see-less-btn';
            seeLessBtn.textContent = 'See Less';
            
            seeLessBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentPage = 1;
                displayGalleryItems();
                setTimeout(() => {
                    const firstItems = galleryGrid.querySelectorAll('.gallery-item.show');
                    if (firstItems.length > 0) {
                        firstItems[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            });
            
            buttonContainer.appendChild(seeLessBtn);
        }
    }
    
    // Initial display
    displayGalleryItems();
    
    // Filter button clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Reset pagination and filter
            currentFilter = filterValue;
            currentPage = 1;
            
            displayGalleryItems();
        });
    });
    
    // Touch device detection for gallery overlay
    const isTouchDevice = () => {
        return (
            (typeof window !== 'undefined' &&
                ('ontouchstart' in window ||
                    (typeof window.DocumentTouch !== 'undefined' &&
                        document instanceof window.DocumentTouch))) ||
            typeof navigator !== 'undefined' &&
            (navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0)
        );
    };

    if (isTouchDevice()) {
        galleryGrid.addEventListener('click', function(e) {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem && galleryItem.classList.contains('show')) {
                e.stopPropagation();
                
                const overlay = galleryItem.querySelector('.gallery-overlay');
                if (overlay) {
                    galleryItem.classList.toggle('overlay-active');
                    
                    document.querySelectorAll('.gallery-item.show').forEach(otherItem => {
                        if (otherItem !== galleryItem) {
                            otherItem.classList.remove('overlay-active');
                        }
                    });
                }
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.gallery-item')) {
                document.querySelectorAll('.gallery-item.overlay-active').forEach(item => {
                    item.classList.remove('overlay-active');
                });
            }
        });
    }
    
    // ============ TESTIMONIALS CAROUSEL ============
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        
        testimonials.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        currentTestimonial = index;
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showTestimonial(currentTestimonial - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showTestimonial(currentTestimonial + 1);
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    showTestimonial(0);
    
    // Auto-rotate testimonials
    setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 5000);
    
    // Keyboard navigation for testimonials
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showTestimonial(currentTestimonial - 1);
        } else if (e.key === 'ArrowRight') {
            showTestimonial(currentTestimonial + 1);
        }
    });
});

// ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const galleryItemsLightbox = document.querySelectorAll('.gallery-item');
    galleryItemsLightbox.forEach(item => {
        observer.observe(item);
    });
});

// ============ CONTACT FORM ============
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        if (name.trim() && email.trim() && message.trim()) {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showNotification('Please fill out all fields.', 'error');
        }
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#d4af37' : '#c41e3a'};
        color: #1a1a1a;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 700;
        letter-spacing: 1px;
        animation: slideInNotification 0.4s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.4s ease-out';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ============ SCROLL ANIMATIONS ============
function animateOnScroll() {
    const elements = document.querySelectorAll('.about-item, .info-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });
}

window.addEventListener('load', () => {
    animateOnScroll();
});

// ============ BOOK BUTTON SCROLL ============
document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============ PARALLAX EFFECT ============
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (!isMobile) {
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
    });
} else {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.backgroundAttachment = 'scroll';
    }
}

// ============ BUTTON HOVER EFFECTS ============
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ============ NAVBAR SCROLL EFFECT ============
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.pageYOffset > 50) {
            navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
        }
    }
});

// ============ SCROLL TO TOP BUTTON ============
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.textContent = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #d4af37;
    color: #1a1a1a;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 24px;
    font-weight: 700;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 999;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.pointerEvents = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.background = '#c41e3a';
});

scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.background = '#d4af37';
});

// ============ DYNAMIC STYLES ============
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInNotification {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutNotification {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .gallery-button-container {
        display: flex;
        justify-content: center;
        margin-top: 40px;
        gap: 20px;
    }
    
    .see-more-btn,
    .see-less-btn {
        display: inline-block;
        padding: 15px 40px;
        background: #d4af37;
        color: #1a1a1a;
        border: none;
        border-radius: 5px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .see-more-btn:hover {
        background: #c41e3a;
        color: #f5f5f5;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .see-more-btn:active {
        transform: translateY(0);
    }
    
    .see-less-btn {
        background: #c41e3a;
        color: #f5f5f5;
    }
    
    .see-less-btn:hover {
        background: #d4af37;
        color: #1a1a1a;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .see-less-btn:active {
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
