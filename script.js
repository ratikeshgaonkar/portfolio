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

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll shadow
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }
}
window.addEventListener('scroll', handleNavbarScroll);

// Active nav link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 120) {
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
window.addEventListener('scroll', updateActiveNavLink);

// Intersection Observer for scroll animations (excludes hero)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function initializeAnimations() {
    const selectors = [
        '.section-title',
        '.timeline-item',
        '.project-card',
        '.skill-category',
        '.about-highlights .highlight-item'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            // Never observe elements inside the hero section
            if (!el.closest('.hero')) {
                observer.observe(el);
            }
        });
    });
}

// Timeline dot pulse
function addTimelineDotAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%   { box-shadow: 0 0 0 3px rgba(26,115,232,0.2); }
            50%  { box-shadow: 0 0 0 7px rgba(26,115,232,0.08); }
            100% { box-shadow: 0 0 0 3px rgba(26,115,232,0.2); }
        }
        .nav-link.active { color: #1a73e8; }
        .nav-link.active::after { width: 100%; }
    `;
    document.head.appendChild(style);
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                showNotification('Message sent! I\'ll get back to you soon.', 'success');
                this.reset();
            } else {
                showNotification('Something went wrong. Please try again.', 'error');
            }
        }).catch(() => {
            showNotification('Network error. Please check your connection.', 'error');
        }).finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Notification
function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px;
        background: ${type === 'success' ? '#388e3c' : '#d32f2f'};
        color: white; padding: 1rem 1.5rem; border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12); z-index: 9999;
        transform: translateX(110%); transition: transform 0.3s ease;
        max-width: 360px; font-size: 0.9rem;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 50);
    setTimeout(() => {
        notification.style.transform = 'translateX(110%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Window resize — close mobile menu
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// Escape key closes mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    addTimelineDotAnimation();
    updateActiveNavLink();
});
