// ========== SMOOTH SCROLLING & ACTIVE NAV =========
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

// ========== HAMBURGER MENU =========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.style.display = 'none';
    });
});

// ========== WAIT FOR DOM TO LOAD =========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing Gallery and Carousel');
    
    // ========== GALLERY FILTERS =========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    console.log('Gallery Items Found:', galleryItems.length);
    console.log('Filter Buttons Found:', filterBtns.length);
    
    // Show all items on load
    galleryItems.forEach(item => {
        item.classList.add('show');
        console.log('Added show class to item:', item.getAttribute('data-category'));
    });
    
    // Add filter button click handlers
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Filter button clicked:', this.getAttribute('data-filter'));
            
            // Update button states
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.add('show');
                    console.log('Showing:', category);
                } else {
                    item.classList.remove('show');
                    console.log('Hiding:', category);
                }
            });
        });
    });
    
    // ========== TESTIMONIALS CAROUSEL =========
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    console.log('Testimonials Found:', testimonials.length);
    console.log('Dots Found:', dots.length);
    console.log('Prev Button:', prevBtn ? 'Found' : 'Not Found');
    console.log('Next Button:', nextBtn ? 'Found' : 'Not Found');
    
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        console.log('Showing testimonial:', index);
        
        // Clamp index
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        
        // Update all testimonials
        testimonials.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update all dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        currentTestimonial = index;
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Previous clicked');
            showTestimonial(currentTestimonial - 1);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next clicked');
            showTestimonial(currentTestimonial + 1);
        });
    }
    
    // Dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log('Dot clicked:', index);
            showTestimonial(index);
        });
    });
    
    // Initialize first testimonial
    showTestimonial(0);
    
    // Auto-rotate every 5 seconds
    setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 5000);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showTestimonial(currentTestimonial - 1);
        } else if (e.key === 'ArrowRight') {
            showTestimonial(currentTestimonial + 1);
        }
    });
});

// ========== GALLERY ANIMATIONS =========
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

// Observe gallery items after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const galleryItemsLightbox = document.querySelectorAll('.gallery-item');
    galleryItemsLightbox.forEach(item => {
        observer.observe(item);
    });
});

// ========== FORM SUBMISSION =========
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

// ========== NOTIFICATION SYSTEM =========
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

// ========== SCROLL ANIMATIONS =========
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

// ========== BOOK NOW BUTTON =========
document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== PARALLAX EFFECT ON HERO =========
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

// ========== HOVER EFFECTS FOR BUTTONS =========
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ========== GALLERY LIGHTBOX EFFECT =========
document.addEventListener('DOMContentLoaded', () => {
    const galleryItemsLightbox = document.querySelectorAll('.gallery-item');
    galleryItemsLightbox.forEach(item => {
        item.addEventListener('click', function() {
            const overlay = this.querySelector('.gallery-overlay');
            if (overlay) {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            }
        });
    });
});

// ========== NAVBAR BACKGROUND ON SCROLL =========
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

// ========== SCROLL TO TOP BUTTON =========
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

// Add notification animations
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
`;
document.head.appendChild(style);
