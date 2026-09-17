/* =========================================================================
   Gideon Nyarko — portfolio behaviour
   Performance-optimised build.

   What changed vs. the previous version (see notes at the bottom of file):
   - Three unthrottled scroll listeners -> one passive, rAF-throttled handler
   - Active-nav-link no longer reads offsetTop/offsetHeight on every scroll
     event (this was forcing a synchronous layout on every frame)
   - Particle canvas is skipped entirely on touch/low-power devices, is
     DPR-capped, pauses when the tab is hidden, and ignores the height-only
     resize that fires constantly when a mobile URL bar shows/hides
   - Typewriter batches characters into one rAF tick instead of one
     setTimeout + layout per character
   - Pointer-tracking cursor only binds on devices with a fine pointer
   ========================================================================= */

(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initScrollAnimations();
        initThemeToggle();
        initQualificationTabs();
        initSkillsAccordion();
        initServiceModals();
        initPortfolioSwiper();
        initScrollEffects();       // replaces initScrollHeader + initScrollActiveLink + initScrollUp
        initContactForm();
        initFooterYear();
        initTypewriter();
        initParticles();
    });

    /*==================== MOBILE NAV ====================*/
    function initMobileNav() {
        var navMenu = document.getElementById('nav-menu');
        var navToggle = document.getElementById('nav-toggle');
        var navClose = document.getElementById('nav-close');
        if (!navMenu) return;

        function open() {
            navMenu.classList.add('show-menu');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            navMenu.classList.remove('show-menu');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        if (navToggle) navToggle.addEventListener('click', open);
        if (navClose) navClose.addEventListener('click', close);

        navMenu.addEventListener('click', function (e) {
            if (e.target.closest('.nav__link')) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) close();
        });
    }

    /*==================== SCROLL-TRIGGERED FADE-IN ====================*/
    function initScrollAnimations() {
        var targets = document.querySelectorAll('.fade-in');
        if (!targets.length) return;

        // No observer work at all if the visitor asked for reduced motion.
        if (prefersReducedMotion.matches) {
            for (var i = 0; i < targets.length; i++) targets[i].classList.add('visible');
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('visible');
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        for (var j = 0; j < targets.length; j++) observer.observe(targets[j]);
    }

    /*==================== DARK / LIGHT THEME ====================*/
    function initThemeToggle() {
        var themeButton = document.getElementById('theme-button');
        if (!themeButton) return;
        var iconTheme = 'uil-sun';

        var selectedTheme = localStorage.getItem('selected-theme');
        var selectedIcon = localStorage.getItem('selected-icon');

        function currentIcon() {
            return themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun';
        }

        if (selectedTheme) {
            document.body.setAttribute('data-theme', selectedTheme === 'light' ? 'light' : 'dark');
            themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme);
        }

        themeButton.addEventListener('click', function () {
            var next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', next);
            themeButton.classList.toggle(iconTheme);
            localStorage.setItem('selected-theme', next);
            localStorage.setItem('selected-icon', currentIcon());
        });
    }

    /*==================== QUALIFICATION TABS ====================*/
    function initQualificationTabs() {
        var tabs = document.querySelectorAll('.qualification__button');
        var contents = document.querySelectorAll('.qualification__content');
        if (!tabs.length) return;

        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function () {
                var target = document.querySelector(this.dataset.target);
                if (!target) return;

                for (var c = 0; c < contents.length; c++) {
                    contents[c].classList.remove('qualification__active');
                }
                target.classList.add('qualification__active');

                for (var t = 0; t < tabs.length; t++) {
                    tabs[t].classList.remove('qualification__active');
                }
                this.classList.add('qualification__active');
            });
        }
    }

    /*==================== SKILLS ACCORDION ====================*/
    function initSkillsAccordion() {
        var items = document.querySelectorAll('.skills__content');
        if (!items.length) return;

        for (var i = 0; i < items.length; i++) {
            (function (item) {
                var header = item.querySelector('.skills__header');
                if (!header) return;

                header.addEventListener('click', function () {
                    var wasOpen = item.classList.contains('skills__open');

                    for (var k = 0; k < items.length; k++) {
                        items[k].classList.remove('skills__open');
                        items[k].classList.add('skills__close');
                    }

                    if (!wasOpen) {
                        item.classList.remove('skills__close');
                        item.classList.add('skills__open');
                    }
                });
            })(items[i]);
        }
    }

    /*==================== SERVICES MODAL ====================*/
    function initServiceModals() {
        var buttons = document.querySelectorAll('.service__button');
        var modals = document.querySelectorAll('.service__modal');
        if (!buttons.length) return;

        function closeAll() {
            for (var m = 0; m < modals.length; m++) {
                modals[m].classList.remove('active-modal');
            }
            document.body.style.overflow = '';
        }

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function () {
                var modal = document.querySelector(
                    '.service__modal[data-modal-view="' + this.dataset.modal + '"]'
                );
                if (!modal) return;
                modal.classList.add('active-modal');
                document.body.style.overflow = 'hidden';
            });
        }

        for (var j = 0; j < modals.length; j++) {
            modals[j].addEventListener('click', function (e) {
                if (e.target === this || e.target.closest('.service__modal-close')) closeAll();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeAll();
        });
    }

    /*==================== SHOWCASE SWIPER ====================*/
    function initPortfolioSwiper() {
        if (typeof Swiper === 'undefined') return;
        var el = document.querySelector('.antigravity-swiper');
        if (!el) return;

        new Swiper(el, {
            slidesPerView: 'auto',
            spaceBetween: 24,
            grabCursor: false,
            loop: true,
            watchSlidesProgress: true,
            navigation: { nextEl: '.ag-btn-next', prevEl: '.ag-btn-prev' },
            on: {
                slideChange: function () {
                    var index = this.realIndex;
                    var blocks = document.querySelectorAll('.ag-copy');
                    for (var i = 0; i < blocks.length; i++) {
                        blocks[i].classList.remove('is-active');
                    }
                    var active = document.querySelector('.ag-copy[data-index="' + index + '"]');
                    if (active) active.classList.add('is-active');
                }
            }
        });

        // The pointer-following "View Project" cursor is meaningless on touch
        // devices and the listeners are pure overhead there, so skip binding.
        if (!hasFinePointer) return;

        var wrappers = document.querySelectorAll('.ag-slide-wrapper');
        for (var w = 0; w < wrappers.length; w++) {
            (function (wrapper) {
                var cursor = wrapper.querySelector('.ag-play-cursor');
                if (!cursor) return;

                var pendingX = 0, pendingY = 0, queued = false;

                wrapper.addEventListener('mousemove', function (e) {
                    var rect = wrapper.getBoundingClientRect();
                    pendingX = e.clientX - rect.left;
                    pendingY = e.clientY - rect.top;

                    // left/top rather than transform: the existing CSS uses
                    // transform for the hover scale reveal, so writing to it
                    // here would cancel that animation.
                    if (queued) return;
                    queued = true;
                    requestAnimationFrame(function () {
                        queued = false;
                        cursor.style.left = pendingX + 'px';
                        cursor.style.top = pendingY + 'px';
                    });
                }, { passive: true });

                wrapper.addEventListener('mouseleave', function () {
                    cursor.style.left = '';
                    cursor.style.top = '';
                });
            })(wrappers[w]);
        }
    }

    /*==================== SCROLL EFFECTS (single handler) ====================*/
    function initScrollEffects() {
        var header = document.getElementById('header');
        var scrollUpBtn = document.getElementById('scroll-up');
        var ticking = false;

        function onFrame() {
            ticking = false;
            var y = window.scrollY;
            if (header) header.classList.toggle('scroll-header', y >= 80);
            if (scrollUpBtn) scrollUpBtn.classList.toggle('show-scroll', y >= 400);
        }

        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(onFrame);
        }, { passive: true });

        onFrame();
        initActiveLinkObserver();
    }

    // Replaces the old per-scroll-event offsetTop/offsetHeight loop. Reading
    // those properties mid-scroll forces the browser to recalculate layout
    // synchronously, which is the main cause of scroll jank on phones.
    function initActiveLinkObserver() {
        var sections = document.querySelectorAll('section[id]');
        if (!sections.length || !('IntersectionObserver' in window)) return;

        var links = {};
        for (var i = 0; i < sections.length; i++) {
            var id = sections[i].getAttribute('id');
            var link = document.querySelector('.nav__menu a[href="#' + id + '"]');
            if (link) links[id] = link;
        }

        var visible = new Set();

        var observer = new IntersectionObserver(function (entries) {
            for (var e = 0; e < entries.length; e++) {
                var id = entries[e].target.getAttribute('id');
                if (entries[e].isIntersecting) visible.add(id);
                else visible.delete(id);
            }

            for (var key in links) {
                links[key].classList.remove('active-link');
            }

            // Pick whichever visible section comes first in document order.
            for (var s = 0; s < sections.length; s++) {
                var sid = sections[s].getAttribute('id');
                if (visible.has(sid) && links[sid]) {
                    links[sid].classList.add('active-link');
                    break;
                }
            }
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

        for (var j = 0; j < sections.length; j++) observer.observe(sections[j]);
    }

    /*==================== FOOTER YEAR ====================*/
    function initFooterYear() {
        var year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
    }

    /*==================== CONTACT FORM (EmailJS) ====================*/
    function initContactForm() {
        var contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var data = new FormData(contactForm);
            var name = (data.get('name') || '').trim();
            var email = (data.get('email') || '').trim();
            var project = (data.get('project') || '').trim();
            var message = (data.get('message') || '').trim();

            if (!name || !email || !project || !message) {
                showAlert('Please fill in all fields', 'error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

        var submitButton = contactForm.querySelector('button[type="submit"]');
        var originalText = submitButton.innerHTML;

        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;

        function restore() {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }

        emailjs.send(
            'service_ueicxic',
            'template_1o0l6bw',
            { from_name: name, from_email: email, project: project, message: message },
            'Dks6rHZgK9qWNU7fF'
        ).then(function () {
            sendAutoReply(name, email);
            restore();
            showAlert('Your message has been sent successfully!', 'success');
            contactForm.reset();
        }).catch(function (error) {
            console.error('EmailJS Error:', error);
            restore();
            showAlert('Something went wrong sending that. Try again, or email nkgnyarko@gmail.com directly.', 'error');
        });
    }

    function sendAutoReply(name, email) {
        if (typeof emailjs === 'undefined') return;
        emailjs.send(
            'service_ueicxic',
            'template_onks9is',
            { to_name: name, to_email: email },
            'Dks6rHZgK9qWNU7fF'
        ).catch(function (err) { console.error('Auto-reply failed:', err); });
    }

    /*==================== ALERT SYSTEM ====================*/
    // Styles moved to modern.css (see performance-patch.css) so this no longer
    // injects a stylesheet at runtime, which invalidated all existing styles.
    function showAlert(message, type) {
        var existing = document.querySelector('.custom-alert');
        if (existing) existing.remove();

        var alert = document.createElement('div');
        alert.className = 'custom-alert alert-' + (type || 'info');
        alert.setAttribute('role', type === 'error' ? 'alert' : 'status');

        var content = document.createElement('div');
        content.className = 'alert-content';

        var text = document.createElement('span');
        text.className = 'alert-message';
        text.textContent = message; // textContent, not innerHTML

        var close = document.createElement('button');
        close.className = 'alert-close';
        close.type = 'button';
        close.setAttribute('aria-label', 'Dismiss');
        close.textContent = '\u00D7';
        close.addEventListener('click', function () { alert.remove(); });

        content.appendChild(text);
        content.appendChild(close);
        alert.appendChild(content);
        document.body.appendChild(alert);

        setTimeout(function () {
            if (alert.parentElement) alert.remove();
        }, 5000);
    }

    /*==================== TYPEWRITER ====================*/
    function initTypewriter() {
        var el = document.querySelector('.about__text');
        if (!el) return;

        var fullText = el.textContent.trim();

        // Reduced motion (or no observer support): just show the text.
        if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
            el.textContent = fullText;
            return;
        }

        el.textContent = '';
        var started = false;

        var observer = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting || started) return;
            started = true;
            observer.disconnect();
            el.classList.add('typewriter-active');
            run();
        }, { threshold: 0.5 });

        observer.observe(el);

        // One rAF tick per frame writing a small chunk, rather than one
        // setTimeout + one layout per character.
        function run() {
            var index = 0;
            var charsPerFrame = 2;
            var last = 0;

            function step(now) {
                if (now - last >= 24) {
                    last = now;
                    index = Math.min(index + charsPerFrame, fullText.length);
                    el.textContent = fullText.slice(0, index);
                }
                if (index < fullText.length) {
                    requestAnimationFrame(step);
                } else {
                    setTimeout(function () {
                        el.classList.remove('typewriter-active');
                    }, 2000);
                }
            }

            requestAnimationFrame(step);
        }
    }

    /*==================== PARTICLE BACKGROUND ====================*/
    function initParticles() {
        var canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        // Bail out on anything that can't afford a permanent full-screen
        // animation loop: reduced motion, touch devices, low core counts,
        // low memory, or a data-saver connection.
        var connection = navigator.connection || {};
        var tooWeak =
            prefersReducedMotion.matches ||
            !hasFinePointer ||
            window.innerWidth < 900 ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
            (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
            connection.saveData === true ||
            /2g|slow-2g|3g/.test(connection.effectiveType || '');

        if (tooWeak) {
            canvas.remove();
            return;
        }

        var ctx = canvas.getContext('2d', { alpha: true });
        var dpr = Math.min(window.devicePixelRatio || 1, 1.5); // cap: full DPR on a 3x screen quadruples fill cost
        var particles = [];
        var mouse = { x: -9999, y: -9999, radius: 100 };
        var rafId = null;
        var lastWidth = window.innerWidth;

        function build() {
            var w = window.innerWidth;
            var h = window.innerHeight;

            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            var count = Math.min(Math.floor(w / 14), 110);
            particles = [];
            for (var i = 0; i < count; i++) {
                var x = Math.random() * w;
                var y = Math.random() * h;
                particles.push({
                    x: x, y: y, baseX: x, baseY: y,
                    size: Math.random() * 1.5 + 0.5
                });
            }
        }

        // Mobile browsers fire resize every time the URL bar collapses. Only
        // rebuild when the width actually changed.
        var resizeTimer;
        window.addEventListener('resize', function () {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(build, 200);
        }, { passive: true });

        window.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        function frame() {
            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            ctx.fillStyle = 'rgba(124, 77, 255, 0.4)';
            ctx.beginPath(); // one path for every particle, one fill call

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                var dx = mouse.x - p.x;
                var dy = mouse.y - p.y;
                var distSq = dx * dx + dy * dy;

                if (distSq < mouse.radius * mouse.radius) {
                    var dist = Math.sqrt(distSq) || 0.0001;
                    var force = (mouse.radius - dist) / mouse.radius;
                    p.x -= (dx / dist) * force * 5;   // avoids atan2 + cos + sin
                    p.y -= (dy / dist) * force * 5;
                } else {
                    p.x += (p.baseX - p.x) * 0.03;
                    p.y += (p.baseY - p.y) * 0.03;
                }

                ctx.moveTo(p.x + p.size, p.y);
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }

            ctx.fill();
            rafId = requestAnimationFrame(frame);
        }

        function start() {
            if (rafId === null) rafId = requestAnimationFrame(frame);
        }

        function stop() {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        // Stop burning battery when the tab isn't visible.
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop();
            else start();
        });

        build();
        start();
    }
})();
