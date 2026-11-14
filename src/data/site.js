// ─────────────────────────────────────────────────────────────────────────────
// All copy on this site is taken verbatim from the original LeadNex AI repo
// (src/components/{hero,demo,workflow,features,pricing,compliance,testimonial,lead}).
// Nothing here is invented — only reorganised into one data file so every
// section renders from a single source of truth.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'LeadNex',
  legal: 'LeadNex AI, Inc.',
  email: 'hello@leadnex.ai',
  founded: 2023,
  tagline: 'Enterprise AI calling agent',
};

export const nav = {
  links: [
    { number: '01', label: 'Home', to: '/' },
    { number: '02', label: 'Features', to: '/features' },
    { number: '03', label: 'Pricing', to: '/pricing' },
  ],
  signIn: 'Sign In',
  cta: 'Book a Demo',
  contact: { label: 'Book a Demo', to: '/#contact' },
};

/* ── Hero ───────────────────────────────────────────────────────────────── */
export const hero = {
  badge: 'Powered by Advanced AI Voice Models',
  headline: ['Voice agents that', 'close deals', 'while you sleep'],
  description:
    'Deploy human-like AI calling agents that handle inbound and outbound calls 24/7. Qualify leads, book meetings, and close sales — at enterprise scale.',
  trust: [
    { stat: '10M+', label: 'Calls Handled' },
    { stat: '98.7%', label: 'Human Score' },
    { stat: '<300ms', label: 'Latency' },
    { stat: '24/7', label: 'Uptime' },
  ],
  primaryCta: 'Book a Demo',
  secondaryCta: 'Watch Demo',
  compliance: [
    { label: 'SOC 2 Type II' },
    { label: 'GDPR Compliant' },
    { label: 'HIPAA Ready' },
  ],
  marqueeLabel: 'Trusted by revenue teams at',
  logos: ['Acme Corp', 'TechFlow', 'Meridian', 'Quantum Health', 'Apex Realty', 'NovaStar'],
  stats: [
    { value: 98, suffix: '%', label: 'Accuracy Rate' },
    { value: 10, suffix: 'M+', label: 'Calls Handled' },
    { value: 65, suffix: '%', label: 'Conversion Lift' },
    { value: 99.99, suffix: '%', label: 'Uptime SLA', decimals: 2 },
  ],
  transcript: [
    { role: 'ai', text: "Hi, I'm calling about your inquiry — is now a good time?" },
    { role: 'user', text: 'Sure, go ahead.' },
    { role: 'ai', text: 'Great — I can get you booked in for Thursday at 2 PM.' },
    { role: 'user', text: "That works, let's do it." },
    { role: 'ai', text: "Perfect, you're all set. Sending a calendar invite now." },
  ],
  dashboard: {
    title: 'AI Agent Dashboard',
    subtitle: 'Real-time monitoring',
    live: 'Live',
    metrics: [
      { label: 'Active Calls', value: 247 },
      { label: 'Qualified', value: 89 },
      { label: 'Leads Today', value: 1247 },
    ],
    call: {
      name: 'Paras Yadav',
      meta: 'Enterprise Lead · Live',
      status: 'Qualifying',
    },
    roi: { label: 'Monthly ROI', value: '+312%' },
    floating: [
      { label: 'Conversion', value: '65.4%' },
      { label: 'Calls Today', value: '2,847' },
    ],
  },
};

/* ── 01 · Live demo ─────────────────────────────────────────────────────── */
export const demo = {
  index: '01',
  badge: 'Live Demo',
  title: 'Experience the AI',
  titleAccent: 'In Action',
  subtitle:
    'Try our AI calling agent yourself. Select a scenario, start the call, and watch the conversation unfold in real-time.',
  scenarios: [
    {
      id: 'sales',
      title: 'Sales Outreach',
      opener:
        "Hi there! I'm calling from LeadNex AI. We help companies automate their sales calls and increase conversion rates by up to 65%. Do you have a moment?",
    },
    {
      id: 'support',
      title: 'Customer Support',
      opener:
        "Thank you for calling LeadNex support. I'm your AI assistant. How can I help you today?",
    },
    {
      id: 'appointment',
      title: 'Appointment Booking',
      opener:
        "Hi! I'm calling from Dr. Smith's office to confirm your upcoming appointment. Is this a good time?",
    },
    {
      id: 'realestate',
      title: 'Real Estate',
      opener:
        'Good afternoon! I\u2019m calling regarding your inquiry about the 3-bedroom home at 245 Oak Street. Are you still interested in scheduling a viewing?',
    },
  ],
  voices: [
    { id: 'sarah', name: 'Sarah (Support Voice)' },
    { id: 'marcus', name: 'Marcus (Sales Voice)' },
    { id: 'rachel', name: 'Rachel (Executive Voice)' },
  ],
  replies: {
    pricing:
      'Our plans start at $99/month for a single agent, scaling to custom Enterprise pricing for high volume. Want me to break down what fits your call volume?',
    booking:
      'I can get that on the calendar right now. I have openings Thursday at 2 PM or Friday at 11 AM — which works better for you?',
    integration:
      'We connect natively with Salesforce & HubSpot, plus 50+ other tools via API and webhooks. Integration usually takes under a day.',
    security:
      "We're SOC 2 Type II certified, GDPR and HIPAA compliant, with AES-256 encryption end to end — your data never trains our models.",
    escalate:
      "Of course — I'll flag this for a member of our team and hand off the full transcript so you don't have to repeat anything.",
    greeting:
      "Hi! Thanks for calling LeadNex AI. I'm your AI agent — happy to answer questions or get you booked in.",
    fallback: [
      "Got it — tell me a bit more about what you're looking for and I'll point you in the right direction.",
      "That's a great question. Based on what similar teams do, I'd recommend starting with a quick pilot on your highest-volume line.",
    ],
  },
  panel: {
    kicker: 'Platform Advantages',
    title: 'See Why Teams Switch to',
    titleAccent: 'LeadNex AI',
    body:
      'Our AI agents handle complex multi-turn conversations with contextual understanding, sentiment analysis, and real-time decision making. Every call is an opportunity.',
    highlights: [
      { title: 'Natural Voice', desc: 'Indistinguishable from human agents', tag: '99.4% Match' },
      { title: 'Real-Time Analytics', desc: 'Track every conversation metric', tag: 'Live Sync' },
      { title: 'Instant Response', desc: '< 300ms latency on every call', tag: '<300ms Delay' },
    ],
    logs: [
      'Inbound call qualified: VP of Sales (TechFlow)',
      'Meeting booked: Thursday at 2:00 PM with Dr. Smith',
      'Outbound call qualified: 94% BANT Match (Apex Realty)',
      'CRM sync complete: Lead status changed to Qualified',
      'Uptime check: All 12 edge nodes operational (99.99% SLA)',
      'Outbound campaign active: 150 concurrent calls connected',
    ],
    integrations: ['Salesforce', 'HubSpot', 'Twilio', 'Zapier'],
    stats: [
      { label: 'Avg Call Duration', value: '+14%', note: 'vs Human reps' },
      { label: 'Booking Conversion', value: '3.2x', note: 'Industry Standard' },
      { label: 'CRM Auto-Sync Speed', value: '<1s', note: 'Zero manual entry' },
      { label: 'Compliance Score', value: 'SOC2', note: '& HIPAA Ready' },
    ],
  },
};

/* ── 02 · How it works ──────────────────────────────────────────────────── */
export const workflow = {
  index: '02',
  badge: 'How LeadNex AI works',
  title: 'One call, six things',
  titleAccent: 'happen automatically',
  subtitle:
    'From the first ring to a clean CRM record — no queue, no manual scoring, no missed opportunity.',
  steps: [
    {
      title: 'A lead calls in',
      body:
        'Inbound or outbound, the call reaches your AI agent instantly — no queue, no voicemail, no missed opportunity.',
      detail: 'Routed in 240ms — no queue',
    },
    {
      title: 'The AI answers',
      body:
        'A natural, on-brand voice picks up on the first ring and starts a real conversation, not an IVR tree.',
      detail: 'Natural voice · first ring pickup',
    },
    {
      title: 'It qualifies the lead',
      body:
        'Budget, authority, need, and timeline are assessed live against your playbook — no manual scoring.',
      detail: 'Budget confirmed · Decision maker · Timeline: this quarter',
    },
    {
      title: 'A meeting gets booked',
      body: 'The agent books straight into your calendar and confirms with the lead.',
      detail: 'Thu, 2:30 PM booked · Confirmation sent automatically',
    },
    {
      title: 'The CRM updates itself',
      body: 'Call notes, lead status and next steps are written back without anyone typing.',
      detail: 'Demo scheduled · CRM updated',
    },
    {
      title: 'Analytics updates',
      body:
        'Conversion, sentiment, and pipeline dashboards update in real time, so the next call is sharper.',
      detail: 'Conversion tracked this week',
    },
  ],
  qualification: ['Budget confirmed', 'Decision maker', 'Timeline: this quarter', 'Highly qualified'],
  booking: { slot: 'Thu, 2:30 PM booked', note: 'Confirmation sent automatically', title: 'Demo scheduled' },
  conversation: [
    { role: 'user', text: "Hi, I'm calling about the enterprise plan..." },
    { role: 'ai', text: 'I can help with that — how many seats?' },
  ],
};

/* ── 03 · Features ──────────────────────────────────────────────────────── */
export const features = {
  index: '03',
  badge: 'Enterprise Features',
  title: 'Everything You Need to',
  titleAccent: 'Automate Calls at Scale',
  subtitle:
    'A battle-tested AI calling infrastructure built for high-volume sales, support, and revenue operations.',
  cards: [
    {
      code: 'CORE VOICE ENGINE',
      title: 'Autonomous Inbound & Outbound Calling',
      body:
        'Handle 10,000+ concurrent calls simultaneously. AI agents understand context, handle objections, and navigate complex phone trees with zero human lag.',
      widget: {
        kind: 'call',
        rows: [
          'LIVE CALL #8492 — Active Outbound',
          'Agent Speech: Pitching Enterprise Tier',
          'Sentiment: Positive (96%)',
        ],
      },
      wide: true,
    },
    {
      code: 'HUMAN-PARITY SPEED',
      title: 'Sub-300ms Latency',
      body: 'Feels like talking to a human. Zero awkward pauses or robotic delays.',
      note: 'Faster than human reaction time',
      widget: { kind: 'meter', value: 92, label: '<300ms' },
    },
    {
      code: 'BRAND IDENTITY',
      title: 'Instant Voice Cloning',
      body: "Clone your top sales rep's voice in 60 seconds. Maintain brand consistency everywhere.",
      widget: {
        kind: 'voice',
        title: 'Voice DNA Profile',
        rows: ['Sarah (Sales VP Accent)', 'Pitch Accent: US Executive'],
      },
    },
    {
      code: 'GLOBAL REACH',
      title: '30+ Native Languages',
      body: 'Detect customer language automatically and switch accents in real-time.',
      widget: { kind: 'langs' },
    },
    {
      code: 'ECOSYSTEM',
      title: '50+ Native Integrations',
      body: 'Auto-log call notes, update lead statuses, and trigger calendar invites.',
      widget: { kind: 'integrations' },
    },
    {
      code: 'REVENUE INTELLIGENCE',
      title: 'Live Call Telemetry & Sentiment Analytics',
      body:
        'Get granular insights into objection trends, win rates, talk-to-listen ratios, and customer sentiment metrics instantly after every call.',
      widget: {
        kind: 'telemetry',
        rows: [
          { label: 'Avg Call Duration', value: '+14%', note: 'vs Human reps' },
          { label: 'Booking Conversion', value: '3.2x', note: 'Industry Standard' },
          { label: 'CRM Auto-Sync Speed', value: '<1s', note: 'Zero manual entry' },
          { label: 'Compliance Score', value: 'SOC2', note: '& HIPAA Ready' },
        ],
      },
      wide: true,
    },
  ],
  integrations: ['Salesforce', 'HubSpot', 'Twilio', 'Zapier', 'Pipedrive', 'Zoho', 'Slack', 'Calendly'],
  languages: ['EN', 'ES', 'HI', 'AR', 'FR', 'DE', 'PT', 'JA', 'ZH', 'KO', 'IT', 'NL'],
  comparison: {
    title: 'Traditional Call Centers vs',
    titleAccent: 'LeadNex AI Agent',
    subtitle:
      'See why modern sales teams are replacing traditional offshore call centers with autonomous AI agents.',
    columns: ['Capability / Metric', 'Traditional Call Centers', 'LeadNex AI Agent'],
    rows: [
      { label: 'Available 24/7/365 without shift gaps', old: 'No (High Overtime Cost)', now: 'Yes (100% Uptime)' },
      { label: 'Concurrent Call Scaling Capacity', old: 'Limited to Seat Count', now: 'Unlimited (10,000+ Calls)' },
      { label: 'Average Response Delay (Latency)', old: '3 - 15 Seconds', now: 'Sub-300ms (Instant)' },
      { label: 'Automatic CRM Logging & Transcript Sync', old: 'Manual (Prone to Error)', now: 'Instant Real-time Sync' },
      { label: 'Training & Onboarding Time', old: 'Weeks of Ramp-Up', now: 'Instant (Upload Playbook)' },
      { label: 'Average Cost Per Completed Call', old: '$3.50 - $6.00 / call', now: '< $0.10 / call' },
    ],
  },
};

/* ── 04 · Testimonials ──────────────────────────────────────────────────── */
export const testimonials = {
  index: '04',
  badge: 'Testimonials',
  title: 'Loved by Teams',
  titleAccent: 'Worldwide',
  subtitle:
    'See how leading companies are transforming their operations with AI-powered calling agents.',
  cloudLabel: 'Trusted by industry-leading companies worldwide',
  items: [
    {
      name: 'Marcus Chen',
      role: 'VP of Sales',
      company: 'TechFlow',
      quote:
        'LeadNex AI replaced our entire SDR team for outbound calls. The AI agents book 3x more meetings than our human reps ever did, and the quality of qualified leads has skyrocketed.',
      metric: '300%',
      metricLabel: 'Increase in qualified meetings',
    },
    {
      name: 'Sarah Williams',
      role: 'Head of Operations',
      company: 'Quantum Health',
      quote:
        'We handle over 50,000 patient calls monthly. LeadNex reduced our wait times from 8 minutes to under 10 seconds while maintaining HIPAA compliance. Game-changer for healthcare.',
      metric: '80%',
      metricLabel: 'Reduction in operational costs',
    },
    {
      name: 'David Park',
      role: 'CEO',
      company: 'Apex Realty',
      quote:
        'Every missed call was a lost deal. Since deploying LeadNex, we capture 100% of leads and our agents can focus on closing instead of cold calling. ROI was visible in week one.',
      metric: '2.5x',
      metricLabel: 'More deals closed per month',
    },
    {
      name: 'Elena Rodriguez',
      role: 'CTO',
      company: 'NovaStar',
      quote:
        'The API integration took less than a day. Voice quality is indistinguishable from humans. Our customers genuinely cannot tell they are speaking with an AI agent.',
      metric: '99.8%',
      metricLabel: 'Customer satisfaction score',
    },
    {
      name: 'James Morrison',
      role: 'Director of Sales',
      company: 'Meridian',
      quote:
        'We scaled from 500 to 50,000 daily outbound calls without hiring a single new rep. LeadNex handles objections better than most of our top performers.',
      metric: '100x',
      metricLabel: 'Scale without additional headcount',
    },
    {
      name: 'Priya Sharma',
      role: 'COO',
      company: 'Pinnacle',
      quote:
        'The multi-language support is incredible. We serve customers in 12 languages across 30 countries, all with the same AI agent.',
      metric: '12',
      metricLabel: 'Languages supported seamlessly',
    },
  ],
};

/* ── 05 · Pricing ───────────────────────────────────────────────────────── */
export const pricing = {
  index: '05',
  badge: 'Pricing',
  title: 'Simple, Transparent',
  titleAccent: 'Pricing',
  subtitle:
    'No hidden fees. No surprises. Choose the plan that fits your team and scale as you grow.',
  monthly: 'Monthly',
  yearly: 'Yearly',
  yearlyNote: 'Save 20%',
  plans: [
    {
      name: 'Starter',
      price: '$99',
      yearlyPrice: '$79',
      description: 'Perfect for small teams getting started with AI calling.',
      features: [
        '1 AI Voice Agent',
        '500 minutes per month',
        '5 concurrent calls',
        'Basic analytics',
        '2 CRM integrations',
        'Email support',
        'Call recording',
        'Standard voices',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Growth',
      price: '$399',
      yearlyPrice: '$319',
      description: 'For growing teams that need advanced AI capabilities.',
      features: [
        '5 AI Voice Agents',
        '5,000 minutes per month',
        '50 concurrent calls',
        'Advanced analytics',
        '10 CRM integrations',
        'Priority support',
        'Voice cloning',
        'Multi-language support',
        'Custom knowledge base',
        'API access',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      yearlyPrice: 'Custom',
      description: 'For large organizations with custom requirements.',
      features: [
        'Unlimited AI Voice Agents',
        'Unlimited minutes',
        'Unlimited concurrent calls',
        'Enterprise analytics',
        'Unlimited integrations',
        'Dedicated support manager',
        'Custom voice models',
        'HIPAA / SOC2 compliance',
        '99.99% SLA guarantee',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ],
  guarantees: [
    'Money-back guarantee',
    'No credit card required',
    'Cancel anytime',
  ],
  comparison: {
    title: 'Compare Plans',
    columns: ['Starter', 'Growth', 'Enterprise'],
    rows: [
      { name: 'AI Voice Agents', values: ['1', '5', 'Unlimited'] },
      { name: 'Monthly Minutes', values: ['500', '5,000', 'Unlimited'] },
      { name: 'Concurrent Calls', values: ['5', '50', 'Unlimited'] },
      { name: 'Voice Cloning', values: [false, true, true] },
      { name: 'CRM Integrations', values: ['2', '10', 'Unlimited'] },
      { name: 'Analytics Dashboard', values: ['Basic', 'Advanced', 'Enterprise'] },
      { name: 'Multi-Language', values: [false, true, true] },
      { name: 'Custom Knowledge Base', values: [false, true, true] },
      { name: 'API Access', values: [false, true, true] },
      { name: 'Dedicated Support', values: [false, false, true] },
      { name: 'SLA Guarantee', values: [false, '99.9%', '99.99%'] },
      { name: 'HIPAA Compliance', values: [false, false, true] },
    ],
  },
};

/* ── 06 · Security & compliance ─────────────────────────────────────────── */
export const security = {
  index: '06',
  badge: 'Security & Compliance',
  title: 'Enterprise-Grade',
  titleAccent: 'Security',
  subtitle:
    'Protect every conversation with encryption, access controls, auditability, and compliance-ready infrastructure.',
  flowLabel: 'SECURE PIPELINE / ACTIVE',
  flowTitle: 'Every conversation, secured end to end',
  flowSubtitle:
    'Watch a conversation move through encryption, policy checks, and secure storage in real-time.',
  flow: [
    { title: 'Call Captured', meta: 'Voice Session' },
    { title: 'Encrypted in Transit', meta: 'TLS 1.3 Protocol' },
    { title: 'Policy Checked', meta: 'RBAC Controls' },
    { title: 'Stored Securely', meta: 'AES-256 Standard' },
  ],
  badgesLabel: 'Certifications & Controls',
  badges: [
    'SOC 2 Type II',
    'GDPR',
    'HIPAA',
    'ISO 27001',
    'CCPA',
    'AES-256',
    'Audit Logs',
    '99.99% Uptime',
  ],
  ctaTitle: 'Need a custom security review?',
  ctaBody: "Talk to our team about your organization's requirements.",
  ctaLabel: 'REQUEST SECURITY REVIEW →',
};

/* ── 07 · FAQ ───────────────────────────────────────────────────────────── */
export const faq = {
  index: '07',
  badge: 'FAQ / SUPPORT',
  title: 'Frequently Asked Questions',
  subtitle: 'Everything you need to know about deploying and scaling LeadNex AI.',
  searchPlaceholder: 'Search questions...',
  empty: 'No questions match your search.',
  items: [
    {
      q: 'How quickly can I set up LeadNex AI?',
      a: 'Most teams are up and running in under 5 minutes. Simply connect your phone system, upload your knowledge base, and configure your AI agent. Our onboarding team provides hands-on support for enterprise deployments.',
    },
    {
      q: 'Is the AI voice really indistinguishable from humans?',
      a: 'Yes. Our proprietary voice models achieve a 98.7% human-likeness score in blind tests. We offer 50+ natural voices across 30+ languages, plus custom voice cloning for enterprise clients.',
    },
    {
      q: "What happens when the AI can't answer something?",
      a: 'LeadNex AI seamlessly escalates to a human agent when it detects complex situations, high-emotion conversations, or topics outside its knowledge base. The handoff is smooth and contextual — the human agent receives the full transcript and summary.',
    },
    {
      q: 'How does pricing work for high-volume calling?',
      a: 'Our Growth and Enterprise plans are designed for scale. Enterprise clients receive custom per-minute pricing that decreases with volume. Contact our sales team for a personalized quote based on your expected call volume.',
    },
    {
      q: 'Can LeadNex AI integrate with my existing CRM?',
      a: 'Absolutely. We offer native integrations with Salesforce, HubSpot, Pipedrive, Zoho, and 50+ other tools. Our REST API and webhooks enable custom integrations with any system.',
    },
    {
      q: 'Is my data secure and compliant?',
      a: 'Yes. LeadNex AI is SOC 2 Type II certified, GDPR compliant, and HIPAA ready. All data is encrypted with AES-256 at rest and TLS 1.3 in transit. We never use your data to train our models.',
    },
  ],
};

/* ── Lead capture / book a demo ─────────────────────────────────────────── */
export const lead = {
  index: '08',
  badge: 'Get Started',
  title: 'Start Automating',
  titleAccent: 'Your Calls',
  subtitle:
    'Book a personalized demo or start your free trial. No credit card required. Setup takes less than 5 minutes.',
  bookTitle: 'See LeadNex AI handle live calls',
  benefits: [
    'See LeadNex AI handle live calls',
    'Get a custom ROI analysis',
    'Learn about enterprise features',
    'Discuss your specific use case',
    'See CRM integrations in action',
  ],
  calendarKicker: 'Calling Operations?',
  calendar: [
    { title: '30 Minutes', note: 'Quick & focused' },
    { title: 'Video Call', note: 'Screen sharing' },
  ],
  calendarNote: 'Calendar integration available — select a time that works for your team',
  pickDate: 'Pick a Date',
  flexible: 'Flexible scheduling',
  industries: [
    'SaaS / Technology',
    'Healthcare',
    'Real Estate',
    'Financial Services',
    'E-commerce',
    'Solar / Energy',
    'Mortgage / Lending',
    'Automotive',
  ],
  volumes: ['Under 1,000', '1,000 - 5,000', '5,000 - 25,000', '25,000 - 100,000'],
  fields: {
    name: 'Full Name *',
    email: 'Work Email *',
    phone: 'Phone Number',
    company: 'Company Name *',
    industry: 'Select industry',
    volume: 'Monthly Call Volume',
    volumePlaceholder: 'Select volume',
    message: 'Tell us about your use case...',
    consent:
      "I agree to LeadNex AI's Privacy Policy and consent to receiving communications about products, services, and events. You can unsubscribe at any time.",
  },
  errors: {
    name: 'Full name is required.',
    email: 'Work email is required.',
    emailInvalid: 'Enter a valid email address.',
    company: 'Company name is required.',
    consent: 'Please accept the privacy policy to continue.',
  },
  submit: 'Book a Demo',
  trial: 'Start Free Trial',
  successTitle: "We've received your request.",
  successBody:
    'Our team will reach out within 24 hours to schedule your personalized demo.',
};

/* ── Closing CTA banner ─────────────────────────────────────────────────── */
export const ctaBanner = {
  eyebrow: 'Limited Time — 14-Day Free Trial',
  title: 'Start Closing Deals',
  titleAccent: 'Not Calling Lists.',
  primary: 'Start Free Trial',
  secondary: 'Talk to Sales',
  points: ['No credit card required', 'Cancel anytime', 'Full feature access'],
};

/* ── Footer ─────────────────────────────────────────────────────────────── */
export const footer = {
  kicker: 'LeadNex AI · Est. 2023',
  headline: "Let's put your calls",
  headlineAccent: 'on autopilot.',
  link: 'Start your free trial',
  description:
    'Enterprise AI calling agents that handle millions of conversations with human-like precision.',
  newsletter: {
    label: 'Subscribe to updates',
    placeholder: 'Enter your email',
    cta: 'Subscribe',
    success: 'Subscribed — thanks for joining!',
    error: 'Enter a valid email address.',
  },
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'AI Voice Agent', href: '/#features' },
        { label: 'Inbound Calls', href: '/#demo' },
        { label: 'Outbound Calls', href: '/#demo' },
        { label: 'Voice Cloning', href: '/#features' },
        { label: 'Analytics', href: '/#compliance' },
        { label: 'Integrations', href: '/#features' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Sales Teams', href: '/#how-it-works' },
        { label: 'Support Centers', href: '/#demo' },
        { label: 'Healthcare' },
        { label: 'Real Estate' },
        { label: 'Insurance' },
        { label: 'Financial Services' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation' },
        { label: 'API Reference' },
        { label: 'Blog' },
        { label: 'Case Studies', href: '/#testimonials' },
        { label: 'Webinars' },
        { label: 'Community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us' },
        { label: 'Careers' },
        { label: 'Press' },
        { label: 'Contact', href: '/#contact' },
        { label: 'Partners' },
        { label: 'Security', href: '/#compliance' },
      ],
    },
  ],
  socials: ['Website', 'Community', 'Blog', 'Tutorials'],
  legalLinks: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};
