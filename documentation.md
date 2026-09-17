# Gideon Nyarko Portfolio — Design & Development Documentation

## Purpose

This repository contains the static personal portfolio for Gideon Nyarko: a Ghana-based designer, full-stack engineer, data analyst, graphic designer, and photographer. The portfolio is intentionally a single scrolling page that combines a high-end dark creative aesthetic with concise, professional project and service information.

The production site is hosted at [nkgnyarko.netlify.app](https://nkgnyarko.netlify.app). The Git remote is `https://github.com/NNanaKwame/responsive-portfolio-gideon.git` and the primary branch is `main`.

## Technical architecture

This is a static HTML/CSS/JavaScript site. There is no package manager, build step, framework, or server-side code.

| Responsibility | Location |
| --- | --- |
| Document structure and portfolio content | `index.html` |
| Active visual system and responsive styles | `assets/css/modern.css` |
| Site behavior and interactive components | `assets/js/main.js` |
| Primary local images | `assets/img/` |
| Downloadable CV | `assets/resume.pdf` |
| Search-engine files | `robots.txt`, `sitemap.xml`, verification HTML files |

External dependencies are loaded through CDNs in `index.html`:

- Unicons v4 for icons
- Swiper v7 for the project carousel
- EmailJS v3 for the contact form

Do not introduce a framework or build pipeline unless the project requirements explicitly change. Direct edits to the three core files above are the normal development workflow.

## Page map

The page has a fixed top navigation bar and these sections, in order:

1. `#home` — Hero: personal introduction, social links, profile image, contact and CV calls to action.
2. `#about` — Bio, experience/project/certification statistics, CV and Credly links, Education and Work timeline tabs.
3. `#skills` — Accordion-style skill groups for Full-Stack Engineering, Data Analysis & AI, and UI/UX & Creative Design.
4. `#services` — Four service cards and corresponding detail modals.
5. `#portfolio` — Swiper carousel containing design work and website projects.
6. `#photography` — Three Pixieset gallery sample cards.
7. Project CTA — A prompt to contact Gideon about a new project.
8. `#contact` — Direct contact information and EmailJS form.
9. Footer — Quick links, social links, and the automatically updated year.

Anchor names are part of the navigation contract. Keep the header and footer `href` values synchronized with the section `id` values.

## Visual direction

### Overall feel

The design should feel like a premium creative/technical portfolio: dark, editorial, polished, and slightly futuristic. Avoid generic corporate layouts, bright white page backgrounds, heavy card clutter, or overly playful styling.

The key visual ingredients are:

- Near-black background with subtle grain and a faint cyan/purple particle field.
- Bright white primary text with muted gray secondary text.
- Cyan and electric-purple accents, often in gradients.
- Large rounded corners, restrained translucent glass surfaces, and soft shadows.
- Generous whitespace, wide desktop layouts, and clear hierarchy.
- A monospace treatment for small project titles in the carousel.

### Design tokens

The source of truth is the `:root` block near the top of `assets/css/modern.css`. Preserve those custom properties and prefer using them over hard-coded duplicate colors or spacing values.

Important concepts:

- `--bg-color`, `--surface-color`, `--surface-border`: dark backgrounds and glass-like surfaces.
- `--text-primary`, `--text-secondary`: text hierarchy.
- `--accent-primary`, `--accent-secondary`, `--accent-hover`: purple/cyan accent system.
- `--spacing-*`: consistent spacing scale.
- `--text-*`: typography scale.
- `--transition-fast` and `--transition-medium`: shared animation timing.

The body attribute `data-theme="light"` switches the palette. The default is the dark presentation.

### Typography

The page relies on the font definitions in `modern.css` and the icon font loaded from Unicons. Maintain the existing hierarchy:

- Hero title: strongest, most personal statement.
- Section eyebrow/subtitle: uppercase, compact, accent-colored context.
- Section title: clear white heading.
- Body copy: subdued gray, concise, and no longer than necessary.
- Project card title: monospace to differentiate the showcase.

## Responsive behavior

The principal responsive breakpoint is `768px`.

Desktop:

- Header navigation is horizontally visible.
- Hero and portfolio use wider, editorial compositions.
- Portfolio cards use a **16:10** aspect ratio at `768px` and above.
- Photography samples display in three columns.

Mobile:

- Navigation becomes a full-screen overlay controlled by the menu button.
- Major two-column layouts collapse to one column.
- Photography samples collapse to one column.
- The portfolio slide uses its base **4:5** aspect ratio.

The viewport must remain zoomable. Do not add `user-scalable=no` or a restrictive maximum scale.

## Core interactions

All JavaScript is initialized from `DOMContentLoaded` in `assets/js/main.js`.

| Feature | Implementation |
| --- | --- |
| Mobile menu | `initMobileNav()` toggles `.show-menu` |
| Scroll reveals | `initScrollAnimations()` uses `IntersectionObserver` and `.fade-in.visible` |
| Light/dark mode | `initThemeToggle()` saves preference in `localStorage` |
| Timeline | `initQualificationTabs()` switches `.qualification__active` |
| Skills | `initSkillsAccordion()` opens one skill group at a time |
| Service details | `initServiceModals()` opens `.active-modal` |
| Portfolio | `initPortfolioSwiper()` runs an infinite Swiper carousel and changes the corresponding `.ag-copy` block |
| Header and nav state | Scroll listeners add `.scroll-header` and `.active-link` |
| Scroll-to-top | `initScrollUp()` controls `.show-scroll` |
| Contact form | `initContactForm()` validates input and sends through EmailJS |
| Footer year | `initFooterYear()` uses the current calendar year |
| About animation | `initTypewriter()` types the About copy once when visible |
| Background | `initParticles()` renders the fixed canvas particle effect |

### Project showcase requirements

Each carousel slide must have a matching descriptive block in `.ag-copy-content`, with zero-based `data-index` values in the same order as the slides.

Every project is a clickable link. The project-card interaction must remain consistent:

- Existing image-based cards use `.ag-slide-wrapper` as an anchor around the image and overlay.
- Website cards use `.project-preview` and include a visual preview image.
- All cards include `.ag-play-cursor` with the text **View Project**. It is revealed on hover through the existing CSS.
- External projects use `target="_blank" rel="noopener"`.
- Keep the card layout as `display: block`; changing anchors back to inline elements breaks the original project-card sizing.

Current carousel order:

1. Birthday Flyer — Pinterest
2. T-Shirt Design — Pinterest
3. Mobile App UI/UX — Figma
4. Portfolio Website — GitHub Pages
5. NUBS KNUST — `https://www.nubsknust.org/`
6. Kesse Boateng & Co. — `https://tempfirm.vercel.app/`

## Photography section

Photography samples are intentionally linked to public Pixieset galleries rather than copied into the repository. This keeps the portfolio lightweight and directs visitors to full photo collections.

Current galleries:

| Shoot | Public gallery |
| --- | --- |
| Tweek Day 3 | `https://deongraphx.pixieset.com/tweekday3/` |
| Defense Panel 5 | `https://deongraphx.pixieset.com/defensepanel5/` |
| Jesus High School Outreach | `https://deongraphx42.pixieset.com/jesushighschooloutreach/` |

Each sample card should contain:

- An externally hosted Pixieset image with meaningful `alt` text.
- The shoot number and title.
- A link to its full public Pixieset gallery.
- The same rounded, dark-overlay, hover-zoom treatment in `.photography__sample`.

When changing images, use a public, stable Pixieset image URL from the desired collection and verify it renders before deployment. Do not use private galleries or download client images into the repository without explicit permission.

## Content and assets

### Local image usage

| Asset | Used for |
| --- | --- |
| `assets/img/profile.jpg` | Hero portrait inside an SVG mask |
| `assets/img/20250811-_MG_9902.JPG` | About portrait |
| `assets/img/Birthday Flyer.jpeg` | Birthday Flyer project |
| `assets/img/T Shirt Design.jpeg` | T-Shirt project |
| `assets/img/figma.png` | Mobile UI/UX project |
| `assets/img/port.png` | Portfolio Website project |
| `assets/img/about.jpg` | Project CTA image |
| `assets/img/favicon.svg` | Browser favicon |
| `assets/resume.pdf` | CV download buttons |

Some older asset files and legacy stylesheet/library files remain in the repository but are not loaded by the current page. Treat them as archived source material; do not depend on them for new work unless they are deliberately reintroduced.

### External profiles and contact details

- LinkedIn: `https://www.linkedin.com/in/nkgnyarko`
- Instagram: `https://www.instagram.com/deongrphx/`
- Pinterest: `https://www.pinterest.com/deongraphx/`
- Credly: `https://www.credly.com/users/gideon-nyarko`
- Email: `nkgnyarko@gmail.com`
- Phone: `+233-256-643-105`
- Location: Accra, Ghana

Verify external URLs when changing them. Do not submit the contact form as part of ordinary visual testing because it sends a real email.

## Contact form and EmailJS

The contact form validates all four inputs before attempting delivery. It sends a message and a separate automated reply through EmailJS.

The EmailJS configuration currently lives directly in `assets/js/main.js`. Public identifiers used by browser-side EmailJS are expected to be visible in the client, but the EmailJS dashboard should enforce allowed origins, template validation, and sensible rate limits. If the form is migrated, update the code and test it with a controlled email address only when authorized.

## Accessibility and quality requirements

- Use descriptive `alt` text for meaningful images; decorative images should have empty `alt` text.
- Keep labels and `aria-label` values on icon-only controls and external project links.
- Preserve keyboard-accessible native `<a>` and `<button>` elements.
- Maintain visible focus styles when adding controls.
- Do not replace useful links with click handlers on non-interactive `<div>` elements.
- Test all internal anchors after modifying sections.
- Test the carousel after adding/removing a slide to ensure its corresponding copy block appears.
- Check desktop and mobile layouts; the particle background must not interfere with content.

## SEO and deployment

The page has a title and meta description in `index.html`. `robots.txt` and `sitemap.xml` reference the Netlify domain. If the canonical domain changes, update both files and any verification files as required.

Deployment is expected to publish the repository root as a static site. Because there is no build command or output directory, a Netlify configuration is unnecessary unless deployment behavior changes.

## Safe change workflow

1. Inspect existing markup, styles, and JavaScript before modifying a section.
2. Keep content, styles, and interactions in their current dedicated files.
3. Add or update a project slide, matching descriptive copy block, and link together.
4. Start a temporary local static server, then inspect the page in a browser.
5. Verify anchors, carousel navigation, images, responsive layout, and browser console output.
6. Run `git diff --check` before handing off.
7. Do not publish or send form submissions without explicit authorization.

## Design principle for future changes

Prefer focused refinements over visual reinvention. New content should feel native to the current dark, glassy, cyan-and-purple system, preserve motion only where it adds feedback, and prioritize the actual work—projects, images, services, and contact paths—over decorative complexity.
