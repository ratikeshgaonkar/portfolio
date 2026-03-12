// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on nav links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('_replyto');
        const subject = formData.get('_subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Get submit button and show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Submit to Formspree
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            console.log('Response status:', response.status);
            if (response.ok) {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
            } else {
                response.text().then(text => {
                    console.log('Full response:', text);
                    try {
                        const data = JSON.parse(text);
                        console.log('Formspree errors:', data);
                        if (data.error === "Form not found") {
                            showNotification('Form configuration issue. Please verify your Formspree form is active.', 'error');
                        } else {
                            showNotification('There was an error sending your message. Please try again.', 'error');
                        }
                    } catch (e) {
                        console.log('Non-JSON response:', text);
                        showNotification('Form needs activation. Please check your email for verification link.', 'error');
                    }
                });
            }
        }).catch(error => {
            console.log('Network error:', error);
            showNotification('Network error. Please check your connection and try again.', 'error');
        }).finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
function initializeAnimations() {
    // Section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
    
    // Timeline items with alternating slide directions
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // Project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        observer.observe(card);
    });
    
    // Skill categories with staggered animation
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        setTimeout(() => {
            observer.observe(category);
        }, index * 200); // Stagger by 200ms
    });
    
    // About highlights
    const highlightItems = document.querySelectorAll('.about-highlights .highlight-item');
    highlightItems.forEach((item, index) => {
        setTimeout(() => {
            observer.observe(item);
        }, index * 150); // Stagger by 150ms
    });
    
    // Skill tags animation when skill category comes into view
    const skillCategoryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillTags = entry.target.querySelectorAll('.skill-tag');
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.animationDelay = `${index * 0.1}s`;
                        tag.classList.add('animate-skill-tag');
                    }, index * 50);
                });
            }
        });
    }, { threshold: 0.3 });
    
    skillCategories.forEach(category => {
        skillCategoryObserver.observe(category);
    });
}

// Typing animation for hero title
function initTypeAnimation() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;
    
    const text = titleElement.innerHTML;
    titleElement.innerHTML = '';
    titleElement.style.opacity = '1';
    
    let index = 0;
    function typeCharacter() {
        if (index < text.length) {
            titleElement.innerHTML = text.slice(0, index + 1);
            index++;
            setTimeout(typeCharacter, 25); // Faster typing: 25ms instead of 50ms
        } else {
            // After typing is complete, animate other hero elements
            animateHeroElements();
        }
    }
    
    setTimeout(typeCharacter, 500); // Start sooner: 500ms instead of 1000ms
}

// Animate hero elements after title animation
function animateHeroElements() {
    const subtitle = document.querySelector('.hero-subtitle');
    const description = document.querySelector('.hero-description');
    const buttons = document.querySelector('.hero-buttons');
    const contacts = document.querySelectorAll('.hero-contact .contact-item');
    
    // Animate subtitle
    setTimeout(() => {
        if (subtitle) {
            subtitle.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    }, 200);
    
    // Animate description
    setTimeout(() => {
        if (description) {
            description.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    }, 400);
    
    // Animate buttons
    setTimeout(() => {
        if (buttons) {
            buttons.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    }, 600);
    
    // Animate contact items with stagger
    contacts.forEach((contact, index) => {
        setTimeout(() => {
            contact.style.animation = 'slideInLeft 0.5s ease-out forwards';
        }, 800 + (index * 100));
    });
}

// Add floating animation to metrics when they come into view
function animateMetrics() {
    const metrics = document.querySelectorAll('.highlight-metric');
    
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const metric = entry.target;
                setTimeout(() => {
                    metric.style.animation = 'countUp 0.8s ease-out forwards';
                    metric.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }, { threshold: 0.5 });
    
    metrics.forEach(metric => {
        metric.style.transform = 'scale(0.8)';
        metric.style.opacity = '0.7';
        metricsObserver.observe(metric);
    });
}

// Skill tag hover effects
function initSkillTagEffects() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(26, 115, 232, 0.4)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
            this.style.boxShadow = '0 2px 10px rgba(26, 115, 232, 0.3)';
        });
    });
}

// Project card interactions
function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.project-header i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.project-header i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Timeline animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot) {
                    dot.style.animation = 'pulse 2s infinite';
                }
            }
        });
    }, { threshold: 0.5 });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Add pulse animation for timeline dots
function addTimelineDotAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.2); }
            50% { box-shadow: 0 0 0 8px rgba(26, 115, 232, 0.1); }
            100% { box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.2); }
        }
        
        .nav-link.active {
            color: #1a73e8;
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initTypeAnimation();
    initSkillTagEffects();
    initProjectCardEffects();
    initTimelineAnimations();
    addTimelineDotAnimation();
    
    // Hide hero elements initially for animation
    const heroElements = document.querySelectorAll('.hero-subtitle, .hero-description, .hero-buttons, .hero-contact .contact-item');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
    });
    
    // Initialize metrics animation
    animateMetrics();
    
    // Optional: Enable parallax effect (can cause performance issues on some devices)
    // initParallaxEffect();
    
    // Initialize active nav link
    updateActiveNavLink();
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handlers
const debouncedNavbarScroll = debounce(handleNavbarScroll, 10);
const debouncedActiveNavUpdate = debounce(updateActiveNavLink, 10);

window.removeEventListener('scroll', handleNavbarScroll);
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', debouncedNavbarScroll);
window.addEventListener('scroll', debouncedActiveNavUpdate); 
