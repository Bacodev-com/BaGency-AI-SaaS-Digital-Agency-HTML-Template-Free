/**
 * @file        tailwind-config.js
 * @description Tailwind CSS CDN runtime configuration for the BaGency template.
 *              Extends the default Tailwind theme with custom fonts, color scales,
 *              animations, and keyframes. This file must be loaded BEFORE main.js
 *              and BEFORE any Tailwind utility classes are used in the HTML.
 * @version     1.0.0
 * @author      BaGency
 * @license     Commercial
 *
 * Dark Mode Strategy:
 *   Uses the 'class' strategy — dark mode is activated by adding the 'dark'
 *   class to the <html> element. This is toggled by initTheme() in main.js.
 *   All dark-mode styles use Tailwind's dark: variant prefix (e.g. dark:bg-gray-800).
 *
 * Color Palette:
 *   - primary (green)  → Main brand color: buttons, links, highlights, badges
 *   - accent (purple)  → Secondary brand color: alternate service cards, subtle accents
 *
 * Font Stack:
 *   - sans    → Inter (body text, UI elements)
 *   - display → Space Grotesk (headings, numbers, hero text)
 */

tailwind.config = {
    // Dark mode is controlled via the 'dark' class on <html>.
    // Set by initTheme() in main.js, persisted to localStorage.
    darkMode: 'class',

    theme: {
        extend: {
            // ========== FONT FAMILIES ==========
            // Loaded via Google Fonts CDN in the HTML <head>
            fontFamily: {
                sans: ['Inter', 'sans-serif'],       // Body text, form inputs, UI labels
                display: ['Space Grotesk', 'sans-serif'], // Headings, stats, hero copy, prices
            },

            // ========== CUSTOM COLOR SCALES ==========
            colors: {
                /**
                 * Primary color scale — green (#22c55e at 500).
                 * Used for: CTAs, links, active states, badges, hero gradients,
                 * service card accents, progress indicators, and success states.
                 * Extends from a very light tint (50) to a deep forest green (900).
                 * Most commonly used shades: 500 (default), 400 (lighter), 600 (darker/hover).
                 */
                primary: {
                    50: '#f0fdf4',   // Near-white green tint — subtle backgrounds
                    100: '#dcfce7',  // Light green — card backgrounds, hover states
                    200: '#bbf7d0',  // Soft green — borders, dividers
                    300: '#86efac',  // Medium-light green — secondary elements
                    400: '#4ade80',  // Bright green — hover states, lighter accents
                    500: '#22c55e',  // Brand green — primary buttons, links, highlights
                    600: '#16a34a',  // Dark green — button hover, pressed states
                    700: '#15803d',  // Deep green — text on light backgrounds
                    800: '#166534',  // Forest green — dark backgrounds
                    900: '#14532d',  // Darkest green — headings in dark sections
                },
                /**
                 * Accent color scale — purple (#8b5cf6 at 500).
                 * Used for: alternating service card accents, secondary highlights,
                 * decorative gradients, and visual variety alongside the primary green.
                 * Only 3 shades (400, 500, 600) are defined since accent usage
                 * is more limited than the primary color.
                 */
                accent: {
                    400: '#a78bfa',  // Light purple — hover states, lighter accents
                    500: '#8b5cf6',  // Brand purple — accent badges, alternating cards
                    600: '#7c3aed',  // Dark purple — pressed states, text on light bg
                }
            },

            // ========== CUSTOM ANIMATIONS ==========
            animation: {
                /**
                 * Gentle floating motion (6s infinite).
                 * Used for: decorative hero shapes, floating background elements.
                 */
                'float': 'float 6s ease-in-out infinite',

                /**
                 * Pulsing glow effect on the primary green color (2s infinite).
                 * Used for: CTA button glow halos, highlighted elements.
                 */
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',

                /**
                 * Three-step typing cursor blink (1s infinite).
                 * Used for: chatbot typing indicator dots.
                 */
                'typing': 'typing 1s steps(3) infinite',

                /**
                 * Slide up + fade in entrance (0.5s one-shot).
                 * Used for: general content entrance animations.
                 */
                'slide-up': 'slideUp 0.5s ease-out',

                /**
                 * Simple fade in (0.5s one-shot).
                 * Used for: elements that should appear without vertical movement.
                 */
                'fade-in': 'fadeIn 0.5s ease-out',

                /**
                 * Subtle vertical bounce (2s infinite).
                 * Used for: attention-grabbing elements like scroll prompts.
                 */
                'bounce-subtle': 'bounceSubtle 2s infinite',

                /**
                 * Intensifying glow with slight scale (2s infinite).
                 * Used for: premium CTA buttons, highlighted cards.
                 */
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',

                /**
                 * Horizontal background-position shimmer (2s infinite linear).
                 * Used for: loading states, shimmer/skeleton placeholders.
                 */
                'shimmer': 'shimmer 2s linear infinite',

                /**
                 * Scale up + fade in entrance (0.5s one-shot).
                 * Used for: modal-like entrances, card pop-in effects.
                 */
                'scale-in': 'scaleIn 0.5s ease-out',

                /**
                 * Slide in from the left + fade in (0.6s one-shot).
                 * Used for: timeline items, left-aligned content entrance.
                 */
                'slide-in-left': 'slideInLeft 0.6s ease-out',

                /**
                 * Slide in from the right + fade in (0.6s one-shot).
                 * Used for: timeline items, right-aligned content entrance.
                 */
                'slide-in-right': 'slideInRight 0.6s ease-out',

                /**
                 * Number counter animation (2s one-shot with forwards fill).
                 * Used for: stat counter elements (alternative to the JS counter).
                 */
                'counter': 'counter 2s ease-out forwards',
            },

            // ========== KEYFRAME DEFINITIONS ==========
            keyframes: {
                /** Float: 0→20px→0 vertical translation over 6s */
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                /** PulseGlow: Primary green box-shadow intensity oscillation */
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)' },
                },
                /** Typing: opacity blink (1→0→1) — mimics a cursor or dot pulse */
                typing: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                },
                /** SlideUp: 30px below + transparent → origin + fully visible */
                slideUp: {
                    '0%': { opacity: 0, transform: 'translateY(30px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                /** FadeIn: simple opacity 0 → 1 */
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                /** BounceSubtle: small 5px bounce — less aggressive than Tailwind's built-in bounce */
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                /** GlowPulse: dual-layer green box-shadow with slight 1.02x scale pulse */
                glowPulse: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)',
                        transform: 'scale(1)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)',
                        transform: 'scale(1.02)'
                    },
                },
                /** Shimmer: horizontal background-position shift — requires gradient background */
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                /** ScaleIn: scale 0.9 + transparent → scale 1.0 + fully visible */
                scaleIn: {
                    '0%': { opacity: 0, transform: 'scale(0.9)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
                /** SlideInLeft: 50px left + transparent → origin + fully visible */
                slideInLeft: {
                    '0%': { opacity: 0, transform: 'translateX(-50px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                },
                /** SlideInRight: 50px right + transparent → origin + fully visible */
                slideInRight: {
                    '0%': { opacity: 0, transform: 'translateX(50px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                },
            }
        }
    }
};
