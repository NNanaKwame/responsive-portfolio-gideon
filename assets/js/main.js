document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initScrollAnimations();
    initThemeToggle();
    initQualificationTabs();
    initSkillsAccordion();
    initServiceModals();
    initPortfolioSwiper();
    initScrollHeader();
    initScrollActiveLink();
    initScrollUp();
    initContactForm();
    initFooterYear();
    initTypewriter();
    initParticles();
});

/*==================== MOBILE NAV (open/close, matches old site) ====================*/
function initMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
            navToggle.setAttribute('aria-expanded', 'true');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    }

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/*==================== SCROLL-TRIGGERED FADE-IN ====================*/
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optimization: stop observing once it has faded in
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before element is fully in view
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/*==================== DARK / LIGHT THEME ====================*/
function initThemeToggle() {
    const themeButton = document.getElementById('theme-button');
    if (!themeButton) return;
    const iconTheme = 'uil-sun';

    const selectedTheme = localStorage.getItem('selected-theme');
    const selectedIcon = localStorage.getItem('selected-icon');

    const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun';

    if (selectedTheme) {
        document.body.setAttribute('data-theme', selectedTheme === 'light' ? 'light' : 'dark');
        themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme);
    }

    themeButton.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.setAttribute('data-theme', newTheme);
        themeButton.classList.toggle(iconTheme);

        localStorage.setItem('selected-theme', newTheme);
        localStorage.setItem('selected-icon', getCurrentIcon());
    });
}

/*==================== QUALIFICATION TABS ====================*/
function initQualificationTabs() {
    const tabs = document.querySelectorAll('.qualification__button');
    const contents = document.querySelectorAll('.qualification__content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.target);

            contents.forEach(c => c.classList.remove('qualification__active'));
            target.classList.add('qualification__active');

            tabs.forEach(t => t.classList.remove('qualification__active'));
            tab.classList.add('qualification__active');
        });
    });
}

/*==================== SKILLS ACCORDION ====================*/
function initSkillsAccordion() {
    const items = document.querySelectorAll('.skills__content');

    items.forEach(item => {
        const header = item.querySelector('.skills__header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('skills__open');

            items.forEach(i => {
                i.classList.remove('skills__open');
                i.classList.add('skills__close');
            });

            if (!isOpen) {
                item.classList.remove('skills__close');
                item.classList.add('skills__open');
            }
        });
    });
}

/*==================== SERVICES MODAL ====================*/
function initServiceModals() {
    const buttons = document.querySelectorAll('.service__button');
    const modals = document.querySelectorAll('.service__modal');
    const closers = document.querySelectorAll('.service__modal-close');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = document.querySelector(`.service__modal[data-modal-view="${btn.dataset.modal}"]`);
            if (modal) modal.classList.add('active-modal');
        });
    });

    closers.forEach(closer => {
        closer.addEventListener('click', () => {
            closer.closest('.service__modal').classList.remove('active-modal');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active-modal');
        });
    });
}

/*==================== SHOWCASE SWIPER ====================*/
function initPortfolioSwiper() {
    if (typeof Swiper === 'undefined') return;

    const showcaseSwiper = new Swiper('.antigravity-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        grabCursor: false,
        loop: true, // <-- THE FIX: Makes the slider infinitely loop
        navigation: {
            nextEl: '.ag-btn-next',
            prevEl: '.ag-btn-prev',
        },
        on: {
            slideChange: function () {
                // <-- THE FIX: Use realIndex instead of activeIndex for looping sliders
                const activeIndex = this.realIndex;
                const copyBlocks = document.querySelectorAll('.ag-copy');

                // Hide all copy blocks
                copyBlocks.forEach(block => block.classList.remove('is-active'));

                // Show the copy block that matches the current slide index
                const activeBlock = document.querySelector(`.ag-copy[data-index="${activeIndex}"]`);
                if (activeBlock) {
                    activeBlock.classList.add('is-active');
                }
            }
        }
    });

    // Custom play cursor logic
    const slideWrappers = document.querySelectorAll('.ag-slide-wrapper');
    slideWrappers.forEach(wrapper => {
        const cursor = wrapper.querySelector('.ag-play-cursor');

        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
        });

        wrapper.addEventListener('mouseleave', () => {
            cursor.style.left = '50%';
            cursor.style.top = '50%';
        });
    });
}

/*==================== HEADER BACKGROUND ON SCROLL ====================*/
function initScrollHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY >= 80) header.classList.add('scroll-header');
        else header.classList.remove('scroll-header');
    });
}

/*==================== ACTIVE NAV LINK ON SCROLL ====================*/
function initScrollActiveLink() {
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
            if (!link) return;

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    });
}

/*==================== SCROLL-UP BUTTON ====================*/
function initScrollUp() {
    const scrollUpBtn = document.getElementById('scroll-up');
    if (!scrollUpBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY >= 400) scrollUpBtn.classList.add('show-scroll');
        else scrollUpBtn.classList.remove('show-scroll');
    });
}

/*==================== FOOTER YEAR ====================*/
function initFooterYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
}

/*==================== CONTACT FORM (EmailJS) ====================*/
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const project = formData.get('project');
        const message = formData.get('message');

        if (!name || !email || !project || !message) {
            showAlert('Please fill in all fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }

        sendEmailViaEmailJS(contactForm, name, email, project, message);
    });
}

function sendEmailViaEmailJS(contactForm, name, email, project, message) {
    if (typeof emailjs === 'undefined') {
        showAlert('Email service unavailable right now — please email directly.', 'error');
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.innerHTML = 'Sending...';
    submitButton.disabled = true;

    const templateParams = { from_name: name, from_email: email, project: project, message: message };

    // NOTE: replace these with your own EmailJS service ID, template ID, and public key
    emailjs.send(
        'service_ueicxic',
        'template_1o0l6bw',
        templateParams,
        'Dks6rHZgK9qWNU7fF'
    ).then(() => {
        sendAutoReply(name, email);
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        showAlert('Your message has been sent successfully!', 'success');
        contactForm.reset();
    }).catch((error) => {
        console.error('EmailJS Error:', error);
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        showAlert('Oops! Something went wrong. Please try again later.', 'error');
    });
}

function sendAutoReply(name, email) {
    if (typeof emailjs === 'undefined') return;

    emailjs.send(
        'service_ueicxic',
        'template_onks9is',
        { to_name: name, to_email: email },
        'Dks6rHZgK9qWNU7fF'
    ).catch((err) => console.error('Auto-reply failed:', err));
}

/*==================== ALERT SYSTEM ====================*/
function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close" aria-label="Dismiss">&times;</button>
        </div>
    `;

    if (!document.querySelector('#alert-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'alert-styles';
        styleSheet.textContent = `
            .custom-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 380px;
                padding: 1rem 1.25rem;
                border-radius: 0.75rem;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
                animation: slideInRight 0.3s ease-out;
                font-family: 'Inter', sans-serif;
            }
            .alert-success { background: rgba(0, 200, 120, 0.15); color: #4ade80; }
            .alert-error { background: rgba(255, 60, 60, 0.15); color: #f87171; }
            .alert-info { background: rgba(0, 229, 255, 0.15); color: #67e8f9; }
            .alert-content { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; }
            .alert-close { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: inherit; line-height: 1; }
            @keyframes slideInRight { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @media (max-width: 480px) { .custom-alert { left: 20px; right: 20px; max-width: none; } }
        `;
        document.head.appendChild(styleSheet);
    }

    alert.querySelector('.alert-close').addEventListener('click', () => alert.remove());
    document.body.appendChild(alert);

    setTimeout(() => { if (alert.parentElement) alert.remove(); }, 5000);
}

/*==================== TYPEWRITER EFFECT ====================*/
function initTypewriter() {
    const textElement = document.querySelector('.about__text');
    if (!textElement) return;

    // Store the original text and clear the element
    const originalText = textElement.textContent.trim();
    textElement.textContent = '';

    let i = 0;
    let isTyping = false;

    // Use Intersection Observer to trigger when visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isTyping) {
            isTyping = true;
            textElement.classList.add('typewriter-active');
            type();
        }
    }, { threshold: 0.5 }); // Triggers when 50% of the section is visible

    observer.observe(textElement);

    function type() {
        if (i < originalText.length) {
            textElement.textContent += originalText.charAt(i);
            i++;
            // Randomize typing speed slightly for a human feel (15ms - 45ms)
            setTimeout(type, Math.random() * 30 + 15);
        } else {
            // Remove cursor after 2 seconds when typing is done
            setTimeout(() => {
                textElement.classList.remove('typewriter-active');
            }, 2000);
        }
    }
}

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.alpha = 1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.01;
        }
        draw() {
            ctx.fillStyle = `rgba(124, 77, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    window.addEventListener('mousemove', (e) => {
        particles.push(new Particle(e.clientX, e.clientY));
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.alpha > 0);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}