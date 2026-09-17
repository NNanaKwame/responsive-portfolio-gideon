/* =========================================================================
   Gideon Nyarko — site.js
   Replaces assets/js/main.js. Save as assets/js/site.js

   No carousel library, no particle canvas, no typewriter. Everything below
   is either an event handler responding to something the visitor did, or an
   IntersectionObserver. There is no persistent animation loop.
   ========================================================================= */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    ready(function () {
        mobileNav();
        themeToggle();
        scrollState();
        activeLink();
        revealOnScroll();
        timelineTabs();
        contactForm();
        footerYear();
    });

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    /* ---------- MOBILE NAV ---------- */
    function mobileNav() {
        var nav = document.getElementById('nav');
        var open = document.getElementById('nav-open');
        var close = document.getElementById('nav-close');
        if (!nav || !open) return;

        function show() {
            nav.classList.add('is-open');
            open.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            if (close) close.focus();
        }

        function hide() {
            nav.classList.remove('is-open');
            open.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        open.addEventListener('click', show);
        if (close) close.addEventListener('click', hide);

        nav.addEventListener('click', function (e) {
            if (e.target.closest('.nav__link')) hide();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                hide();
                open.focus();
            }
        });
    }

    /* ---------- THEME ---------- */
    function themeToggle() {
        var btn = document.getElementById('theme-button');
        if (!btn) return;

        var stored = null;
        try { stored = localStorage.getItem('theme'); } catch (e) { /* private mode */ }

        if (stored === 'light') document.body.setAttribute('data-theme', 'light');
        syncLabel();

        btn.addEventListener('click', function () {
            var next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            if (next === 'light') document.body.setAttribute('data-theme', 'light');
            else document.body.removeAttribute('data-theme');
            try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
            syncLabel();
        });

        function syncLabel() {
            var isLight = document.body.getAttribute('data-theme') === 'light';
            btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        }
    }

    /* ---------- HEADER + BACK TO TOP (one rAF-throttled passive listener) ---------- */
    function scrollState() {
        var masthead = document.getElementById('masthead');
        var toTop = document.getElementById('to-top');
        var queued = false;

        function apply() {
            queued = false;
            var y = window.scrollY;
            if (masthead) masthead.classList.toggle('is-stuck', y > 24);
            if (toTop) toTop.classList.toggle('is-shown', y > 600);
        }

        window.addEventListener('scroll', function () {
            if (queued) return;
            queued = true;
            requestAnimationFrame(apply);
        }, { passive: true });

        apply();
    }

    /* ---------- ACTIVE NAV LINK ----------
       Uses IntersectionObserver rather than reading offsetTop on every scroll
       event, which forces a synchronous layout and is the usual cause of
       scroll jank on phones. */
    function activeLink() {
        var sections = document.querySelectorAll('section[id]');
        if (!sections.length || !('IntersectionObserver' in window)) return;

        var links = {};
        var order = [];

        for (var i = 0; i < sections.length; i++) {
            var id = sections[i].id;
            var link = document.querySelector('.nav__link[href="#' + id + '"]');
            if (!link) continue;
            links[id] = link;
            order.push(id);
        }

        var showing = {};

        var io = new IntersectionObserver(function (entries) {
            for (var e = 0; e < entries.length; e++) {
                showing[entries[e].target.id] = entries[e].isIntersecting;
            }

            for (var key in links) links[key].classList.remove('is-current');

            for (var o = 0; o < order.length; o++) {
                if (showing[order[o]]) {
                    links[order[o]].classList.add('is-current');
                    break;
                }
            }
        }, { rootMargin: '-45% 0px -45% 0px' });

        for (var s = 0; s < sections.length; s++) io.observe(sections[s]);
    }

    /* ---------- REVEAL ---------- */
    function revealOnScroll() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            for (var e = 0; e < entries.length; e++) {
                if (!entries[e].isIntersecting) continue;
                entries[e].target.classList.add('is-in');
                io.unobserve(entries[e].target);
            }
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        for (var j = 0; j < items.length; j++) io.observe(items[j]);
    }

    /* ---------- TIMELINE TABS ---------- */
    function timelineTabs() {
        var tabs = document.querySelectorAll('.timeline__tab');
        var panels = document.querySelectorAll('.timeline__list');
        if (!tabs.length) return;

        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function () {
                var targetId = this.dataset.target;

                for (var t = 0; t < tabs.length; t++) {
                    var on = tabs[t] === this;
                    tabs[t].classList.toggle('is-on', on);
                    tabs[t].setAttribute('aria-selected', on ? 'true' : 'false');
                }

                for (var p = 0; p < panels.length; p++) {
                    var match = panels[p].id === targetId;
                    panels[p].classList.toggle('is-on', match);
                    panels[p].hidden = !match;
                }
            }.bind(tabs[i]));
        }
    }

    /* ---------- FOOTER YEAR ---------- */
    function footerYear() {
        var el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }

    /* ---------- CONTACT FORM ---------- */
    function contactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var fields = form.querySelectorAll('input, textarea');
            var values = {};
            var firstBad = null;

            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var wrap = field.closest('.field');
                var value = field.value.trim();
                var bad = !value;

                if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    bad = true;
                }

                if (wrap) wrap.classList.toggle('is-bad', bad);
                if (bad && !firstBad) firstBad = field;
                values[field.name] = value;
            }

            if (firstBad) {
                firstBad.focus();
                notify('Check the highlighted fields before sending.', 'error');
                return;
            }

            send(form, values);
        });

        // Clear the error state as soon as the visitor starts fixing it.
        form.addEventListener('input', function (e) {
            var wrap = e.target.closest('.field');
            if (wrap) wrap.classList.remove('is-bad');
        });
    }

    function send(form, values) {
        if (typeof emailjs === 'undefined') {
            notify('The form is unavailable right now. Email nkgnyarko@gmail.com directly.', 'error');
            return;
        }

        var button = form.querySelector('button[type="submit"]');
        var label = button.textContent;
        button.textContent = 'Sending…';
        button.disabled = true;

        function restore() {
            button.textContent = label;
            button.disabled = false;
        }

        emailjs.send('service_ueicxic', 'template_1o0l6bw', {
            from_name: values.name,
            from_email: values.email,
            project: values.project,
            message: values.message
        }, 'Dks6rHZgK9qWNU7fF').then(function () {
            emailjs.send('service_ueicxic', 'template_onks9is', {
                to_name: values.name,
                to_email: values.email
            }, 'Dks6rHZgK9qWNU7fF').catch(function (err) {
                console.error('Auto-reply failed:', err);
            });

            restore();
            form.reset();
            notify('Message sent. I\u2019ll be in touch shortly.');
        }).catch(function (err) {
            console.error('EmailJS error:', err);
            restore();
            notify('That didn\u2019t send. Try again, or email nkgnyarko@gmail.com.', 'error');
        });
    }

    /* ---------- NOTIFICATIONS ---------- */
    function notify(message, kind) {
        var old = document.querySelector('.alert');
        if (old) old.remove();

        var box = document.createElement('div');
        box.className = 'alert' + (kind === 'error' ? ' alert--error' : '');
        box.setAttribute('role', kind === 'error' ? 'alert' : 'status');

        var text = document.createElement('span');
        text.textContent = message;

        var x = document.createElement('button');
        x.className = 'alert__x';
        x.type = 'button';
        x.setAttribute('aria-label', 'Dismiss');
        x.textContent = '\u00D7';
        x.addEventListener('click', function () { box.remove(); });

        box.appendChild(text);
        box.appendChild(x);
        document.body.appendChild(box);

        setTimeout(function () {
            if (box.parentElement) box.remove();
        }, 6000);
    }
})();
