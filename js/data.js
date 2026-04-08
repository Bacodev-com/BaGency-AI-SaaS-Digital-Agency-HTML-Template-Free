/**
 * @file        data.js
 * @description Central data store for the BaGency template. Contains all content
 *              data consumed by main.js render functions. This file must be loaded
 *              BEFORE main.js in the HTML script stack.
 * @version     1.0.0
 * @author      BaGency
 * @license     Commercial
 *
 * Data Architecture:
 *   - All data is declared as const arrays/objects at the top level
 *   - No module exports — consumed via global scope by main.js
 *   - faqCategories references faqData entries (shared references, not copies)
 *
 * Content Sections:
 *   - servicesData    → renderServices(), services.html detail panels
 *   - processData     → renderProcess()
 *   - pricingData     → renderPricingCards(), updatePricingDisplay()
 *   - caseStudiesData → renderCaseStudies(), renderCaseStudiesFull()
 *   - testimonialsData → renderTestimonials()
 *   - faqData         → renderFAQ(), faqCategories (reused)
 *   - faqCategories   → renderFAQCategories()
 *   - chatbotScript   → initChatbot() initial greeting
 *   - chatbotResponses → initChatbot() message processing
 *   - teamData        → renderTeam()
 *   - blogData        → renderBlogGrid()
 */

// ========== SERVICES DATA ==========

/**
 * @description Array of service offerings displayed in the services grid and
 *              service detail panels. Each item defines a service card with icon,
 *              title, short description, feature list, color theme, and an extended
 *              detail paragraph for the full service page.
 *
 * @type {Array<{
 *   icon: string,
 *   title: string,
 *   description: string,
 *   features: string[],
 *   color: string,
 *   detail: string
 * }>}
 *
 * @property {string} icon       - Lucide icon name (e.g. 'message-square', 'workflow')
 * @property {string} title      - Service display name (e.g. 'AI Chatbots')
 * @property {string} description - Short one-line description for the card
 * @property {string[]} features  - Array of 3 feature bullet points shown in the card
 * @property {string} color      - Tailwind color name ('primary' or 'accent') for theming
 * @property {string} detail     - Extended multi-sentence description for the services detail page
 */
const servicesData = [
    {
        icon: 'message-square',
        title: 'AI Chatbots',
        description: '24/7 intelligent customer support that qualifies leads and resolves queries automatically.',
        features: ['Natural Language Processing', 'Multi-language Support', 'CRM Integration'],
        color: 'primary',
        detail: 'Our AI chatbots leverage advanced NLP to understand and respond to customer queries with human-like accuracy. They integrate seamlessly with your existing CRM, ticketing systems, and knowledge bases to provide instant, accurate responses 24/7. With multi-language support and continuous learning capabilities, our chatbots improve over time, delivering increasingly personalized experiences.'
    },
    {
        icon: 'workflow',
        title: 'Workflow Automation',
        description: 'Streamline repetitive tasks and connect your tools for seamless operations.',
        features: ['Process Automation', 'API Integrations', 'Custom Workflows'],
        color: 'accent',
        detail: 'Eliminate manual bottlenecks with intelligent workflow automation. We connect your existing tools—CRM, email, project management, accounting—into unified, automated workflows. From lead routing to invoice processing, our solutions handle the repetitive work so your team can focus on high-value activities that drive growth.'
    },
    {
        icon: 'database',
        title: 'CRM Automation',
        description: 'Automate lead scoring, follow-ups, and customer relationship management.',
        features: ['Lead Scoring', 'Auto Follow-ups', 'Pipeline Management'],
        color: 'primary',
        detail: 'Transform your CRM from a passive database into an active revenue engine. Our AI-powered CRM automation scores leads in real-time, triggers personalized follow-up sequences, and provides your sales team with actionable insights. Reduce manual data entry by 80% while improving lead-to-close conversion rates.'
    },
    {
        icon: 'megaphone',
        title: 'AI Marketing',
        description: 'Personalized campaigns, content creation, and predictive analytics.',
        features: ['Content Generation', 'Ad Optimization', 'Predictive Analytics'],
        color: 'accent',
        detail: 'Leverage AI to create hyper-personalized marketing campaigns that resonate. Our tools analyze customer behavior patterns to predict the best channels, timing, and messaging for each segment. From automated content generation to real-time ad optimization, we help you achieve higher ROI on every marketing dollar.'
    },
    {
        icon: 'target',
        title: 'Lead Generation',
        description: 'Capture, qualify, and nurture leads with AI-powered strategies.',
        features: ['Lead Capture', 'Smart Qualification', 'Auto Nurturing'],
        color: 'primary',
        detail: 'Generate more qualified leads with less effort. Our AI-powered lead generation system identifies high-intent prospects, engages them with personalized outreach, and nurtures them through your sales funnel automatically. Using predictive scoring and behavioral analysis, we ensure your sales team only spends time on leads most likely to convert.'
    },
    {
        icon: 'brain',
        title: 'Custom AI Solutions',
        description: 'Tailored AI solutions designed specifically for your business needs.',
        features: ['Custom Models', 'Training & Support', 'Scalable Architecture'],
        color: 'accent',
        detail: 'When off-the-shelf solutions aren\'t enough, our AI engineering team builds custom solutions tailored to your unique business challenges. From custom machine learning models to specialized NLP systems, we design, train, and deploy AI solutions that integrate with your existing infrastructure and scale with your business.'
    }
];

// ========== PROCESS TIMELINE DATA ==========

/**
 * @description Array of steps in the company's engagement process, rendered as a
 *              zigzag timeline on the homepage and services page. Steps alternate
 *              left and right on desktop via the renderProcess() function.
 *
 * @type {Array<{
 *   step: string,
 *   title: string,
 *   description: string,
 *   icon: string
 * }>}
 *
 * @property {string} step        - Step number as a zero-padded string (e.g. '01', '02')
 * @property {string} title       - Step title (e.g. 'Discovery Call')
 * @property {string} description - Brief description of what happens in this step
 * @property {string} icon        - Lucide icon name for the step's circle badge
 */
const processData = [
    {
        step: '01',
        title: 'Discovery Call',
        description: 'We analyze your current processes and identify automation opportunities.',
        icon: 'phone'
    },
    {
        step: '02',
        title: 'Strategy Design',
        description: 'Our experts design a custom AI automation roadmap for your business.',
        icon: 'clipboard-list'
    },
    {
        step: '03',
        title: 'Implementation',
        description: 'We build, test, and deploy your AI solutions with zero downtime.',
        icon: 'code'
    },
    {
        step: '04',
        title: 'Optimization',
        description: 'Continuous monitoring and improvement to maximize your ROI.',
        icon: 'trending-up'
    }
];

// ========== PRICING DATA ==========

/**
 * @description Array of pricing plans rendered as cards on the pricing page.
 *              The toggle between monthly and yearly billing swaps the displayed price
 *              between monthlyPrice and yearlyPrice. The 'popular' flag highlights
 *              a plan with a save badge and primary button styling.
 *
 * @type {Array<{
 *   name: string,
 *   description: string,
 *   monthlyPrice: number,
 *   yearlyPrice: number,
 *   features: string[],
 *   cta: string,
 *   popular: boolean
 * }>}
 *
 * @property {string} name          - Plan name (e.g. 'Starter', 'Professional', 'Enterprise')
 * @property {string} description   - Short subtitle describing the plan's target audience
 * @property {number} monthlyPrice  - Price per month when billed monthly
 * @property {number} yearlyPrice   - Price per month when billed yearly (lower due to discount)
 * @property {string[]} features    - Array of included features shown as checkmark list items
 * @property {string} cta           - Call-to-action button text (e.g. 'Start Free Trial')
 * @property {boolean} popular      - Whether this plan is marked as "Most Popular" with special styling
 */
const pricingData = [
    {
        name: 'Starter',
        description: 'Perfect for small businesses getting started with AI',
        monthlyPrice: 299,
        yearlyPrice: 239,
        features: [
            '1 AI Chatbot',
            '1,000 conversations/mo',
            'Basic analytics',
            'Email support',
            'Standard integrations'
        ],
        cta: 'Start Free Trial',
        popular: false
    },
    {
        name: 'Professional',
        description: 'For growing businesses ready to scale',
        monthlyPrice: 699,
        yearlyPrice: 559,
        features: [
            '3 AI Chatbots',
            '10,000 conversations/mo',
            'Advanced analytics',
            'Priority support',
            'Custom integrations',
            'Workflow automation',
            'CRM integration'
        ],
        cta: 'Start Free Trial',
        popular: true
    },
    {
        name: 'Enterprise',
        description: 'For large organizations with complex needs',
        monthlyPrice: 1499,
        yearlyPrice: 1199,
        features: [
            'Unlimited chatbots',
            'Unlimited conversations',
            'Enterprise analytics',
            '24/7 dedicated support',
            'Custom AI models',
            'API access',
            'White-label option',
            'SLA guarantee'
        ],
        cta: 'Contact Sales',
        popular: false
    }
];

// ========== CASE STUDIES DATA ==========

/**
 * @description Array of client case studies showing before/after metrics.
 *              Used in two contexts:
 *                - renderCaseStudies() shows only the first 2 (homepage preview)
 *                - renderCaseStudiesFull() shows all entries (dedicated case studies page)
 *              Each study includes company branding, before/after comparison data,
 *              improvement highlights, a detailed narrative, duration, and services used.
 *
 * @type {Array<{
 *   company: string,
 *   industry: string,
 *   logo: string,
 *   logoBg: string,
 *   before: Object,
 *   after: Object,
 *   improvements: string[],
 *   detail: string,
 *   duration: string,
 *   services: string[]
 * }>}
 *
 * @property {string} company       - Client company name
 * @property {string} industry      - Client's industry sector
 * @property {string} logo          - 1-2 character abbreviation for the logo badge (e.g. 'TF')
 * @property {string} logoBg        - Tailwind gradient classes for the logo header background
 * @property {{leads: string, responseTime: string, conversionRate: string, costs: string}} before
 *                                    - Key metrics before BaGency engagement
 * @property {{leads: string, responseTime: string, conversionRate: string, costs: string}} after
 *                                    - Key metrics after BaGency engagement
 * @property {string[]} improvements - Array of improvement highlight badges (e.g. '+464% Leads')
 * @property {string} detail        - Multi-sentence narrative describing the engagement
 * @property {string} duration      - Engagement duration (e.g. '6 months')
 * @property {string[]} services    - List of BaGency services used in this engagement
 */
const caseStudiesData = [
    {
        company: 'TechFlow Inc.',
        industry: 'SaaS',
        logo: 'TF',
        logoBg: 'from-blue-500 to-blue-600',
        before: {
            leads: '150/month',
            responseTime: '4 hours',
            conversionRate: '2.3%',
            costs: '$12,000/month'
        },
        after: {
            leads: '847/month',
            responseTime: '< 30 seconds',
            conversionRate: '8.7%',
            costs: '$4,200/month'
        },
        improvements: ['+464% Leads', '65% Cost Reduction', '278% Conversion Boost'],
        detail: 'TechFlow Inc., a B2B SaaS company, struggled with slow lead response times and low conversion rates. By implementing our AI chatbot and CRM automation, they reduced response time from 4 hours to under 30 seconds and saw a 464% increase in qualified leads within 6 months.',
        duration: '6 months',
        services: ['AI Chatbots', 'CRM Automation', 'Lead Generation']
    },
    {
        company: 'GlobalRetail',
        industry: 'E-commerce',
        logo: 'GR',
        logoBg: 'from-orange-500 to-orange-600',
        before: {
            leads: '2,100/month',
            responseTime: '2 hours',
            conversionRate: '1.8%',
            costs: '$28,000/month'
        },
        after: {
            leads: '5,640/month',
            responseTime: 'Instant',
            conversionRate: '5.2%',
            costs: '$9,800/month'
        },
        improvements: ['+169% Leads', '65% Cost Reduction', '189% Conversion Boost'],
        detail: 'GlobalRetail needed to scale their customer support during peak seasons without proportional cost increases. Our AI automation handled 78% of customer inquiries automatically, while the remaining complex cases were intelligently routed to the right human agents.',
        duration: '4 months',
        services: ['AI Chatbots', 'Workflow Automation', 'AI Marketing']
    },
    {
        company: 'FinServe Pro',
        industry: 'Finance',
        logo: 'FP',
        logoBg: 'from-green-500 to-green-600',
        before: {
            leads: '80/month',
            responseTime: '24 hours',
            conversionRate: '1.1%',
            costs: '$18,000/month'
        },
        after: {
            leads: '520/month',
            responseTime: '< 1 minute',
            conversionRate: '6.4%',
            costs: '$6,500/month'
        },
        improvements: ['+550% Leads', '64% Cost Reduction', '482% Conversion Boost'],
        detail: 'FinServe Pro, a financial services firm, needed compliant AI solutions for lead qualification. We built a custom AI model that pre-qualifies leads based on financial criteria, reducing the sales team\'s workload while dramatically increasing close rates.',
        duration: '8 months',
        services: ['Lead Generation', 'Custom AI Solutions', 'CRM Automation']
    },
    {
        company: 'MediCare Plus',
        industry: 'Healthcare',
        logo: 'MP',
        logoBg: 'from-teal-500 to-teal-600',
        before: {
            leads: '200/month',
            responseTime: '6 hours',
            conversionRate: '3.2%',
            costs: '$22,000/month'
        },
        after: {
            leads: '980/month',
            responseTime: 'Instant',
            conversionRate: '9.1%',
            costs: '$8,200/month'
        },
        improvements: ['+390% Leads', '63% Cost Reduction', '184% Conversion Boost'],
        detail: 'MediCare Plus needed an HIPAA-compliant AI solution for patient engagement. Our custom chatbot handles appointment scheduling, answers common health queries, and routes urgent cases to medical staff — all while maintaining full regulatory compliance.',
        duration: '5 months',
        services: ['AI Chatbots', 'Custom AI Solutions', 'Workflow Automation']
    }
];

// ========== TESTIMONIALS DATA ==========

/**
 * @description Array of client testimonials rendered as cards in the slider.
 *              Each testimonial includes the client's photo (with initials fallback),
 *              star rating, quote text, a key metric badge, company branding, and
 *              author attribution. The slider shows 3 cards at a time on desktop.
 *
 * @type {Array<{
 *   name: string,
 *   role: string,
 *   company: string,
 *   avatar: string,
 *   avatarFallback: string,
 *   companyLogo: string,
 *   companyLogoBg: string,
 *   rating: number,
 *   text: string,
 *   metric: string
 * }>}
 *
 * @property {string} name            - Client's full name
 * @property {string} role            - Client's job title
 * @property {string} company         - Client's company name
 * @property {string} avatar          - URL to the client's headshot photo (Unsplash)
 * @property {string} avatarFallback  - 2-character initials shown when avatar fails to load
 * @property {string} companyLogo     - 2-character abbreviation for the company logo badge
 * @property {string} companyLogoBg   - Tailwind bg class for the company logo badge color
 * @property {number} rating          - Star rating from 1-5 (renders that many star icons)
 * @property {string} text            - The testimonial quote text
 * @property {string} metric          - A key result metric shown as a highlighted badge
 */
const testimonialsData = [
    {
        name: 'Sarah Johnson',
        role: 'CEO',
        company: 'TechFlow Inc.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        avatarFallback: 'SJ',
        companyLogo: 'TF',
        companyLogoBg: 'bg-blue-500',
        rating: 5,
        text: 'BaGency transformed our customer support. Our response time went from 4 hours to under 30 seconds. The AI chatbot handles 80% of queries automatically.',
        metric: '+210% leads in 3 months'
    },
    {
        name: 'Michael Chen',
        role: 'Operations Director',
        company: 'GlobalRetail',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        avatarFallback: 'MC',
        companyLogo: 'GR',
        companyLogoBg: 'bg-orange-500',
        rating: 5,
        text: 'The workflow automation has been a game-changer. We\'ve automated over 200 processes and saved $180,000 in the first year alone.',
        metric: '$180K saved annually'
    },
    {
        name: 'Emily Rodriguez',
        role: 'Marketing VP',
        company: 'StartupHub',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        avatarFallback: 'ER',
        companyLogo: 'SH',
        companyLogoBg: 'bg-purple-500',
        rating: 5,
        text: 'The AI marketing tools have doubled our conversion rates. Lead qualification is now fully automated, and our sales team only talks to qualified prospects.',
        metric: '2x conversion rate'
    },
    {
        name: 'David Park',
        role: 'CTO',
        company: 'FinanceFirst',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        avatarFallback: 'DP',
        companyLogo: 'FF',
        companyLogoBg: 'bg-green-500',
        rating: 5,
        text: 'Integration was seamless. The team at BaGency understood our complex requirements and delivered a custom solution that exceeded expectations.',
        metric: '3-day integration'
    },
    {
        name: 'Lisa Thompson',
        role: 'Customer Success Manager',
        company: 'SaaSPro',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        avatarFallback: 'LT',
        companyLogo: 'SP',
        companyLogoBg: 'bg-pink-500',
        rating: 5,
        text: 'Our customer satisfaction scores increased by 40% after implementing the AI chatbot. The 24/7 availability means we never miss a lead.',
        metric: '+40% CSAT score'
    },
    {
        name: 'James Wilson',
        role: 'Founder & CEO',
        company: 'NovaTech',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        avatarFallback: 'JW',
        companyLogo: 'NT',
        companyLogoBg: 'bg-cyan-500',
        rating: 5,
        text: 'BaGency\'s AI solutions helped us scale from 10 to 50 employees without adding operational overhead. The ROI has been incredible.',
        metric: '5x team scaling'
    }
];

// ========== FAQ DATA ==========

/**
 * @description Flat array of FAQ question-answer pairs. Used by renderFAQ() for the
 *              homepage FAQ section, and also referenced by faqCategories for the
 *              categorized FAQ page. Items are shared by reference (not copied).
 *
 * @type {Array<{
 *   question: string,
 *   answer: string
 * }>}
 *
 * @property {string} question - The FAQ question text displayed in the accordion trigger
 * @property {string} answer   - The FAQ answer text (plain text or HTML) shown when expanded
 */
const faqData = [
    {
        question: 'How quickly can I get started with BaGency?',
        answer: 'Most clients are up and running within 1-2 weeks. Our onboarding process includes a discovery call, strategy session, and implementation phase. For simple chatbot deployments, you could be live in as little as 48 hours.'
    },
    {
        question: 'Do I need technical knowledge to use the platform?',
        answer: 'Not at all! Our platform is designed for business users. The intuitive drag-and-drop interface requires no coding. Plus, our team provides full training and ongoing support to ensure you get the most out of your AI solutions.'
    },
    {
        question: 'What integrations do you support?',
        answer: 'We integrate with 200+ popular business tools including Salesforce, HubSpot, Slack, Zapier, Google Workspace, Microsoft 365, and many more. Custom integrations are available on Professional and Enterprise plans.'
    },
    {
        question: 'How does pricing work?',
        answer: 'We offer transparent, tiered pricing based on your usage needs. All plans include our core AI features, with higher tiers offering more conversations, advanced analytics, and premium support. Annual plans save you 20%.'
    },
    {
        question: 'What kind of ROI can I expect?',
        answer: 'Our clients typically see 200-400% ROI within the first year. On average, businesses save 40-60% on operational costs and see a 150%+ increase in lead conversion rates. Use our ROI calculator to estimate your specific savings.'
    },
    {
        question: 'Is my data secure?',
        answer: 'Absolutely. We are SOC 2 Type II compliant and use 256-bit encryption for all data. We never share or sell your data, and you maintain full ownership. We also offer on-premise deployment for Enterprise clients with strict data requirements.'
    },
    {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, all plans are month-to-month with no long-term commitment. You can cancel anytime from your dashboard. If you choose an annual plan, we offer prorated refunds for unused months.'
    },
    {
        question: 'Do you offer custom AI solutions?',
        answer: 'Yes! Our Enterprise plan includes custom AI model development tailored to your specific business needs. Our team of AI engineers can build bespoke solutions for unique use cases not covered by our standard offerings.'
    }
];

// ========== FAQ CATEGORIES ==========

/**
 * @description Categorized version of the FAQ data, organized into topic groups.
 *              Each key is a category name and each value is an array of faqData
 *              entries (shared references). Used by renderFAQCategories() on the
 *              dedicated faq.html page for a more navigable FAQ experience.
 *
 * @type {Object.<string, Array<{question: string, answer: string}>>}
 *
 * @property {string} key   - Category name displayed as a section header
 * @property {Array} value  - Array of FAQ items from faqData (same object references)
 */
const faqCategories = {
    'Getting Started': [
        faqData[0], faqData[1]
    ],
    'Pricing & Plans': [
        faqData[3], faqData[6]
    ],
    'Features & Integrations': [
        faqData[2], faqData[7]
    ],
    'Security & ROI': [
        faqData[4], faqData[5]
    ]
};

// ========== CHATBOT DEMO DATA ==========

/**
 * @description Initial chatbot script — defines the bot's opening message and
 *              suggested quick-reply options shown when the chatbot first loads.
 *              Only the first item's text is used directly by initChatbot();
 *              the options array is rendered as .quick-reply buttons in the HTML.
 *
 * @type {Array<{type: string, text?: string, options?: string[]}>}
 */
const chatbotScript = [
    { type: 'bot', text: '👋 Hi there! I\'m the BaGency AI Assistant. How can I help you today?' },
    { type: 'options', options: ['What services do you offer?', 'How much does it cost?', 'Book a demo'] }
];

/**
 * @description Lookup table of chatbot responses keyed by lowercased user message text.
 *              When a user message matches a key exactly, that response is returned.
 *              If no match is found, the 'default' key provides a helpful fallback response.
 *              Response text may contain '\n' newlines, which are rendered via
 *              whitespace-pre-line CSS in addBotMessage().
 *
 * @type {Object.<string, {type: string, text: string}>}
 *
 * @property {string} key   - Lowercased user message to match against
 * @property {string} text  - Bot's response text (supports \n for multi-line)
 */
const chatbotResponses = {
    'what services do you offer?': {
        type: 'bot',
        text: 'We offer a range of AI automation services:\n\n🤖 AI Chatbots - 24/7 customer support\n⚡ Workflow Automation - Streamline operations\n📊 CRM Automation - Manage relationships\n📣 AI Marketing - Smart campaigns\n🎯 Lead Generation - Capture & qualify leads\n\nWhich one interests you most?'
    },
    'how much does it cost?': {
        type: 'bot',
        text: 'Great question! Our pricing is flexible:\n\n💰 Starter: $299/mo - For small businesses\n💼 Professional: $699/mo - For growing teams\n🏢 Enterprise: Custom - For large organizations\n\nAll plans include a 14-day free trial. Would you like to see a detailed comparison?'
    },
    'book a demo': {
        type: 'bot',
        text: 'I\'d love to set up a demo for you! 🎉\n\nClick the link below to schedule a 30-minute consultation with our team:\n\n📅 [Book Your Free Demo](contact.html)\n\nOr I can help you with anything else right now!'
    },
    'default': {
        type: 'bot',
        text: 'I\'m here to help! You can ask me about:\n\n• Our AI services\n• Pricing and plans\n• Booking a demo\n• Technical questions\n\nOr type "human" to speak with a team member.'
    }
};

// ========== TEAM DATA ==========

/**
 * @description Array of team member profiles rendered on the about page.
 *              Each member has a photo (with initials fallback), name, role,
 *              a short bio, and social media links. Social links currently
 *              point to '#' placeholders.
 *
 * @type {Array<{
 *   name: string,
 *   role: string,
 *   avatar: string,
 *   avatarFallback: string,
 *   bio: string,
 *   social: {linkedin: string, twitter: string}
 * }>}
 *
 * @property {string} name           - Full name
 * @property {string} role           - Job title / position
 * @property {string} avatar         - URL to headshot photo (Unsplash)
 * @property {string} avatarFallback - 2-character initials for fallback display
 * @property {string} bio            - Short professional biography (1-2 sentences)
 * @property {{linkedin: string, twitter: string}} social
 *                                  - Social media profile URLs ('#' = placeholder)
 */
const teamData = [
    {
        name: 'Alex Morgan',
        role: 'CEO & Founder',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
        avatarFallback: 'AM',
        bio: 'Former Google AI engineer with 15+ years in machine learning. Alex founded BaGency to democratize AI for businesses of all sizes.',
        social: { linkedin: '#', twitter: '#' }
    },
    {
        name: 'Priya Sharma',
        role: 'CTO',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
        avatarFallback: 'PS',
        bio: 'MIT PhD in Computer Science, specializing in NLP. Priya leads our engineering team and drives our technical innovation.',
        social: { linkedin: '#', twitter: '#' }
    },
    {
        name: 'Marcus Johnson',
        role: 'VP of Sales',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
        avatarFallback: 'MJ',
        bio: '10+ years in enterprise SaaS sales. Marcus has helped hundreds of businesses find the right automation solutions.',
        social: { linkedin: '#', twitter: '#' }
    },
    {
        name: 'Sophie Chen',
        role: 'Head of Design',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
        avatarFallback: 'SC',
        bio: 'Award-winning UX designer who ensures our AI solutions are not just powerful, but intuitive and delightful to use.',
        social: { linkedin: '#', twitter: '#' }
    },
    {
        name: 'Daniel Kim',
        role: 'Lead AI Engineer',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
        avatarFallback: 'DK',
        bio: 'Deep learning specialist with expertise in conversational AI. Daniel builds the intelligent systems behind our chatbots.',
        social: { linkedin: '#', twitter: '#' }
    },
    {
        name: 'Rachel Torres',
        role: 'Customer Success Lead',
        avatar: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=200&h=200&fit=crop&crop=face',
        avatarFallback: 'RT',
        bio: 'Passionate about client success, Rachel ensures every customer achieves maximum value from their AI solutions.',
        social: { linkedin: '#', twitter: '#' }
    }
];

// ========== BLOG DATA ==========

/**
 * @description Array of blog posts rendered on the blog listing page.
 *              One post (the first with featured=true) is displayed as a large
 *              horizontal featured card spanning 2 columns. The rest are shown as
 *              standard vertical cards. Each post links to blog-single.html?id={id}.
 *
 * @type {Array<{
 *   id: number,
 *   title: string,
 *   excerpt: string,
 *   category: string,
 *   author: string,
 *   authorAvatar: string,
 *   authorFallback: string,
 *   date: string,
 *   readTime: string,
 *   image: string,
 *   featured: boolean
 * }>}
 *
 * @property {number} id             - Unique post identifier (used in blog-single.html URL query)
 * @property {string} title          - Blog post title
 * @property {string} excerpt        - Short summary text (2-3 sentences)
 * @property {string} category       - Topic category displayed as a badge (e.g. 'AI Chatbots')
 * @property {string} author         - Author's full name
 * @property {string} authorAvatar   - URL to author's small headshot (50x50 crop)
 * @property {string} authorFallback - 2-character initials for avatar fallback
 * @property {string} date           - Publication date formatted for display (e.g. 'Jan 15, 2026')
 * @property {string} readTime       - Estimated reading time (e.g. '8 min read')
 * @property {string} image          - URL to the post's cover/featured image (800x400 crop)
 * @property {boolean} featured      - Whether this post should be displayed as the featured hero post
 */
const blogData = [
    {
        id: 1,
        title: 'How AI Chatbots Are Revolutionizing Customer Support in 2026',
        excerpt: 'Discover how businesses are using AI-powered chatbots to deliver 24/7 support, reduce response times by 90%, and increase customer satisfaction scores.',
        category: 'AI Chatbots',
        author: 'Alex Morgan',
        authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face',
        authorFallback: 'AM',
        date: 'Jan 19, 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        featured: true
    },
    {
        id: 2,
        title: 'The Complete Guide to Workflow Automation for Small Businesses',
        excerpt: 'Step-by-step guide to automating your business workflows. Learn which processes to automate first and how to measure ROI.',
        category: 'Automation',
        author: 'Priya Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&h=50&fit=crop&crop=face',
        authorFallback: 'PS',
        date: 'Jan 10, 2026',
        readTime: '12 min read',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        featured: false
    },
    {
        id: 3,
        title: 'ROI of AI: What to Expect in Your First Year',
        excerpt: 'Real data from 500+ clients showing typical ROI timelines, cost savings, and revenue impact of AI automation.',
        category: 'ROI & Analytics',
        author: 'Marcus Johnson',
        authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=50&h=50&fit=crop&crop=face',
        authorFallback: 'MJ',
        date: 'Jan 5, 2026',
        readTime: '10 min read',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        featured: false
    },
    {
        id: 4,
        title: '5 CRM Automation Strategies That Boost Sales by 150%',
        excerpt: 'Proven CRM automation techniques that help sales teams close more deals with less effort. Includes real case studies.',
        category: 'CRM',
        author: 'Sophie Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face',
        authorFallback: 'SC',
        date: 'Jan 28, 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
        featured: false
    },
    {
        id: 5,
        title: 'AI Marketing: Personalization at Scale Without the Complexity',
        excerpt: 'How to leverage AI for hyper-personalized marketing campaigns that drive engagement and conversions across every channel.',
        category: 'AI Marketing',
        author: 'Rachel Torres',
        authorAvatar: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=50&h=50&fit=crop&crop=face',
        authorFallback: 'RT',
        date: 'Jan 20, 2026',
        readTime: '9 min read',
        image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=400&fit=crop',
        featured: false
    },
    {
        id: 6,
        title: 'Choosing the Right AI Partner: A Buyer\'s Guide',
        excerpt: 'Essential criteria for evaluating AI automation vendors. What questions to ask, red flags to watch for, and how to make the right choice.',
        category: 'Guides',
        author: 'Daniel Kim',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face',
        authorFallback: 'DK',
        date: 'Feb 15, 2026',
        readTime: '11 min read',
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
        featured: false
    }
];
