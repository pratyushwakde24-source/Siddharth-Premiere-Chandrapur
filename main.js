// Disable automatic browser scroll restoration on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Clear URL hash immediately on page load to prevent anchor jumping
if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
}

// Force scroll position to 0 immediately on script load
window.scrollTo(0, 0);

// Logo enhancement — CSS handles the visual crop via overflow:hidden container + mix-blend-mode
// This function adds a loaded class to trigger any enhanced display state
function enhanceLogoDisplay() {
    const logoImg = document.querySelector('.hero-logo');
    if (!logoImg) return;

    const onLoaded = () => {
        // Mark logo as loaded so any progressive enhancement can apply
        logoImg.classList.add('logo-loaded');
        const wrap = logoImg.closest('.hero-logo-wrap');
        if (wrap) wrap.classList.add('logo-wrap-ready');
    };

    if (logoImg.complete && logoImg.naturalWidth > 0) {
        onLoaded();
    } else {
        logoImg.addEventListener('load', onLoaded);
    }
}
enhanceLogoDisplay();

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom premium easing curve
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Link Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Global Spotlight Cursor Glow
const spotlight = document.getElementById('spotlight');
document.addEventListener('mousemove', (e) => {
    gsap.to(spotlight, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// -------------------------------------------------------------
// SECTION 1: HERO CANVAS PARTICLES
// -------------------------------------------------------------
const canvas = document.getElementById('hero-particles');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 60;

function resizeCanvas() {
    const heroSec = document.getElementById('hero');
    if (heroSec) {
        canvas.width = heroSec.clientWidth;
        canvas.height = heroSec.clientHeight;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = Math.sin(Math.random() * 5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = '#f2ca50';
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (this.y < -10) {
            this.reset();
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#f2ca50';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for next render cycles
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animateParticles);
}
animateParticles();

// -------------------------------------------------------------
// HERO ENTRANCE SEQUENCING
// -------------------------------------------------------------
function initHeroEntrance() {
    // Force scroll position to 0
    window.scrollTo(0, 0);
    if (typeof lenis !== 'undefined') {
        lenis.scrollTo(0, { immediate: true });
    }

    const heroTl = gsap.timeline();
    
    // Headline leads — clean, premium entrance
    heroTl.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: 'power4.out',
        delay: 0.3
    })
    .to('.hero-desc', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    }, '-=1.0');
    
    // Check if .hero-btns exists before animating
    const hasHeroBtns = document.querySelector('.hero-btns');
    if (hasHeroBtns) {
        heroTl.to('.hero-btns', {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out'
        }, '-=0.9');
    }
    
    heroTl.to('.scroll-indicator', {
        opacity: 1,
        duration: 0.8
    }, hasHeroBtns ? '-=0.5' : '-=0.9');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroEntrance);
} else {
    initHeroEntrance();
}

window.addEventListener('load', () => {
    // Additional reset on complete window load
    setTimeout(() => {
        window.scrollTo(0, 0);
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, { immediate: true });
        }
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 20);
});

// -------------------------------------------------------------
// FLOATING ISLAND HEADER TRIGGER
// -------------------------------------------------------------
const navHeader = document.getElementById('nav-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Hide scroll indicator once user starts scrolling
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        if (currentScrollY > 50) {
            gsap.to(scrollIndicator, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
        } else {
            gsap.to(scrollIndicator, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
        }
    }
    
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
        // Scroll Down - hide header
        gsap.to(navHeader, { y: -120, duration: 0.4, ease: 'power3.out' });
    } else {
        // Scroll Up - show header
        gsap.to(navHeader, { y: 0, duration: 0.5, ease: 'power3.out' });
    }
    lastScrollY = currentScrollY;
}, { passive: true });

// Header active section highlighting using ScrollTrigger
const navItems = document.querySelectorAll('.nav-links li');
const scrollSections = document.querySelectorAll('section');

scrollSections.forEach(sec => {
    const id = sec.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!navLink) return;
    const navItem = navLink.parentElement;
    
    ScrollTrigger.create({
        trigger: sec,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
            if (self.isActive) {
                navItems.forEach(item => item.classList.remove('active'));
                navItem.classList.add('active');
            }
        }
    });
});

// Mobile Drawer Navigation Logic
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const closeDrawer = document.getElementById('close-drawer');
const mobileDrawer = document.getElementById('mobile-drawer');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
    });
}
if (closeDrawer && mobileDrawer) {
    closeDrawer.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
    });
}
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        mobileDrawer.classList.remove('open');
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            lenis.scrollTo(targetEl);
        }
    });
});

// Intercept all anchor clicks for smooth Lenis scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') {
            e.preventDefault();
            return;
        }
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                lenis.scrollTo(targetEl);
            }
        }
    });
});


// -------------------------------------------------------------
// SECTION 2: ABOUT / STORY PARALLAX & TIMELINE
// -------------------------------------------------------------
// Image Parallax scroll
// Image scroll animation disabled to keep the framed showcase fully visible without cropping
/*
gsap.to('.about-parallax-img', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
        trigger: '.about-parallax-wrap',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});
*/

// Timeline Progress Bar drawing
gsap.to('#timeline-scroll-bar', {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: '.timeline-wrap',
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: true
    }
});

// Timeline items scroll reveal
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
    const content = item.querySelector('.timeline-content');
    
    gsap.fromTo(content, 
        { opacity: 0, y: 50 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 75%',
                onEnter: () => item.classList.add('active'),
                onLeaveBack: () => item.classList.remove('active'),
                toggleActions: 'play none none reverse'
            }
        }
    );
});

// -------------------------------------------------------------
// SECTION 3: SERVICES 3D TILT INTERACTION
// -------------------------------------------------------------
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    // Reveal services on scroll
    gsap.fromTo(card,
        { opacity: 0, y: 80 },
        {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // 3D Card tilt calculation
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse relative X inside card
        const y = e.clientY - rect.top;  // Mouse relative Y inside card
        
        const xPercent = (x / rect.width) - 0.5; // -0.5 to 0.5
        const yPercent = (y / rect.height) - 0.5;
        
        const maxRotation = 10; // Maximum rotation in degrees
        
        gsap.to(card.querySelector('.service-card-inner'), {
            rotateY: xPercent * maxRotation,
            rotateX: -yPercent * maxRotation,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Dynamic border glow matching mouse location
        card.style.borderColor = `rgba(242, 202, 80, ${0.15 + (Math.abs(xPercent) + Math.abs(yPercent)) * 0.4})`;
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.service-card-inner'), {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
        card.style.borderColor = 'var(--glass-border)';
    });
});


// -------------------------------------------------------------
// BANQUET SECTION: GSAP REVEAL + AUTO SLIDESHOW
// -------------------------------------------------------------
(function initBanquetSection() {
    const imageSide  = document.getElementById('banquet-image-side');
    const infoSide   = document.getElementById('banquet-info-side');
    const slideshow  = document.getElementById('banquet-slideshow');

    if (!imageSide || !infoSide) return;

    // GSAP scroll-triggered reveals
    gsap.fromTo(imageSide, 
        { opacity: 0, x: -40 },
        {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#events',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo(infoSide,
        { opacity: 0, x: 40 },
        {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
                trigger: '#events',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Stagger reveal for info child elements
    const infoChildren = infoSide.querySelectorAll(
        '.banquet-eyebrow, .banquet-title, .banquet-subtext, .banquet-event-types, .banquet-features, .banquet-cta-row'
    );
    gsap.fromTo(infoChildren,
        { opacity: 0, y: 24 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            delay: 0.35,
            scrollTrigger: {
                trigger: '#events',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Auto slideshow: rotate every 4 seconds, pause on hover
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.banquet-slide');
    const dots   = slideshow.querySelectorAll('.banquet-dot');
    let current  = 0;
    let timer    = null;
    let paused   = false;

    function goToSlide(idx) {
        slides[current].classList.remove('banquet-slide--active');
        dots[current].classList.remove('banquet-dot--active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('banquet-slide--active');
        dots[current].classList.add('banquet-dot--active');
    }

    function startTimer() {
        timer = setInterval(() => {
            if (!paused) goToSlide(current + 1);
        }, 4000);
    }

    // Dot click navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    // Pause on hover
    slideshow.addEventListener('mouseenter', () => { paused = true; });
    slideshow.addEventListener('mouseleave', () => { paused = false; });

    startTimer();
})();

// -------------------------------------------------------------
// SECTION 4: PORTFOLIO PINNED HORIZONTAL SCROLL

// -------------------------------------------------------------
const portfolioWrapper = document.querySelector('.portfolio-pin-wrapper');
if (window.innerWidth > 768) {
    gsap.to(portfolioWrapper, {
        x: () => -(portfolioWrapper.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '#portfolio',
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${portfolioWrapper.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
        }
    });
}

// Reveal cards on entrance
const portfolioCards = document.querySelectorAll('.portfolio-card');
portfolioCards.forEach(pCard => {
    const pText = pCard.querySelector('.portfolio-info p');
    
    pCard.addEventListener('mouseenter', () => {
        gsap.to(pText, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out'
        });
    });
    
    pCard.addEventListener('mouseleave', () => {
        gsap.to(pText, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power3.in'
        });
    });
});

// -------------------------------------------------------------
// SECTION 5: ACHIEVEMENTS COUNT-UP COUNTERS
// -------------------------------------------------------------
gsap.fromTo('.stats-info',
    { opacity: 0, y: 60 },
    {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.stats-sec',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    }
);

// Trigger counters
const statsGrid = document.querySelector('.stats-grid');
const statBoxes = document.querySelectorAll('.stat-box');

statBoxes.forEach(box => {
    const numberEl = box.querySelector('.stat-number');
    const targetVal = parseFloat(numberEl.getAttribute('data-target'));
    const suffix = numberEl.getAttribute('data-suffix');
    
    gsap.fromTo(box,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: statsGrid,
                start: 'top 80%',
                onEnter: () => {
                    const counterObj = { value: 0 };
                    gsap.to(counterObj, {
                        value: targetVal,
                        duration: 2.0,
                        ease: 'power2.out',
                        onUpdate: () => {
                            if (targetVal % 1 !== 0) {
                                numberEl.innerText = counterObj.value.toFixed(1) + suffix;
                            } else {
                                numberEl.innerText = Math.floor(counterObj.value) + suffix;
                            }
                        }
                    });
                },
                toggleActions: 'play none none none'
            }
        }
    );
});

// -------------------------------------------------------------
// SECTION 6: TESTIMONIALS SLIDER TRACK
// -------------------------------------------------------------
const sliderTrack = document.getElementById('testimonial-slider-track');
const sliderContainer = document.getElementById('testimonial-track-container');

if (sliderTrack && sliderContainer) {
    // Clone items to create infinite effect
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach(c => {
        const clone = c.cloneNode(true);
        sliderTrack.appendChild(clone);
    });
    
    let scrollSpeed = 1; // Default speed in pixels per frame
    let xPos = 0;
    let isScrolling = false;
    
    function scrollTestimonials() {
        if (!isScrolling) {
            xPos -= scrollSpeed;
            
            // Reset position when half elements are scrolled through
            const halfWidth = sliderTrack.scrollWidth / 2;
            if (Math.abs(xPos) >= halfWidth) {
                xPos = 0;
            }
            
            sliderTrack.style.transform = `translateX(${xPos}px)`;
        }
        requestAnimationFrame(scrollTestimonials);
    }
    scrollTestimonials();
    
    // Make scrolling slider interactive
    window.addEventListener('scroll', () => {
        // Increase sliding speed slightly while scrolling
        scrollSpeed = 2 + Math.min(Math.abs(window.scrollY - lastScrollY) * 0.2, 8);
        setTimeout(() => {
            scrollSpeed = 1;
        }, 150);
    });
    
    sliderContainer.addEventListener('mouseenter', () => {
        isScrolling = true;
    });
    sliderContainer.addEventListener('mouseleave', () => {
        isScrolling = false;
    });
}

// -------------------------------------------------------------
// SECTION 7: CTA MOUSE GRADIENT LIGHT
// -------------------------------------------------------------
const ctaSection = document.getElementById('cta');
const ctaGlow = document.getElementById('cta-glow');
const ctaContent = document.getElementById('cta-content-wrap');

if (ctaSection && ctaGlow && ctaContent) {
    ctaSection.addEventListener('mousemove', (e) => {
        const rect = ctaSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set CSS properties dynamically
        ctaGlow.style.setProperty('--mouse-x', `${x}px`);
        ctaGlow.style.setProperty('--mouse-y', `${y}px`);
    });

    gsap.fromTo(ctaContent,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

// -------------------------------------------------------------
// SECTION 8: FOOTER CANVAS WAVE ANIMATION
// -------------------------------------------------------------
const waveCanvas = document.getElementById('wave-canvas');
const waveCtx = waveCanvas.getContext('2d');

let waveWidth, waveHeight;

function resizeWaveCanvas() {
    waveWidth = waveCanvas.width = waveCanvas.parentElement.clientWidth;
    waveHeight = waveCanvas.height = waveCanvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeWaveCanvas);
resizeWaveCanvas();

let wavePhase = 0;
function drawWave() {
    waveCtx.clearRect(0, 0, waveWidth, waveHeight);
    
    waveCtx.beginPath();
    waveCtx.strokeStyle = 'rgba(242, 202, 80, 0.4)';
    waveCtx.lineWidth = 1;
    
    // Wave 1
    for (let x = 0; x < waveWidth; x++) {
        const y = Math.sin(x * 0.004 + wavePhase) * 12 + waveHeight / 2;
        if (x === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
    }
    waveCtx.stroke();
    
    // Wave 2 (delayed phase and smaller)
    waveCtx.beginPath();
    waveCtx.strokeStyle = 'rgba(242, 202, 80, 0.2)';
    waveCtx.lineWidth = 0.5;
    for (let x = 0; x < waveWidth; x++) {
        const y = Math.sin(x * 0.006 - wavePhase * 1.5) * 8 + waveHeight / 2;
        if (x === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
    }
    waveCtx.stroke();
    
    wavePhase += 0.02;
    requestAnimationFrame(drawWave);
}
drawWave();

// Footer scroll to top interaction
const topBtn = document.getElementById('top-btn');
topBtn.addEventListener('click', () => {
    lenis.scrollTo('#hero', { duration: 1.5 });
});

// -------------------------------------------------------------
// INQUIRY MODAL CREATION AND LOGIC
// -------------------------------------------------------------
function createInquiryModal() {
    if (document.getElementById('inquiry-modal')) return;
    
    const modalHtml = `
        <div class="inquiry-modal-overlay" id="inquiry-modal">
            <div class="inquiry-modal-card glass-card lustre-border" style="border-radius: 0; max-height: 90vh; overflow-y: auto;">
                <button class="inquiry-modal-close" aria-label="Close Modal">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <h3 class="font-headline-lg" style="color: var(--primary); margin-bottom: 8px;">Book Your Stay</h3>
                <p class="font-body-md" style="color: var(--text-muted); margin-bottom: 32px;">Reserve your luxury experience at Hotel Siddharth Premiere, Chandrapur.</p>
                <form class="inquiry-form" id="inquiry-form">
                    <div class="input-group">
                        <span class="input-label">Full Name</span>
                        <input type="text" id="booking-name" class="input-field" required>
                        <div class="input-underline"></div>
                    </div>
                    
                    <div class="input-group">
                        <span class="input-label">Mobile Number</span>
                        <input type="tel" id="booking-phone" class="input-field" required pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number">
                        <div class="input-underline"></div>
                    </div>
                    
                    <div class="input-group">
                        <span class="input-label">Email Address</span>
                        <input type="email" id="booking-email" class="input-field" required>
                        <div class="input-underline"></div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <div class="input-group">
                            <span class="input-label">Check-In</span>
                            <input type="date" id="check-in-date" class="input-field" required style="color-scheme: dark;">
                            <div class="input-underline"></div>
                        </div>
                        <div class="input-group">
                            <span class="input-label">Check-Out</span>
                            <input type="date" id="check-out-date" class="input-field" required style="color-scheme: dark;">
                            <div class="input-underline"></div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <div class="input-group" style="position: relative; margin-bottom: 32px;">
                            <span class="input-label" style="position: absolute; top: -16px; left: 0; color: var(--primary); font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">Room Type</span>
                            <select id="booking-room" class="inquiry-select-field" required>
                                <option value="" disabled selected>Select Room Class...</option>
                                <option value="Executive Room">Executive Room</option>
                                <option value="Suite Room">Suite Room</option>
                                <option value="Premier Suite">Premier Suite</option>
                            </select>
                        </div>
                        
                        <div class="input-group" style="position: relative; margin-bottom: 32px;">
                            <span class="input-label" style="position: absolute; top: -16px; left: 0; color: var(--primary); font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">Guests</span>
                            <select id="booking-guests" class="inquiry-select-field" required>
                                <option value="1">1 Guest</option>
                                <option value="2" selected>2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4+">4+ Guests</option>
                            </select>
                        </div>
                    </div>

                    <div class="input-group">
                        <span class="input-label">Special Requests</span>
                        <textarea id="booking-message" class="input-field" rows="2" style="resize: none;"></textarea>
                        <div class="input-underline"></div>
                    </div>
                    
                    <button type="submit" class="btn-primary sweep-shine" style="width: 100%; border: none; margin-top: 16px;">Confirm Reservation</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.getElementById('inquiry-modal');
    const closeBtn = modal.querySelector('.inquiry-modal-close');
    const form = modal.querySelector('#inquiry-form');
    const card = modal.querySelector('.inquiry-modal-card');
    
    const checkInInput = form.querySelector('#check-in-date');
    const checkOutInput = form.querySelector('#check-out-date');
    
    // Set dynamic date boundaries
    const todayStr = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', todayStr);
    checkInInput.value = todayStr;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    checkOutInput.setAttribute('min', tomorrowStr);
    checkOutInput.value = tomorrowStr;

    checkInInput.addEventListener('change', () => {
        const checkInDate = new Date(checkInInput.value);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const minCheckOutStr = nextDay.toISOString().split('T')[0];
        checkOutInput.setAttribute('min', minCheckOutStr);
        if (new Date(checkOutInput.value) <= checkInDate) {
            checkOutInput.value = minCheckOutStr;
        }
    });

    window.openInquiryModal = (preselectedRoom) => {
        if (preselectedRoom && form.querySelector('#booking-room')) {
            form.querySelector('#booking-room').value = preselectedRoom;
        }
        modal.classList.add('open');
        if (typeof lenis !== 'undefined') lenis.stop();
    };
    
    window.closeInquiryModal = () => {
        modal.classList.remove('open');
        if (typeof lenis !== 'undefined') lenis.start();
    };
    
    closeBtn.addEventListener('click', window.closeInquiryModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeInquiryModal();
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const userName = form.querySelector('#booking-name').value;
        const userEmail = form.querySelector('#booking-email').value;
        const userPhone = form.querySelector('#booking-phone').value;
        const roomSelected = form.querySelector('#booking-room').value;
        
        card.innerHTML = `
            <div class="inquiry-success-container">
                <span class="material-symbols-outlined inquiry-success-icon">check_circle</span>
                <h3 class="font-headline-lg" style="color: var(--primary); margin-bottom: 16px;">Booking Request Received</h3>
                <p class="font-body-lg" style="color: var(--on-surface); margin-bottom: 24px; font-weight: 300;">
                    Thank you, <strong>${userName}</strong>! We have received your booking request for the <strong>${roomSelected}</strong>.
                </p>
                <p class="font-body-md" style="color: var(--text-muted); margin-bottom: 32px;">
                    A summary of details has been sent to <strong>${userEmail}</strong> and your contact number <strong>${userPhone}</strong>. Our reservation manager will contact you within 2-4 hours to finalize your reservation.
                </p>
                <button class="btn-primary sweep-shine" onclick="window.closeInquiryModal()" style="width: 100%; border: none;">Close Window</button>
            </div>
        `;
    });
}

// -------------------------------------------------------------
// GUEST PORTAL / ACCOUNT MODAL CREATION AND LOGIC
// -------------------------------------------------------------
function createAccountModal() {
    if (document.getElementById('account-modal')) return;

    const modalHtml = `
        <div class="inquiry-modal-overlay" id="account-modal" role="dialog" aria-modal="true" aria-label="User Menu">
            <div class="inquiry-modal-card glass-card lustre-border" style="border-radius: 0; max-width: 450px; text-align: center; padding: 40px;">
                <button class="inquiry-modal-close account-modal-close" aria-label="Close User Menu">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <span class="material-symbols-outlined" style="font-size: 48px; color: var(--primary); margin-bottom: 16px;">account_circle</span>
                <h3 class="font-display-lg" style="color: var(--primary); font-size: 1.75rem; margin-bottom: 8px; font-style: italic;">Guest Services</h3>
                <p class="font-body-md" style="color: var(--text-muted); margin-bottom: 32px; font-size: 0.9rem;">Connect with our concierge or book your luxury experience.</p>
                
                <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
                    <button id="modal-book-room" class="btn-primary sweep-shine" style="width: 100%; border: none; height: 56px; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;">Book a Room</button>
                    <a href="https://wa.me/918412800000?text=Hello%20Hotel%20Siddharth%20Premiere,%20I%20would%20like%20to%20enquire%20about%20booking%20a%20room." target="_blank" rel="noopener noreferrer" class="sweep-shine" style="width: 100%; height: 56px; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; text-decoration: none; color: #fff; background-color: #25D366; border: none; font-family: var(--font-body); cursor: pointer; transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor; margin-right: 8px;"><path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.477 1.332 4.992L2 22l5.163-1.355a9.923 9.923 0 0 0 4.849 1.266c5.506 0 9.987-4.481 9.987-9.988s-4.481-9.935-9.987-9.935zm0 18.232c-1.579 0-3.122-.424-4.475-1.226l-.32-.19-3.327.873.889-3.245-.208-.33c-.878-1.398-1.343-3.023-1.343-4.708 0-4.786 3.893-8.679 8.679-8.679 4.787 0 8.68 3.893 8.68 8.679 0 4.786-3.893 8.68-8.68 8.68zm4.761-6.505c-.26-.13-1.543-.762-1.782-.849-.24-.087-.413-.13-.586.13-.173.26-.671.849-.822 1.022-.152.173-.304.195-.565.065-.26-.13-1.101-.406-2.098-1.296-.776-.693-1.3-1.55-1.452-1.81-.152-.26-.016-.401.114-.53.118-.117.26-.304.39-.456.13-.152.173-.26.26-.434.087-.173.044-.325-.022-.456-.065-.13-.586-1.41-.803-1.93-.212-.511-.444-.442-.607-.45l-.52-.01c-.173 0-.455.065-.693.304-.24.238-.91.889-.91 2.168 0 1.278.93 2.515 1.06 2.689.13.173 1.83 2.796 4.433 3.916.619.267 1.1.427 1.477.546.621.198 1.186.17 1.633.103.498-.076 1.543-.63 1.761-1.238.218-.607.218-1.127.152-1.237-.066-.11-.24-.173-.5-.304z"/></svg>
                        WhatsApp Booking
                    </a>
                    <a href="tel:+917172255101" class="btn-ghost" style="width: 100%; height: 56px; font-size: 0.8rem; text-decoration: none; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.15);">
                        <span class="material-symbols-outlined" style="margin-right: 8px; font-size: 20px;">call</span>
                        Call Hotel
                    </a>
                    <a href="mailto:stay@hotelsiddharthpremiere.com" class="btn-ghost" style="width: 100%; height: 56px; font-size: 0.8rem; text-decoration: none; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.15);">
                        <span class="material-symbols-outlined" style="margin-right: 8px; font-size: 20px;">mail</span>
                        Email Hotel
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=Hotel+Siddharth+Premiere+Chandrapur" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="width: 100%; height: 56px; font-size: 0.8rem; text-decoration: none; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.15);">
                        <span class="material-symbols-outlined" style="margin-right: 8px; font-size: 20px;">directions</span>
                        Get Directions
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('account-modal');
    const card = modal.querySelector('.inquiry-modal-card');
    const closeBtn = modal.querySelector('.account-modal-close');
    const bookRoomBtn = modal.querySelector('#modal-book-room');

    window.openAccountModal = () => {
        modal.classList.add('open');
        if (typeof lenis !== 'undefined') lenis.stop();

        // GSAP animate account modal entry
        gsap.killTweensOf(modal);
        gsap.fromTo(modal, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
        
        gsap.killTweensOf(card);
        gsap.fromTo(card,
            { scale: 0.95, opacity: 0 },
            { scale: 1.0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 }
        );
    };

    window.closeAccountModal = () => {
        gsap.killTweensOf(modal);
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('open');
            }
        });
        if (typeof lenis !== 'undefined') lenis.start();
    };

    closeBtn.addEventListener('click', window.closeAccountModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeAccountModal();
    });

    window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') window.closeAccountModal();
    });

    if (bookRoomBtn) {
        bookRoomBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.closeAccountModal();
            setTimeout(() => {
                if (window.openInquiryModal) window.openInquiryModal('');
            }, 300);
        });
    }
}

// -------------------------------------------------------------
// ROOMS AND SUITES GALLERY SLIDER CLASS
// -------------------------------------------------------------
class RoomSlider {
    constructor(container) {
        this.container = container;
        this.roomName = container.getAttribute('data-room');
        this.track = container.querySelector('.slider-track');
        this.slides = container.querySelectorAll('.slide-img');
        this.counterNum = container.querySelector('.current-slide-num');
        this.prevBtn = container.querySelector('.prev-arrow');
        this.nextBtn = container.querySelector('.next-arrow');
        
        const galleryCol = container.closest('.room-gallery-column');
        this.thumbnails = galleryCol ? galleryCol.querySelectorAll('.thumb-item') : [];
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayTimer = null;
        this.isHovered = false;
        
        this.init();
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prev();
            });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });
        }
        
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                this.goTo(index);
            });
        });
        
        this.container.addEventListener('click', () => {
            if (window.openLightbox) {
                window.openLightbox(this.roomName, this.currentIndex);
            }
        });
        
        // Pause autoplay on mouse enter, resume on mouse leave
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.pauseAutoplay();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.startAutoplay();
        });
        
        this.initTouch();
        
        // Initialize GSAP visual states for all slides
        this.slides.forEach((slide, idx) => {
            if (idx === this.currentIndex) {
                gsap.set(slide, { opacity: 1, scale: 1 });
            } else {
                gsap.set(slide, { opacity: 0, scale: 1.05 });
            }
        });
        
        // Start autoplay for all room slider categories
        this.startAutoplay();
    }
    
    goTo(index) {
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        if (index === this.currentIndex) return;
        
        const prevSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[index];
        
        if (this.thumbnails.length) {
            this.thumbnails[this.currentIndex].classList.remove('active');
        }
        
        // Animate out previous slide with GSAP
        if (prevSlide) {
            gsap.killTweensOf(prevSlide);
            gsap.to(prevSlide, {
                opacity: 0,
                scale: 1.05,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    prevSlide.classList.remove('active');
                }
            });
        }
        
        this.currentIndex = index;
        
        // Animate in next slide with GSAP
        if (nextSlide) {
            nextSlide.classList.add('active');
            gsap.killTweensOf(nextSlide);
            gsap.fromTo(nextSlide,
                { opacity: 0, scale: 1.05 },
                {
                    opacity: 1,
                    scale: 1.0,
                    duration: 0.8,
                    ease: 'power2.inOut'
                }
            );
        }
        
        if (this.thumbnails.length) {
            const activeThumb = this.thumbnails[this.currentIndex];
            activeThumb.classList.add('active');
            
            // Scroll thumbnail into view within its gallery container without scrolling the main page
            const container = activeThumb.parentElement;
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const thumbRect = activeThumb.getBoundingClientRect();
                
                const relativeLeft = thumbRect.left - containerRect.left + container.scrollLeft;
                const relativeRight = relativeLeft + thumbRect.width;
                
                if (relativeLeft < container.scrollLeft) {
                    container.scrollTo({
                        left: relativeLeft,
                        behavior: 'smooth'
                    });
                } else if (relativeRight > container.scrollLeft + containerRect.width) {
                    container.scrollTo({
                        left: relativeRight - containerRect.width,
                        behavior: 'smooth'
                    });
                }
            }
        }
        
        if (this.counterNum) {
            this.counterNum.innerText = this.currentIndex + 1;
        }
        
        this.resetAutoplay();
    }
    
    prev() {
        this.goTo(this.currentIndex - 1);
    }
    
    next() {
        this.goTo(this.currentIndex + 1);
    }
    
    initTouch() {
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    }
    
    startAutoplay() {
        if (this.isHovered) return;
        if (this.autoplayTimer) return;
        
        this.autoplayTimer = setInterval(() => {
            this.next();
        }, 3000);
    }
    
    pauseAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    resetAutoplay() {
        this.pauseAutoplay();
        this.startAutoplay();
    }
}

// -------------------------------------------------------------
// LIGHTBOX MODAL GALLERY SYSTEM
// -------------------------------------------------------------
const lightbox = {
    overlay: document.getElementById('lightbox-modal'),
    mainImg: document.getElementById('lightbox-main-img'),
    caption: document.getElementById('lightbox-caption-text'),
    currentText: document.getElementById('lightbox-current'),
    totalText: document.getElementById('lightbox-total'),
    prevBtn: document.querySelector('.lightbox-overlay .prev-btn'),
    nextBtn: document.querySelector('.lightbox-overlay .next-btn'),
    closeBtn: document.querySelector('.lightbox-overlay .lightbox-close'),
    thumbContainer: document.getElementById('lightbox-thumbnails-container'),
    
    activeRoom: '',
    activeIndex: 0,
    roomImages: {
        executive: [
            "Rooms/Executive/3edb9828063611e7999902755708f0b3.avif",
            "Rooms/Executive/40ec9bc6063611e7a8690a209fbd0127.avif",
            "Rooms/Executive/5b4fd3f06f9211e7b2050a4cef95d023.avif",
            "Rooms/Executive/62dd01886f9211e7944d025f77df004f.avif",
            "Rooms/Executive/71af56986f9211e7b2050a4cef95d023.avif",
            "Rooms/Executive/62833d106f9211e7b2050a4cef95d023.avif"
        ],
        suite: [
            "Rooms/Suite/201511060947429069-2119-e2e581606b2611e5a2bc5ee5da2daa2a (1).avif",
            "Rooms/Suite/5e126d5a6f9211e7b03f0a4cef95d023.avif",
            "Rooms/Suite/62833d106f9211e7b2050a4cef95d023 (1).avif",
            "Rooms/Suite/78ab1c026f9211e7b2050a4cef95d023.avif",
            "Rooms/Suite/810e45366f9211e7b2050a4cef95d023.avif",
            "Rooms/Suite/87a400a26f9211e7886e0a4cef95d023.avif"
        ],
        premier: [
            "Rooms/PREMIER SUITE/369228886f9211e7944d025f77df004f (1).avif",
            "Rooms/PREMIER SUITE/5961e54c6f9211e7886e0a4cef95d023.avif",
            "Rooms/PREMIER SUITE/6006d89e6f9211e7886e0a4cef95d023 (1).avif",
            "Rooms/PREMIER SUITE/62833d106f9211e7b2050a4cef95d023 (2).avif",
            "Rooms/PREMIER SUITE/6298891a063611e795ed02755708f0b3.avif",
            "Rooms/PREMIER SUITE/71a131766f9211e7886e0a4cef95d023.avif",
            "Rooms/PREMIER SUITE/8430b91a6f9211e7b03f0a4cef95d023.avif"
        ]
    },
    roomCaptions: {
        executive: [
            "Executive Room - Modern & Luxurious Comfort",
            "Executive Room - Ambient Lighting & Business Workspace",
            "Executive Room - Cozy Sitting Area",
            "Executive Room - Premium Furnishings",
            "Executive Room - Sleek & Modern Details",
            "Executive Room - Elegant Bathroom Details"
        ],
        suite: [
            "Suite Room - Elegant Spacious Layout",
            "Suite Room - Royal Bedding & Premium Decor",
            "Suite Room - Refined Bathroom Elements",
            "Suite Room - Interactive Lounge Space",
            "Suite Room - Cinematic Lighting & Ambiance",
            "Suite Room - Elite Furnishings Detail"
        ],
        premier: [
            "Premier Suite - Sovereign Masterpiece Lounge",
            "Premier Suite - Premium Bedding & Exclusivity",
            "Premier Suite - Double Sink & Luxurious Bathroom",
            "Premier Suite - Bespoke Seating & Workspace",
            "Premier Suite - Fine Art & Gold Lining Accents",
            "Premier Suite - High-Definition Entertainment Space",
            "Premier Suite - Jacuzzi & Elite Personal Care Detail"
        ]
    },
    
    init() {
        if (!this.overlay) return;
        
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prev();
        });
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
        });
        
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        
        window.addEventListener('keydown', (e) => {
            if (!this.overlay.classList.contains('open')) return;
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
            if (e.key === 'Escape') this.close();
        });
    },
    
    open(room, index = 0) {
        this.activeRoom = room;
        this.activeIndex = index;
        const images = this.roomImages[room];
        
        this.thumbContainer.innerHTML = '';
        images.forEach((imgSrc, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `thumb-item ${idx === index ? 'active' : ''}`;
            thumb.setAttribute('data-index', idx);
            thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${idx + 1}">`;
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                this.goTo(idx);
            });
            this.thumbContainer.appendChild(thumb);
        });
        
        this.updateView();
        
        this.overlay.classList.add('open');
        if (typeof lenis !== 'undefined') lenis.stop();
        
        // GSAP animate lightbox entry
        gsap.killTweensOf(this.overlay);
        gsap.fromTo(this.overlay, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
        
        gsap.killTweensOf(this.mainImg);
        gsap.fromTo(this.mainImg,
            { scale: 0.95, opacity: 0 },
            { scale: 1.0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 }
        );
    },
    
    close() {
        gsap.killTweensOf(this.overlay);
        gsap.to(this.overlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                this.overlay.classList.remove('open');
            }
        });
        if (typeof lenis !== 'undefined') lenis.start();
    },
    
    goTo(index) {
        const images = this.roomImages[this.activeRoom];
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        
        if (index === this.activeIndex) return;
        
        const thumbs = this.thumbContainer.querySelectorAll('.thumb-item');
        if (thumbs.length) {
            thumbs[this.activeIndex].classList.remove('active');
        }
        
        this.activeIndex = index;
        
        if (thumbs.length) {
            const activeThumb = thumbs[this.activeIndex];
            activeThumb.classList.add('active');
            
            // Smoothly scroll the thumbnail in the lightbox wrapper to keep it visible
            const wrap = activeThumb.closest('.lightbox-thumbnails-wrap');
            if (wrap) {
                const wrapRect = wrap.getBoundingClientRect();
                const thumbRect = activeThumb.getBoundingClientRect();
                
                const relativeLeft = thumbRect.left - wrapRect.left + wrap.scrollLeft;
                const relativeRight = relativeLeft + thumbRect.width;
                
                if (relativeLeft < wrap.scrollLeft) {
                    wrap.scrollTo({
                        left: relativeLeft,
                        behavior: 'smooth'
                    });
                } else if (relativeRight > wrap.scrollLeft + wrapRect.width) {
                    wrap.scrollTo({
                        left: relativeRight - wrapRect.width,
                        behavior: 'smooth'
                    });
                }
            }
        }
        
        // GSAP transition: fade out -> change src -> fade in
        gsap.killTweensOf(this.mainImg);
        gsap.to(this.mainImg, {
            opacity: 0,
            scale: 0.98,
            duration: 0.15,
            ease: 'power2.in',
            onComplete: () => {
                this.updateView();
                gsap.fromTo(this.mainImg,
                    { opacity: 0, scale: 0.98 },
                    {
                        opacity: 1,
                        scale: 1.0,
                        duration: 0.3,
                        ease: 'power2.out'
                    }
                );
            }
        });
    },
    
    prev() {
        this.goTo(this.activeIndex - 1);
    },
    
    next() {
        this.goTo(this.activeIndex + 1);
    },
    
    updateView() {
        const images = this.roomImages[this.activeRoom];
        const captions = this.roomCaptions[this.activeRoom];
        
        this.mainImg.setAttribute('src', images[this.activeIndex]);
        this.caption.innerText = captions[this.activeIndex] || "Hotel Siddharth Premiere Room View";
        this.currentText.innerText = this.activeIndex + 1;
        this.totalText.innerText = images.length;
    }
};

window.openLightbox = (room, index) => {
    lightbox.open(room, index);
};

// Initialize Modal and Hook Buttons
function initAll() {
    createInquiryModal();
    createAccountModal();
    lightbox.init();
    
    // Bind account trigger
    const accBtn = document.getElementById('account-btn');
    if (accBtn) {
        accBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.openAccountModal) window.openAccountModal();
        });
    }
    
    // Instantiate all sliders
    document.querySelectorAll('.room-main-slider').forEach(sliderEl => {
        new RoomSlider(sliderEl);
    });
    
    // Bind all inquiry triggers (Header, CTA, Footer)
    document.querySelectorAll('.inquire-trigger, #inquire-btn').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.openInquiryModal) window.openInquiryModal('');
        });
    });
    
    // Bind room specific booking triggers
    document.querySelectorAll('.book-now-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const roomType = trigger.getAttribute('data-room');
            if (window.openInquiryModal) window.openInquiryModal(roomType);
        });
    });
    
    // Room Details Data System
    const roomDetailsData = {
        executive: {
            bookingName: "Executive Room",
            label: "Corporate Luxury",
            title: "Executive Room",
            description: "Our Executive Room offers a perfect blend of elegance and functionality, tailored specifically for the modern business traveler and couples seeking a premium retreat. The room features a spacious, ergonomically designed work desk, high-speed fiber internet, and luxury bedding. Relax in a sophisticated, temperature-controlled environment with ambient lighting controls, high-end entertainment, and prompt round-the-clock room service.",
            capacity: "2 Adults",
            beds: "King Size Bed",
            size: "320 Sq. Ft.",
            luxury: "Premium Comfort",
            features: `
                <li><span class="material-symbols-outlined feature-icon">king_bed</span>King Size Bed</li>
                <li><span class="material-symbols-outlined feature-icon">wifi</span>High Speed WiFi</li>
                <li><span class="material-symbols-outlined feature-icon">ac_unit</span>Air Conditioning</li>
                <li><span class="material-symbols-outlined feature-icon">tv</span>Smart TV</li>
                <li><span class="material-symbols-outlined feature-icon">work</span>Work Desk</li>
                <li><span class="material-symbols-outlined feature-icon">room_service</span>24/7 Room Service</li>
                <li><span class="material-symbols-outlined feature-icon">bathroom</span>Premium Toiletries</li>
            `
        },
        suite: {
            bookingName: "Suite Room",
            label: "Refined Elegance",
            title: "Suite Room",
            description: "The Suite Room at Hotel Siddharth Premiere offers a spacious and elevated stay experience, featuring separate lounge seating and premium boutique furniture. Perfect for small families or business executives who appreciate extra comfort and space. Indulge in high-end in-room amenities, deep marble bathtubs, customizable comfort settings, and panoramic window views of the city. A truly refined sanctuary.",
            capacity: "3 Adults (or 2+2 Kids)",
            beds: "King Size Bed + Lounge Couch",
            size: "480 Sq. Ft.",
            luxury: "Elite Luxury",
            features: `
                <li><span class="material-symbols-outlined feature-icon">space_dashboard</span>Spacious Layout</li>
                <li><span class="material-symbols-outlined feature-icon">chair</span>Premium Furnishings</li>
                <li><span class="material-symbols-outlined feature-icon">wifi</span>High Speed WiFi</li>
                <li><span class="material-symbols-outlined feature-icon">tv</span>Smart TV</li>
                <li><span class="material-symbols-outlined feature-icon">ac_unit</span>Air Conditioning</li>
                <li><span class="material-symbols-outlined feature-icon">bathtub</span>Luxury Marble Bath</li>
                <li><span class="material-symbols-outlined feature-icon">room_service</span>24/7 Room Service</li>
                <li><span class="material-symbols-outlined feature-icon">coffee_maker</span>Coffee & Tea Maker</li>
            `
        },
        premier: {
            bookingName: "Premier Suite",
            label: "Signature Luxury Suite",
            title: "Premier Suite",
            description: "Experience the zenith of hospitality in our crown jewel, the Premier Suite. Designed to emulate the luxury of heritage royal chambers, this suite boasts a separate lavish living room, a bespoke dining table, a personal bar setup, and dedicated butler service on request. Unwind in a private jacuzzi or enjoy state-of-the-art multi-room entertainment. It is the definitive choice for royalty, VVIPs, and guests celebrating milestones.",
            capacity: "Up to 4 Adults",
            beds: "Royal King Bed + Living Room",
            size: "650 Sq. Ft.",
            luxury: "Sovereign Ultra-Luxury",
            features: `
                <li><span class="material-symbols-outlined feature-icon">diamond</span>Spacious Luxury Suite</li>
                <li><span class="material-symbols-outlined feature-icon">design_services</span>Elegant Living Area</li>
                <li><span class="material-symbols-outlined feature-icon">king_bed</span>King Size Bed</li>
                <li><span class="material-symbols-outlined feature-icon">wifi</span>High-Speed WiFi</li>
                <li><span class="material-symbols-outlined feature-icon">tv</span>Smart TV</li>
                <li><span class="material-symbols-outlined feature-icon">bathroom</span>Bespoke Jacuzzi</li>
                <li><span class="material-symbols-outlined feature-icon">ac_unit</span>Air Conditioning</li>
                <li><span class="material-symbols-outlined feature-icon">room_service</span>Personalized Service</li>
                <li><span class="material-symbols-outlined feature-icon">wine_bar</span>Bar Cabinet</li>
            `
        }
    };

    // Room Details Modal Controller
    const detailsModal = document.getElementById('room-details-modal');
    let detailsBookBtn = null;
    let detailsSelectedRoomBookingName = '';

    if (detailsModal) {
        const detailsCloseBtn = detailsModal.querySelector('.details-modal-close');
        const modalLabel = detailsModal.querySelector('.modal-room-label');
        const modalTitle = detailsModal.querySelector('.modal-room-title');
        const modalDesc = detailsModal.querySelector('.modal-room-description');
        const modalCapacity = detailsModal.querySelector('.modal-room-capacity');
        const modalBeds = detailsModal.querySelector('.modal-room-beds');
        const modalSize = detailsModal.querySelector('.modal-room-size');
        const modalLuxury = detailsModal.querySelector('.modal-room-luxury');
        const modalFeaturesList = detailsModal.querySelector('.modal-room-features-list');
        detailsBookBtn = detailsModal.querySelector('.modal-book-btn');

        const openDetailsModal = (roomName) => {
            const data = roomDetailsData[roomName];
            if (!data) return;

            detailsSelectedRoomBookingName = data.bookingName;

            if (modalLabel) modalLabel.innerText = data.label;
            if (modalTitle) modalTitle.innerText = data.title;
            if (modalDesc) modalDesc.innerText = data.description;
            if (modalCapacity) modalCapacity.innerText = data.capacity;
            if (modalBeds) modalBeds.innerText = data.beds;
            if (modalSize) modalSize.innerText = data.size;
            if (modalLuxury) modalLuxury.innerText = data.luxury;
            
            if (modalFeaturesList) {
                modalFeaturesList.innerHTML = data.features;
            }

            detailsModal.classList.add('open');
            if (typeof lenis !== 'undefined') lenis.stop();
        };

        const closeDetailsModal = () => {
            detailsModal.classList.remove('open');
            if (typeof lenis !== 'undefined') lenis.start();
        };

        // Bind triggers
        document.querySelectorAll('.view-details-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const roomName = trigger.getAttribute('data-room');
                openDetailsModal(roomName);
            });
        });

        // Close events
        if (detailsCloseBtn) {
            detailsCloseBtn.addEventListener('click', closeDetailsModal);
        }
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) closeDetailsModal();
        });

        window.addEventListener('keydown', (e) => {
            if (detailsModal.classList.contains('open') && e.key === 'Escape') {
                closeDetailsModal();
            }
        });

        // Book now within details modal
        if (detailsBookBtn) {
            detailsBookBtn.addEventListener('click', () => {
                closeDetailsModal();
                if (window.openInquiryModal) {
                    window.openInquiryModal(detailsSelectedRoomBookingName);
                }
            });
        }
    }

    // Banquets Event Switcher Logic
    const eventItems = document.querySelectorAll('.event-item');
    const eventHeroImg = document.getElementById('events-hero-image');
    
    if (eventItems.length && eventHeroImg) {
        eventItems.forEach(item => {
            item.addEventListener('click', () => {
                eventItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const newImgSrc = item.getAttribute('data-image');
                gsap.to(eventHeroImg, {
                    opacity: 0,
                    duration: 0.25,
                    onComplete: () => {
                        eventHeroImg.setAttribute('src', newImgSrc);
                        gsap.to(eventHeroImg, { opacity: 1, duration: 0.35 });
                    }
                });
            });
        });
    }

    // Scroll trigger reveals for sections
    gsap.fromTo('#dining-info-wrap',
        { opacity: 0, y: 60 },
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#dining',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('#location-info-wrap',
        { opacity: 0, y: 60 },
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#location',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // GSAP ScrollTrigger reveals for Rooms rows and elements
    gsap.utils.toArray('.room-showcase-row').forEach((row) => {
        gsap.fromTo(row.querySelector('.room-gallery-column'), 
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: row,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        gsap.fromTo(row.querySelector('.room-details-column'), 
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: 'power2.out',
                delay: 0.1,
                scrollTrigger: {
                    trigger: row,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Reveal comparison grid
    gsap.fromTo('.rooms-comparison-section',
        { opacity: 0, y: 60 },
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.rooms-comparison-section',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // FAQ Accordion click toggle logic
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const isActive = item.classList.contains('active');
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
