// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
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
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// Navbar scroll shadow
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.style.boxShadow = window.scrollY > 50
        ? '0 2px 12px rgba(0,0,0,0.08)'
        : 'none';
});

// Active nav link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}
window.addEventListener('scroll', updateActiveNavLink);

// Scroll animations — only for non-hero elements
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

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
            method: 'POST', body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(r => {
            showNotification(r.ok ? "Message sent! I'll get back to you soon." : 'Something went wrong.', r.ok ? 'success' : 'error');
            if (r.ok) this.reset();
        }).catch(() => showNotification('Network error. Please try again.', 'error'))
          .finally(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; });
    });
}

function showNotification(message, type) {
    document.querySelector('.notification')?.remove();
    const n = document.createElement('div');
    n.className = 'notification';
    n.style.cssText = `position:fixed;top:100px;right:20px;background:${type==='success'?'#388e3c':'#d32f2f'};color:white;padding:1rem 1.5rem;border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,.12);z-index:9999;transform:translateX(110%);transition:transform .3s ease;max-width:360px;font-size:.9rem;`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 50);
    setTimeout(() => { n.style.transform = 'translateX(110%)'; setTimeout(() => n.remove(), 300); }, 4000);
}

// Pulse style for timeline dots
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(26,115,232,.2)} 50%{box-shadow:0 0 0 7px rgba(26,115,232,.07)} }
    .nav-link.active { color: #1a73e8; }
`;
document.head.appendChild(style);

// Init — ONLY observe elements outside .hero
document.addEventListener('DOMContentLoaded', () => {
    const targets = [
        '.section-title',
        '.timeline-item',
        '.project-card',
        '.skill-category',
        '.about-highlights .highlight-item'
    ];
    targets.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.closest('#home')) observer.observe(el);
        });
    });
    updateActiveNavLink();
});

// Close menu on resize / Escape
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// Dynamically set hero padding based on actual navbar height
function fixHeroPadding() {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    if (!navbar || !hero) return;
    const navHeight = navbar.offsetHeight;
    hero.style.paddingTop = (navHeight + 40) + 'px';
}

document.addEventListener('DOMContentLoaded', fixHeroPadding);
window.addEventListener('resize', fixHeroPadding);
