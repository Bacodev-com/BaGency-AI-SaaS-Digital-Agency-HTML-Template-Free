/*
 BaGency Template by BaCodev
 https://bacodev.com
 */

/**
 * @file        main.js
 * @description Shared JavaScript functionality for the BaGency template.
 *              Handles DOM initialization, dynamic content rendering,
 *              theme toggling, scroll animations, interactive components,
 *              form handling, and the demo chatbot.
 * @version     1.0.0
 * @author      BaGency
 * @license     Commercial
 *
 * Architecture:
 *   - data.js → main.js → DOM injection
 *   - Initialization order: theme → UI → render → scroll reveal → icons
 *   - All dynamic content is rendered before scroll observers are attached
 *
 * Dependencies:
 *   - data.js (must be loaded before this file)
 *   - Lucide Icons (optional, graceful fallback via typeof checks)
 *   - Tailwind CSS (CDN runtime, configured in tailwind-config.js)
 */

// ========== INITIALIZATION ==========

/**
 * @description Master DOMContentLoaded handler — orchestrates the entire page setup.
 *              Initialization is intentionally ordered to prevent visual glitches:
 *                1. Theme (prevents flash of wrong theme before any paint)
 *                2. Static UI (navbar, mobile menu, back-to-top)
 *                3. Dynamic content rendering (so DOM is complete for observers)
 *                4. Scroll reveal observers
 *                5. Counter animations
 *                6. Lucide icon scanning (last, so dynamic HTML is included)
 * @listens DOMContentLoaded
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize theme FIRST (prevents flash of wrong theme)
    initTheme();

    // 2. Initialize static UI components
    initNavbar();
    initMobileMenu();
    initBackToTop();

    // 3. Render ALL dynamic content FIRST so DOM is complete
    if (document.getElementById('services-grid')) renderServices();
    if (document.getElementById('process-timeline')) renderProcess();
    if (document.getElementById('pricing-grid')) renderPricing();
    if (document.getElementById('case-studies-grid')) renderCaseStudies();
    if (document.getElementById('testimonials-slider')) {
        renderTestimonials();
        initTestimonialSlider();
    }
    if (document.getElementById('faq-container')) {
        renderFAQ();
        initFAQ();
    }
    if (document.getElementById('leads-slider')) initCalculator();
    if (document.getElementById('chat-messages')) initChatbot();
    if (document.getElementById('booking-form')) initBookingForm();
    if (document.getElementById('contact-form')) initContactForm();
    if (document.getElementById('team-grid')) renderTeam();
    if (document.getElementById('blog-grid')) renderBlogGrid();
    if (document.getElementById('faq-categories')) {
        renderFAQCategories();
        initFAQ();
    }
    if (document.getElementById('case-studies-full')) renderCaseStudiesFull();

    // 4. NOW initialize scroll reveal — AFTER all dynamic content is in the DOM
    //    This ensures the IntersectionObserver catches every .reveal element
    initScrollReveal();

    // 5. Initialize animated counters (after dynamic content too)
    if (document.querySelectorAll('.counter').length > 0) {
        initCounters();
    }

    // 6. Initialize Lucide icons — last, so all dynamic content is scanned
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ========== SCROLL REVEAL ==========

/**
 * @description Sets up an IntersectionObserver that adds a 'revealed' CSS class
 *              to elements with .reveal, .reveal-left, .reveal-right, or .reveal-scale
 *              classes when they scroll into the viewport. Elements trigger once
 *              and stay revealed (no re-hiding on scroll out).
 * @returns {void}
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));
}

// ========== THEME TOGGLE ==========

/**
 * @description Initializes the light/dark theme toggle. Checks localStorage for a
 *              saved preference; if none exists, falls back to the operating system's
 *              prefers-color-scheme media query. Toggling adds/removes the 'dark'
 *              class on the <html> element (which is how Tailwind's 'class' darkMode
 *              strategy works) and persists the choice to localStorage.
 * @returns {void}
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
}

// ========== NAVBAR ==========

/**
 * @description Adds scroll-based styling to the navigation bar. When the user scrolls
 *              past 50px, the 'navbar-scrolled' class is toggled, which applies a
 *              frosted-glass background effect via CSS (backdrop-filter).
 * @returns {void}
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// ========== MOBILE MENU ==========

/**
 * @description Initializes the mobile slide-in menu. Handles:
 *              - Opening the menu via the hamburger button
 *              - Closing the menu via the close button, any navigation link, or any submenu link
 *              - Toggling the "Home" dropdown submenu within the mobile menu
 * @returns {void}
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuBtn || !mobileMenu) return;

    const menuLinks = mobileMenu.querySelectorAll('a');

    menuBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    if (menuClose) {
        menuClose.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }
    menuLinks.forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

    // Home submenu toggle
    const homeBtn = document.getElementById('mobile-home-btn');
    const homeSubmenu = document.getElementById('mobile-home-submenu');
    if (homeBtn && homeSubmenu) {
        homeBtn.addEventListener('click', () => {
            homeBtn.classList.toggle('open');
            homeSubmenu.classList.toggle('open');
        });
        // Close mobile menu when a submenu link is clicked
        homeSubmenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('active'));
        });
    }
}

// ========== BACK TO TOP ==========

/**
 * @description Shows/hides the back-to-top button based on scroll position (> 500px).
 *              Clicking the button smoothly scrolls the page to the top.
 * @returns {void}
 */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== ANIMATED COUNTERS ==========

/**
 * @description Initializes the number-counting animation for stat counters.
 *              Uses an IntersectionObserver to trigger the animation only when
 *              the counter scrolls into view. Each counter reads its target value
 *              from the `data-target` attribute and counts up from 0.
 *
 *              Animation logic:
 *                - `speed = 50` determines the number of animation steps (frames)
 *                - Each frame, the counter increases by `target / speed` (the increment)
 *                - Math.ceil ensures the number always rounds up, so it doesn't stall
 *                - Each frame is spaced by a 20ms setTimeout (recursive)
 *                - The observer is unobserved after the first trigger to prevent re-animation
 * @returns {void}
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 50;

    /**
     * @description Recursively animates a single counter element from its current
     *              value up to its `data-target`. Uses Math.ceil to ensure the number
     *              always progresses upward and settles exactly on the target.
     * @param {HTMLElement} counter - The counter element with a `data-target` attribute
     * @returns {void}
     */
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 20);
        } else {
            counter.innerText = target;
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ========== RENDER SERVICES ==========

/**
 * @description Renders service cards into the #services-grid container from servicesData.
 *              Each card displays an icon, title, description, and a list of features.
 *              Cards are given staggered transition-delay values for sequential
 *              scroll-reveal animations. The `data-service` attribute stores the index
 *              for potential click interactions.
 * @returns {void}
 */
function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = servicesData.map((service, index) => `
        <div class="reveal card-service glass-card rounded-2xl p-6 cursor-pointer" style="transition-delay: ${index * 0.1}s" data-service="${index}">
            <div class="w-14 h-14 bg-${service.color}-500/10 rounded-xl flex items-center justify-center mb-4 relative z-10">
                <i data-lucide="${service.icon}" class="w-7 h-7 text-${service.color}-500"></i>
            </div>
            <h3 class="font-display text-xl font-bold mb-3 relative z-10">${service.title}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4 relative z-10">${service.description}</p>
            <ul class="space-y-2 relative z-10">
                ${service.features.map(feature => `
                    <li class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <i data-lucide="check-circle" class="w-4 h-4 mr-2 text-${service.color}-500"></i>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

// ========== RENDER PROCESS TIMELINE ==========

/**
 * @description Renders the process/workflow timeline into #process-timeline from processData.
 *              On desktop (md+), items alternate left/right using CSS order classes:
 *                - Even indices: text left, icon center, spacer right
 *                - Odd indices: spacer left, icon center, text right
 *              On mobile, items stack vertically. Each step has a centered icon
 *              circle with gradient background and a glass-card content panel.
 * @returns {void}
 */
function renderProcess() {
    const timeline = document.getElementById('process-timeline');
    if (!timeline) return;

    timeline.innerHTML = processData.map((item, index) => `
        <div class="reveal timeline-item flex flex-col md:flex-row items-center gap-8" style="transition-delay: ${index * 0.15}s">
            <div class="flex-1 ${index % 2 === 1 ? 'md:text-right md:order-3' : 'md:order-1'}">
                <div class="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <span class="text-primary-500 font-display font-bold text-lg">Step ${item.step}</span>
                    <h3 class="font-display text-xl font-bold mt-2 mb-3">${item.title}</h3>
                    <p class="text-gray-600 dark:text-gray-400">${item.description}</p>
                </div>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white z-10 md:order-2 shadow-lg shadow-primary-500/30">
                <i data-lucide="${item.icon}" class="w-7 h-7"></i>
            </div>
            <div class="flex-1 ${index % 2 === 1 ? 'md:order-1' : 'md:order-3'} hidden md:block"></div>
        </div>
    `).join('');
}

// ========== RENDER PRICING ==========

/**
 * @description Tracks whether the user has selected yearly billing.
 *              Toggled by the billing switch in renderPricing().
 * @type {boolean}
 */
let isYearly = false;

/**
 * @description Renders the pricing section: generates pricing cards via renderPricingCards(),
 *              then initializes the monthly/yearly billing toggle. The toggle uses a
 *              cloneNode trick (see inline comments) to remove any pre-existing inline
 *              click handlers from the HTML, ensuring only the new JS handler fires.
 * @returns {void}
 */
function renderPricing() {
    renderPricingCards();

    const billingToggle = document.getElementById('billing-toggle');
    const billingDot = document.getElementById('billing-toggle-dot');
    if (!billingToggle || !billingDot) return;

    billingDot.style.transform = 'translateX(0)';
    billingToggle.classList.remove('bg-primary-500');
    billingToggle.classList.add('bg-gray-300', 'dark:bg-gray-600');

    // cloneNode(true) trick: Replaces the toggle element in the DOM with a fresh clone.
    // This strips any inline onclick handlers that may have been defined in the HTML,
    // preventing duplicate handler firing. The cloned element has no event listeners,
    // so we attach a single clean listener below.
    const newToggle = billingToggle.cloneNode(true);
    billingToggle.parentNode.replaceChild(newToggle, billingToggle);

    const newDot = document.getElementById('billing-toggle-dot');

    newToggle.addEventListener('click', function() {
        isYearly = !isYearly;

        if (isYearly) {
            newDot.style.transform = 'translateX(28px)';
            newToggle.classList.remove('bg-gray-300', 'dark:bg-gray-600');
            newToggle.classList.add('bg-primary-500');
        } else {
            newDot.style.transform = 'translateX(0)';
            newToggle.classList.remove('bg-primary-500');
            newToggle.classList.add('bg-gray-300', 'dark:bg-gray-600');
        }

        updatePricingDisplay();
    });
}

/**
 * @description Renders the pricing cards into #pricing-grid from pricingData.
 *              Each card includes the plan name, description, price, feature list,
 *              and a CTA button. The "popular" plan gets a special save badge,
 *              glow effect, and primary button style. Calls lucide.createIcons()
 *              after rendering to initialize any Lucide icons in the new HTML.
 * @returns {void}
 */
function renderPricingCards() {
    const grid = document.getElementById('pricing-grid');
    if (!grid) return;

    grid.innerHTML = pricingData.map((plan, index) => `
        <div class="reveal card-pricing glass-card rounded-2xl p-8 ${plan.popular ? 'popular' : ''} transition-all duration-300 hover:scale-[1.02]" style="transition-delay: ${index * 0.1}s">
            ${plan.popular ? '<div class="save-badge">Save 20%</div>' : ''}
            <h3 class="font-display text-xl font-bold mb-2">${plan.name}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">${plan.description}</p>
            <div class="mb-6">
                <span class="price-amount text-4xl font-display font-bold">$${plan.monthlyPrice}</span>
                <span class="text-gray-500 dark:text-gray-400">/month</span>
                <span class="price-badge ml-2 text-xs text-primary-500 font-bold hidden">Billed yearly</span>
            </div>
            <ul class="space-y-3 mb-8">
                ${plan.features.map(feature => `
                    <li class="flex items-center text-sm">
                        <i data-lucide="check" class="w-4 h-4 mr-3 text-primary-500"></i>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
            <a href="contact.html" class="${plan.popular ? 'btn-primary btn-glow' : 'btn-secondary'} w-full block text-center">
                ${plan.cta}
            </a>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * @description Updates the displayed prices on all pricing cards based on the
 *              current billing period (monthly vs yearly). When yearly is selected,
 *              shows the yearlyPrice from pricingData and reveals a "Billed yearly" badge.
 *              When monthly is selected, shows monthlyPrice and hides the badge.
 * @returns {void}
 */
function updatePricingDisplay() {
    const cards = document.querySelectorAll('#pricing-grid .card-pricing');
    const prices = isYearly
        ? pricingData.map(p => p.yearlyPrice)
        : pricingData.map(p => p.monthlyPrice);

    cards.forEach((card, index) => {
        const priceEl = card.querySelector('.price-amount');
        const badgeEl = card.querySelector('.price-badge');

        if (priceEl) priceEl.textContent = '$' + prices[index];
        if (badgeEl) {
            if (isYearly) badgeEl.classList.remove('hidden');
            else badgeEl.classList.add('hidden');
        }
    });
}

// ========== RENDER CASE STUDIES ==========

/**
 * @description Renders a preview of case studies (first 2 only) into the
 *              #case-studies-grid container. Each card shows the company logo/gradient
 *              header, before/after comparison metrics (leads, response time,
 *              conversion rate, costs), and improvement badges.
 * @returns {void}
 */
function renderCaseStudies() {
    const grid = document.getElementById('case-studies-grid');
    if (!grid) return;

    grid.innerHTML = caseStudiesData.slice(0, 2).map((study, index) => `
        <div class="reveal glass-card rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow" style="transition-delay: ${index * 0.15}s">
            <div class="bg-gradient-to-r ${study.logoBg} p-6 text-white">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-display font-bold text-lg backdrop-blur-sm">
                        ${study.logo}
                    </div>
                    <div>
                        <h3 class="font-display font-bold">${study.company}</h3>
                        <p class="text-white/70 text-sm">${study.industry}</p>
                    </div>
                </div>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                        <p class="text-xs text-gray-500 mb-2 font-medium">Before</p>
                        <div class="space-y-1 text-sm">
                            <p><span class="font-semibold">${study.before.leads}</span> leads</p>
                            <p><span class="font-semibold">${study.before.responseTime}</span> response</p>
                            <p><span class="font-semibold">${study.before.conversionRate}</span> conversion</p>
                            <p><span class="font-semibold">${study.before.costs}</span> costs</p>
                        </div>
                    </div>
                    <div class="text-center p-4 bg-primary-500/5 rounded-xl border border-primary-500/10">
                        <p class="text-xs text-primary-500 mb-2 font-medium">After</p>
                        <div class="space-y-1 text-sm">
                            <p><span class="font-semibold text-primary-500">${study.after.leads}</span> leads</p>
                            <p><span class="font-semibold text-primary-500">${study.after.responseTime}</span> response</p>
                            <p><span class="font-semibold text-primary-500">${study.after.conversionRate}</span> conversion</p>
                            <p><span class="font-semibold text-primary-500">${study.after.costs}</span> costs</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${study.improvements.map(imp => `
                        <span class="px-3 py-1.5 bg-primary-500/10 text-primary-500 text-xs font-semibold rounded-full">${imp}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// ========== RENDER CASE STUDIES FULL ==========

/**
 * @description Renders ALL case studies into the #case-studies-full container.
 *              Unlike renderCaseStudies() (which shows only the first 2), this renders
 *              every entry in caseStudiesData with additional detail: a description
 *              paragraph, the project duration badge, and a "Services Used" section
 *              at the bottom. Used on the dedicated case-studies.html page.
 * @returns {void}
 */
function renderCaseStudiesFull() {
    const container = document.getElementById('case-studies-full');
    if (!container) return;

    container.innerHTML = caseStudiesData.map((study, index) => `
        <div class="reveal glass-card rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow" style="transition-delay: ${index * 0.1}s">
            <div class="bg-gradient-to-r ${study.logoBg} p-6 text-white">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center font-display font-bold text-xl backdrop-blur-sm">
                            ${study.logo}
                        </div>
                        <div>
                            <h3 class="font-display font-bold text-xl">${study.company}</h3>
                            <p class="text-white/70 text-sm">${study.industry}</p>
                        </div>
                    </div>
                    <span class="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">${study.duration}</span>
                </div>
            </div>
            <div class="p-6 lg:p-8">
                <p class="text-gray-600 dark:text-gray-400 mb-6">${study.detail}</p>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                        <p class="text-xs text-gray-500 mb-3 font-medium">Before</p>
                        <div class="space-y-2 text-sm">
                            <p><span class="font-semibold">${study.before.leads}</span> leads</p>
                            <p><span class="font-semibold">${study.before.responseTime}</span> response</p>
                            <p><span class="font-semibold">${study.before.conversionRate}</span> conversion</p>
                            <p><span class="font-semibold">${study.before.costs}</span> costs</p>
                        </div>
                    </div>
                    <div class="text-center p-4 bg-primary-500/5 rounded-xl border border-primary-500/10">
                        <p class="text-xs text-primary-500 mb-3 font-medium">After</p>
                        <div class="space-y-2 text-sm">
                            <p><span class="font-semibold text-primary-500">${study.after.leads}</span> leads</p>
                            <p><span class="font-semibold text-primary-500">${study.after.responseTime}</span> response</p>
                            <p><span class="font-semibold text-primary-500">${study.after.conversionRate}</span> conversion</p>
                            <p><span class="font-semibold text-primary-500">${study.after.costs}</span> costs</p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-6">
                    ${study.improvements.map(imp => `
                        <span class="px-3 py-1.5 bg-primary-500/10 text-primary-500 text-xs font-semibold rounded-full">${imp}</span>
                    `).join('')}
                </div>

                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Services Used:</p>
                    <div class="flex flex-wrap gap-2">
                        ${study.services.map(s => `
                            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">${s}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== RENDER TESTIMONIALS ==========

/**
 * @description Tracks the index of the currently visible testimonial slide.
 *              Used by the testimonial slider navigation (prev/next buttons and dots).
 * @type {number}
 */
let currentTestimonial = 0;

/**
 * @description Renders testimonial cards into the #testimonials-slider container
 *              and generates pagination dots in #testimonial-dots. Each testimonial
 *              card shows: star rating, company logo badge, quote text, a key metric
 *              badge, and the author's avatar/name/role/company. The avatar has an
 *              onerror fallback that hides the image and shows initials instead.
 *              On large screens, 3 cards are visible per slide; dot count is
 *              calculated as Math.ceil(totalTestimonials / 3).
 * @returns {void}
 */
function renderTestimonials() {
    const slider = document.getElementById('testimonials-slider');
    const dots = document.getElementById('testimonial-dots');
    if (!slider) return;

    slider.innerHTML = testimonialsData.map((testimonial, index) => `
        <div class="testimonial-slide flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-4">
            <div class="testimonial-card glass-card rounded-2xl p-6 h-full">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-1">
                        ${Array(testimonial.rating).fill().map(() => `
                            <i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-current"></i>
                        `).join('')}
                    </div>
                    <div class="w-10 h-10 ${testimonial.companyLogoBg} rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        ${testimonial.companyLogo}
                    </div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">"${testimonial.text}"</p>
                <div class="metric-badge inline-flex items-center px-3 py-1.5 bg-primary-500/10 rounded-full text-primary-500 text-xs font-semibold mb-4">
                    <i data-lucide="trending-up" class="w-3 h-3 mr-1"></i>
                    ${testimonial.metric}
                </div>
                <div class="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div class="avatar-gradient w-12 h-12 flex-shrink-0">
                        <img src="${testimonial.avatar}" alt="${testimonial.name}" class="object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="hidden bg-primary-500 text-white items-center justify-center font-semibold">${testimonial.avatarFallback}</div>
                    </div>
                    <div>
                        <p class="font-semibold">${testimonial.name}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${testimonial.role}, ${testimonial.company}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    if (dots) {
        const totalSlides = Math.ceil(testimonialsData.length / 3);
        dots.innerHTML = Array(totalSlides).fill().map((_, i) => `
            <button class="testimonial-dot w-2 h-2 rounded-full transition-all ${i === 0 ? 'bg-primary-500 w-6' : 'bg-gray-300 dark:bg-gray-600'}" data-index="${i}"></button>
        `).join('');
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * @description Initializes the testimonial slider navigation. The slider shows 3 cards
 *              at a time on desktop (lg). Navigation works via:
 *                - Prev/Next buttons: decrement/increment currentTestimonial by 1
 *                - Dot buttons: jump to a specific page (each dot = 1 page of 3 cards)
 *
 *              Slider translation logic:
 *                - slideWidth = 100/3 (~33.33%) — each card takes 1/3 of the slider width
 *                - translateX shifts the slider container left by currentTestimonial * slideWidth
 *                - maxSlide = testimonialsData.length - 3 (prevents sliding past the last 3 cards)
 *
 *              Dot activation logic:
 *                - Active dot is determined by Math.floor(currentTestimonial / 3)
 *                - Active dot gets primary color and width-6 (elongated pill shape)
 *                - Inactive dots remain small circles with gray color
 * @returns {void}
 */
function initTestimonialSlider() {
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const slider = document.getElementById('testimonials-slider');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!prevBtn || !nextBtn || !slider) return;

    // Maximum slide index: prevents sliding past the last visible set of 3 cards
    const maxSlide = testimonialsData.length - 3;

    prevBtn.addEventListener('click', () => {
        currentTestimonial = Math.max(0, currentTestimonial - 1);
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = Math.min(maxSlide, currentTestimonial + 1);
        updateSlider();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentTestimonial = parseInt(dot.dataset.index);
            updateSlider();
        });
    });

    /**
     * @description Translates the slider container and updates dot active states.
     *              Each slide position shifts the container by 33.33% (100/3) per card index.
     *              Dots are mapped to pages: dot 0 = cards 0-2, dot 1 = cards 3-5, etc.
     * @returns {void}
     */
    function updateSlider() {
        const slideWidth = 100 / 3;
        slider.style.transform = `translateX(-${currentTestimonial * slideWidth}%)`;

        dots.forEach((dot, i) => {
            const isActive = i === Math.floor(currentTestimonial / 3);
            dot.classList.toggle('bg-primary-500', isActive);
            dot.classList.toggle('w-6', isActive);
            dot.classList.toggle('bg-gray-300', !isActive);
            dot.classList.toggle('dark:bg-gray-600', !isActive);
        });
    }
}

// ========== RENDER FAQ ==========

/**
 * @description Renders FAQ accordion items into #faq-container from faqData.
 *              Each item has a clickable question button and a hidden answer panel.
 *              The .faq-item gets the 'active' class toggled by initFAQ() to
 *              expand/collapse the answer via CSS max-height transitions.
 * @returns {void}
 */
function renderFAQ() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    container.innerHTML = faqData.map((item, index) => `
        <div class="reveal faq-item glass-card" style="transition-delay: ${index * 0.05}s" data-index="${index}">
            <button class="faq-question px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl">
                <span class="font-semibold pr-4">${item.question}</span>
                <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0"></i>
            </button>
            <div class="faq-answer">
                <div class="px-6 pb-5 text-gray-600 dark:text-gray-400">
                    ${item.answer}
                </div>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ========== RENDER FAQ CATEGORIES ==========

/**
 * @description Renders FAQ items organized into categories into #faq-categories.
 *              Iterates over faqCategories (an object where keys are category names
 *              and values are arrays of FAQ items). Each category gets a section header
 *              with a folder icon and its FAQ items rendered as accordion items.
 *              Used on the dedicated faq.html page for better content organization.
 * @returns {void}
 */
function renderFAQCategories() {
    const container = document.getElementById('faq-categories');
    if (!container) return;

    container.innerHTML = Object.entries(faqCategories).map(([category, items]) => `
        <div class="mb-8">
            <h3 class="font-display text-xl font-bold mb-4 flex items-center">
                <i data-lucide="folder" class="w-5 h-5 text-primary-500 mr-2"></i>
                ${category}
            </h3>
            <div class="space-y-4">
                ${items.map((item, index) => `
                    <div class="reveal faq-item glass-card" style="transition-delay: ${index * 0.05}s">
                        <button class="faq-question px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl">
                            <span class="font-semibold pr-4">${item.question}</span>
                            <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0"></i>
                        </button>
                        <div class="faq-answer">
                            <div class="px-6 pb-5 text-gray-600 dark:text-gray-400">
                                ${item.answer}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * @description Initializes the FAQ accordion behavior via a delegated click listener
 *              on the document. When any .faq-question button is clicked, it finds the
 *              parent .faq-item and toggles the 'active' class. The CSS handles the
 *              expand/collapse animation via max-height transition on .faq-answer.
 *              Note: only one item toggles at a time — clicking an active item closes it,
 *              but other open items are NOT automatically closed (multiple can be open).
 * @returns {void}
 */
function initFAQ() {
    document.addEventListener('click', (e) => {
        const question = e.target.closest('.faq-question');
        if (!question) return;

        const item = question.closest('.faq-item');
        const isActive = item.classList.contains('active');

        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    });
}

// ========== ROI CALCULATOR ==========

/**
 * @description Initializes the ROI (Return on Investment) calculator interactive demo.
 *              Binds four range sliders (leads, hours, rate, software) to a
 *              calculateROI function that runs on every input event.
 *
 *              ROI Calculation Formula:
 *                weeklySavings  = hoursPerWeek × hourlyRate × 0.6
 *                                 (0.6 = assumed 60% efficiency gain from AI automation)
 *                annualSavings  = (weeklySavings × 52 weeks) + (softwareCost × 12 months × 0.5)
 *                                 (0.5 = assumed 50% software cost reduction from consolidation)
 *                hoursSaved      = hours × 0.6 × 52 (annual hours reclaimed)
 *                investment      = $699 × 12 (annual Professional plan cost)
 *                roi             = ((annualSavings − investment) / investment) × 100
 *
 *              The savings result gets a brief scale pulse animation (1.05 → 1.0)
 *              on each recalculation to provide visual feedback.
 * @returns {void}
 */
function initCalculator() {
    const leadsSlider = document.getElementById('leads-slider');
    const hoursSlider = document.getElementById('hours-slider');
    const rateSlider = document.getElementById('rate-slider');
    const softwareSlider = document.getElementById('software-slider');

    if (!leadsSlider) return;

    const sliders = [leadsSlider, hoursSlider, rateSlider, softwareSlider];

    sliders.forEach(slider => {
        slider.addEventListener('input', calculateROI);
    });

    // Run once on init to populate initial values
    calculateROI();

    /**
     * @description Reads all slider values, computes the ROI metrics, and updates
     *              the display elements. Uses the formula documented in initCalculator().
     * @returns {void}
     */
    function calculateROI() {
        const leads = parseInt(leadsSlider.value);
        const hours = parseInt(hoursSlider.value);
        const rate = parseInt(rateSlider.value);
        const software = parseInt(softwareSlider.value);

        document.getElementById('leads-value').textContent = leads;
        document.getElementById('hours-value').textContent = hours;
        document.getElementById('rate-value').textContent = '$' + rate;
        document.getElementById('software-value').textContent = '$' + software;

        // 60% of manual hours are automated → weekly labor savings
        const weeklySavings = hours * rate * 0.6;
        // Annual savings = 52 weeks of labor savings + 50% of yearly software spend (consolidation)
        const annualSavings = (weeklySavings * 52) + (software * 12 * 0.5);
        // Annual hours reclaimed by automation
        const hoursSaved = Math.round(hours * 0.6 * 52);
        // Investment = Professional plan annual cost
        const investment = 699 * 12;
        // ROI as a percentage: ((savings - cost) / cost) × 100
        const roi = Math.round(((annualSavings - investment) / investment) * 100);

        const savingsEl = document.getElementById('savings-result');
        const hoursEl = document.getElementById('hours-saved');
        const roiEl = document.getElementById('roi-percent');

        savingsEl.textContent = '$' + annualSavings.toLocaleString();
        hoursEl.textContent = hoursSaved.toLocaleString();
        roiEl.textContent = roi + '%';

        // Brief scale pulse for visual feedback on value change
        savingsEl.style.transform = 'scale(1.05)';
        setTimeout(() => savingsEl.style.transform = 'scale(1)', 150);
    }
}

// ========== CHATBOT DEMO ==========

/**
 * @description Initializes the demo chatbot widget. This is a simulated (not AI-powered)
 *              chatbot that responds to user messages by matching them against a
 *              predefined lookup table (chatbotResponses from data.js).
 *
 *              Chatbot message processing flow:
 *                1. User sends a message (via input field, Enter key, or quick-reply button)
 *                2. addUserMessage() renders the user's message as a right-aligned green bubble
 *                3. processMessage() is called with the lowercased message text
 *                4. A typing indicator (three animated dots) is displayed for 1-2 seconds
 *                5. The indicator is removed and a bot response is looked up:
 *                   - Exact match in chatbotResponses → use that response
 *                   - No match → fall back to chatbotResponses['default']
 *                6. addBotMessage() renders the bot's response as a left-aligned bubble
 *
 *              The chat container auto-scrolls to the bottom after each new message.
 * @returns {void}
 */
function initChatbot() {
    const chatContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const quickReplies = document.querySelectorAll('.quick-reply');
    if (!chatContainer || !chatInput || !chatSend) return;

    // Display the initial bot greeting from chatbotScript
    addBotMessage(chatbotScript[0].text);

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Quick-reply buttons bypass the input field — they send predefined text directly
    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.textContent.trim();
            addUserMessage(message);
            processMessage(message.toLowerCase());
        });
    });

    /**
     * @description Reads the user's text from the input field, sends it as a user
     *              message, clears the input, and processes the message for a bot reply.
     *              No-op if the input is empty (whitespace-only).
     * @returns {void}
     */
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        chatInput.value = '';
        processMessage(message.toLowerCase());
    }

    /**
     * @description Appends a user message bubble to the chat container.
 *                  The bubble is right-aligned with a green gradient background.
     * @param {string} text - The user's message text
     * @returns {void}
     */
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message flex justify-end';
        messageDiv.innerHTML = `
            <div class="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-[80%] shadow-lg">
                <p class="text-sm">${text}</p>
            </div>
        `;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    /**
     * @description Appends a bot message bubble to the chat container.
 *                  The bubble is left-aligned with a white/gray background.
 *                  Uses whitespace-pre-line to preserve newline characters in
 *                  multi-line responses from chatbotResponses.
     * @param {string} text - The bot's response text (may contain \n newlines)
     * @returns {void}
     */
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message flex';
        messageDiv.innerHTML = `
            <div class="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md max-w-[80%] shadow-sm">
                <p class="text-sm whitespace-pre-line">${text}</p>
            </div>
        `;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    /**
     * @description Displays a typing indicator (three animated bouncing dots) at the
     *              bottom of the chat. The indicator has id='typing-indicator' so it
     *              can be removed later by removeTypingIndicator().
     * @returns {void}
     */
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator-container flex';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatContainer.appendChild(indicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    /**
     * @description Removes the typing indicator element from the chat if it exists.
     * @returns {void}
     */
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    /**
     * @description Processes a user message and generates a bot response after a
     *              simulated delay. The delay is randomized between 1-2 seconds
     *              (1000ms + random 0-1000ms) to feel more natural.
 *
 *                  Response lookup is a simple key-value match on the lowercased message:
 *                    - Exact key match in chatbotResponses → use that response
 *                    - No match → fall back to chatbotResponses['default'] (helpful catch-all)
     * @param {string} message - The lowercased user message text
     * @returns {void}
     */
    function processMessage(message) {
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const response = chatbotResponses[message] || chatbotResponses['default'];
            addBotMessage(response.text);
        }, 1000 + Math.random() * 1000);
    }
}

// ========== FORMS ==========

/**
 * @description Initializes the booking form (#booking-form) submission handler.
 *              On submit:
 *                1. Prevents default form action
 *                2. Collects form data via FormData (logged to console for demo)
 *                3. Replaces the submit button with a "Booking Confirmed!" state
 *                4. After 3 seconds, restores the original button and resets the form
 *              In production, the FormData would be sent to a backend API endpoint.
 * @returns {void}
 */
function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log('Booking form submitted:', data);

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" class="w-5 h-5 mr-2"></i>Booking Confirmed!';
        btn.classList.add('bg-green-500');
        btn.disabled = true;

        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('bg-green-500');
            btn.disabled = false;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            form.reset();
        }, 3000);
    });
}

/**
 * @description Initializes the general contact form (#contact-form) submission handler.
 *              Identical behavior to initBookingForm() but with a "Message Sent!"
 *              confirmation message. On submit:
 *                1. Prevents default form action
 *                2. Collects and logs form data
 *                3. Shows confirmation state on the button
 *                4. Auto-restores after 3 seconds
 * @returns {void}
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log('Contact form submitted:', data);

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" class="w-5 h-5 mr-2"></i>Message Sent!';
        btn.classList.add('bg-green-500');
        btn.disabled = true;

        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('bg-green-500');
            btn.disabled = false;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            form.reset();
        }, 3000);
    });
}

// ========== RENDER TEAM ==========

/**
 * @description Renders team member cards into #team-grid from teamData.
 *              Each card displays an avatar (with onerror fallback to initials),
 *              name, role, bio, and social media links (LinkedIn and X/Twitter
 *              using inline SVG icons). Cards use staggered transition-delay
 *              values for sequential scroll-reveal animations.
 * @returns {void}
 */
function renderTeam() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;

    grid.innerHTML = teamData.map((member, index) => `
        <div class="reveal team-card glass-card rounded-2xl p-6 text-center" style="transition-delay: ${index * 0.1}s">
            <div class="avatar-gradient w-24 h-24 mx-auto mb-4">
                <img src="${member.avatar}" alt="${member.name}" class="object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="hidden bg-primary-500 text-white items-center justify-center font-bold text-2xl">${member.avatarFallback}</div>
            </div>
            <h3 class="font-display text-lg font-bold">${member.name}</h3>
            <p class="text-primary-500 text-sm font-medium mb-3">${member.role}</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${member.bio}</p>
            <div class="flex justify-center space-x-3">
                <a href="${member.social.linkedin}" class="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors text-gray-500">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="${member.social.twitter}" class="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors text-gray-500">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ========== RENDER BLOG GRID ==========

/**
 * @description Renders the blog post grid into #blog-grid from blogData.
 *              Separates posts into featured (first with featured=true) and regular posts:
 *                - Featured post: spans 2 columns on large screens (lg:col-span-2),
 *                  uses a horizontal card layout with image on left, content on right
 *                - Regular posts: standard vertical card layout with image on top
 *              Each card links to blog-single.html?id={post.id} and includes the
 *              category badge, title, excerpt, author avatar (with fallback), and date.
 * @returns {void}
 */
function renderBlogGrid() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    const featured = blogData.filter(b => b.featured);
    const regular = blogData.filter(b => !b.featured);

    let html = '';

    // Featured post
    if (featured.length) {
        const post = featured[0];
        html += `
            <div class="reveal lg:col-span-2">
                <a href="blog-single.html?id=${post.id}" class="blog-card glass-card rounded-2xl overflow-hidden block group">
                    <div class="md:flex">
                        <div class="md:w-1/2 h-48 md:h-auto bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                        <div class="p-6 md:w-1/2 flex flex-col justify-center">
                            <div class="flex items-center space-x-3 mb-3">
                                <span class="px-3 py-1 bg-primary-500/10 text-primary-500 text-xs font-semibold rounded-full">${post.category}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">${post.date}</span>
                            </div>
                            <h3 class="font-display text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary-500 transition-colors">${post.title}</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${post.excerpt}</p>
                            <div class="flex items-center space-x-3">
                                <div class="avatar-gradient w-8 h-8 flex-shrink-0">
                                    <img src="${post.authorAvatar}" alt="${post.author}" class="object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div class="hidden bg-primary-500 text-white items-center justify-center font-semibold text-xs">${post.authorFallback}</div>
                                </div>
                                <div>
                                    <p class="text-sm font-medium">${post.author}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">${post.readTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    // Regular posts
    regular.forEach((post, index) => {
        html += `
            <div class="reveal" style="transition-delay: ${(index + 1) * 0.1}s">
                <a href="blog-single.html?id=${post.id}" class="blog-card glass-card rounded-2xl overflow-hidden block group h-full">
                    <div class="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center space-x-3 mb-3">
                            <span class="px-3 py-1 bg-primary-500/10 text-primary-500 text-xs font-semibold rounded-full">${post.category}</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">${post.readTime}</span>
                        </div>
                        <h3 class="font-display text-lg font-bold mb-2 group-hover:text-primary-500 transition-colors">${post.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${post.excerpt}</p>
                        <div class="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div class="avatar-gradient w-8 h-8 flex-shrink-0">
                                <img src="${post.authorAvatar}" alt="${post.author}" class="object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="hidden bg-primary-500 text-white items-center justify-center font-semibold text-xs">${post.authorFallback}</div>
                            </div>
                            <div>
                                <p class="text-sm font-medium">${post.author}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">${post.date}</p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });

    grid.innerHTML = html;

    if (typeof lucide !== 'undefined') lucide.createIcons();
}
