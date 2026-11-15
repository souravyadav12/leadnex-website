// ─────────────────────────────────────────────────────────────────────────────
// LEADNEX.AI — Single Source of Truth for Platform Copy & Configuration
// Enterprise AI Calling, Autonomous Voice Agents, and Conversation Intelligence
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'LEADNEX.AI',
  legal: 'LEADNEX.AI Inc.',
  email: 'contact@leadnex.ai',
  founded: 2021,
  tagline: 'Enterprise AI Calling & Autonomous Voice Agents',
};

export const nav = {
  links: [
    { number: '01', label: 'Home', to: '/' },
    { number: '02', label: 'Features', to: '/features' },
    { number: '03', label: 'Pricing', to: '/pricing' },
    { number: '04', label: 'Contact', to: '/#contact' },
  ],
  cta: 'Book a Demo',
};

/* ── Hero ───────────────────────────────────────────────────────────────── */
export const hero = {
  badge: 'ENTERPRISE AI CALLING · HEADQUARTERS SIMULATION',
  headline: ['AI CALLING.', 'BUILT FOR REAL', 'CONVERSATIONS.'],
  description:
    'Automate customer conversations, qualify leads, follow up instantly and scale your business with intelligent AI-powered voice agents.',
  supportingText:
    'Ultra-low latency (<300ms), 40+ native languages, bi-directional CRM sync with Salesforce and HubSpot, and zero human wait times.',
  trust: [
    { stat: '10M+', label: 'Calls Connected' },
    { stat: '<300ms', label: 'Voice Latency' },
    { stat: '99.9%', label: 'Platform SLA' },
  ],
  primaryCta: 'Explore AI Calling',
  secondaryCta: 'Book a Demo',
  compliance: [
    { label: 'SOC 2 Type II Certified' },
    { label: 'HIPAA & GDPR Ready' },
    { label: '<300ms Voice Latency' },
  ],
  marqueeLabel: 'Native Telephony & CRM Ecosystem',
  logos: ['Salesforce', 'HubSpot', 'Twilio', 'Zapier', 'Pipedrive', 'AWS Connect', 'Zendesk', 'Stripe'],
  stats: [
    { value: 10, suffix: 'M+', label: 'Calls Connected' },
    { value: 280, suffix: 'ms', label: 'Response Latency' },
    { value: 40, suffix: '+', label: 'Native Languages' },
    { value: 99.9, suffix: '%', label: 'Platform Uptime', decimals: 1 },
  ],
  transcript: [
    { role: 'ai', text: 'Hello! This is Sarah from LEADNEX.AI. I noticed you requested an enterprise voice demo — do you have 2 minutes?' },
    { role: 'user', text: 'Yes, we handle around 30,000 inbound support calls a month and need faster response times.' },
    { role: 'ai', text: 'LEADNEX handles 30,000 calls concurrently with sub-300ms latency and 100% first-ring pickup. Would Thursday at 2 PM work for an architecture walkthrough?' },
    { role: 'user', text: 'Thursday at 2 PM works perfectly.' },
    { role: 'ai', text: 'Confirmed! Calendar invite and briefing notes sent to your inbox. Looking forward to speaking!' },
  ],
  dashboard: {
    title: 'LEADNEX Telephony Grid',
    subtitle: 'Global Voice Agent Orchestrator',
    live: 'Live Engine',
    metrics: [
      { label: 'Active Voice Agents', value: 340 },
      { label: 'Concurrent Calls', value: 8420 },
      { label: 'Avg Latency', value: 280 },
    ],
    call: {
      name: 'Global Enterprise Route',
      meta: 'High-Concurrency Neural Audio · Active',
      status: 'Connected',
    },
    roi: { label: 'Audio Quality MOS', value: '4.9/5' },
    floating: [
      { label: 'Voice Pipeline', value: '40+ Languages' },
      { label: 'Speed-to-Lead', value: '< 12s Auto Dial' },
    ],
  },
  floatingLabels: [
    'Voice Agent Live',
    'Real-time Synthesis',
    'Sentiment Detection',
    'CRM Auto-Sync',
    'Zero Hold Times',
    'Low-Latency Edge',
    'BANT Qualification',
  ],
};

/* ── 01 · Live demo ─────────────────────────────────────────────────────── */
export const demo = {
  index: '01',
  badge: 'Interactive Voice Simulation',
  title: 'Experience LEADNEX',
  titleAccent: 'In Real-Time',
  subtitle:
    'Try our autonomous AI calling agent yourself. Select a scenario, start the call, and watch natural, human-grade voice synthesis unfold.',
  scenarios: [
    {
      id: 'sales',
      title: 'Outbound Sales Outreach',
      opener:
        "Hi there! I'm calling from LEADNEX.AI. We help high-growth sales teams automate outbound speed-to-lead and book 3x more meetings. Do you have a quick moment?",
    },
    {
      id: 'support',
      title: 'Inbound Support & Reception',
      opener:
        "Thank you for calling LEADNEX.AI headquarters. I'm your autonomous assistant Sarah. How can I direct your call or assist you today?",
    },
    {
      id: 'appointment',
      title: 'Automated Calendar Booking',
      opener:
        "Hello! I'm calling from LEADNEX Concierge to confirm your upcoming strategy session. Is this still a great time for you?",
    },
    {
      id: 'realestate',
      title: 'Real Estate Lead Qualification',
      opener:
        'Good afternoon! I’m calling regarding your inquiry for the premium commercial property on Park Avenue. Are you looking to schedule an on-site walkthrough?',
    },
  ],
  voices: [
    { id: 'sarah', name: 'Sarah (Executive Conversational)' },
    { id: 'marcus', name: 'Marcus (Enterprise B2B Sales)' },
    { id: 'rachel', name: 'Rachel (Support & Customer Care)' },
  ],
  replies: {
    pricing:
      'LEADNEX plans start at $99/month for early teams, scaling to high-concurrency custom Enterprise tiers with volume pricing. Would you like a breakdown for your call volume?',
    booking:
      'I can confirm that right now on the calendar. We have slots open Thursday at 2 PM or Friday at 11 AM EST — which one fits your schedule?',
    integration:
      'LEADNEX connects natively with Salesforce, HubSpot, Twilio, and Zapier, plus REST webhooks. Full setup usually takes under 15 minutes.',
    security:
      'We are SOC 2 Type II certified, GDPR compliant, and HIPAA ready with AES-256 encryption. Your call data is never used to train public models.',
    escalate:
      'Of course — I will immediately route this to a Senior Solutions Specialist and hand over the live transcript with zero hold time.',
    greeting:
      "Hi! Thanks for calling LEADNEX.AI. I'm your autonomous voice agent — happy to answer questions or book your demo.",
    fallback: [
      "Understood — tell me a bit more about your sales workflow or support volume, and I will tailor the exact setup for you.",
      "Great question. Most enterprise teams deploy LEADNEX on their highest-volume inbound line first to capture 100% of missed revenue.",
    ],
  },
  panel: {
    kicker: 'Platform Capabilities',
    title: 'Why Global Enterprises Choose',
    titleAccent: 'LEADNEX.AI',
    body:
      'Our autonomous voice agents handle complex multi-turn conversations with contextual understanding, emotional intelligence, and dynamic objection handling.',
    highlights: [
      { title: 'Human Voice Parity', desc: 'Indistinguishable from top sales reps', tag: '99.4% Match' },
      { title: 'Real-Time Intelligence', desc: 'Live sentiment analysis & auto-tagging', tag: 'Live Sync' },
      { title: 'Sub-300ms Latency', desc: 'Fluid conversational turn-taking', tag: '<300ms Delay' },
    ],
    logs: [
      'Inbound call qualified: VP of Revenue Operations (ScaleCorp)',
      'Meeting booked: Thursday at 2:00 PM EST with Solutions Team',
      'Outbound lead qualified: 96% BANT Match (TechGlobal)',
      'CRM sync verified: Salesforce Contact & Deal stage updated',
      'Telephony cluster health: 100% active edge nodes (99.99% SLA)',
      'Concurrent batch: 2,400 outbound calls running smoothly',
    ],
    integrations: ['Salesforce', 'HubSpot', 'Twilio', 'Zapier'],
    stats: [
      { label: 'Speed to Lead', value: '< 12s', note: 'Instant auto-dial' },
      { label: 'Booking Multiplier', value: '3.4x', note: 'vs human SDR baseline' },
      { label: 'CRM Sync Speed', value: '<1s', note: 'Zero manual data entry' },
      { label: 'Compliance Level', value: 'SOC 2', note: 'HIPAA & GDPR ready' },
    ],
  },
};

/* ── 02 · How it works ──────────────────────────────────────────────────── */
export const workflow = {
  index: '02',
  badge: 'Autonomous Calling Architecture',
  title: 'One incoming or outgoing call,',
  titleAccent: 'six automated actions',
  subtitle:
    'From the first ring to a synchronized CRM deal — zero queues, zero dropped leads, zero manual data entry.',
  steps: [
    {
      title: 'A lead interacts or submits a form',
      body:
        'Inbound call or web form submission: LEADNEX triggers speed-to-lead outbound dialing in under 12 seconds.',
      detail: 'Dialed in < 12 seconds · Zero delay',
    },
    {
      title: 'Autonomous voice agent answers',
      body:
        'A natural, on-brand voice engages with zero robotic pause (<300ms latency), maintaining natural conversational turn-taking.',
      detail: 'Sub-300ms latency · Human timbre',
    },
    {
      title: 'Dynamic BANT qualification',
      body:
        'Budget, authority, need, and timeline are evaluated live against your qualification playbook without rigid scripts.',
      detail: 'Budget verified · Decision maker identified',
    },
    {
      title: 'Meeting booked on calendar',
      body: 'The voice agent checks live availability, secures an agreed slot, and shoots instant calendar invites.',
      detail: 'Calendar locked · SMS reminder sent',
    },
    {
      title: 'Bi-directional CRM sync',
      body: 'Full transcript, executive audio summary, sentiment score, and stage progression are written back to your CRM instantly.',
      detail: 'Salesforce / HubSpot synced in <1s',
    },
    {
      title: 'Continuous conversation intelligence',
      body:
        'Sentiment, objection frequency, and conversion attribution update executive dashboards in real time.',
      detail: 'Insights logged to executive telemetry',
    },
  ],
  qualification: ['Budget verified', 'Decision maker', 'Timeline: this month', 'Highly qualified'],
  booking: { slot: 'Thu, 2:30 PM confirmed', note: 'Calendar invite sent automatically', title: 'Meeting Scheduled' },
  conversation: [
    { role: 'user', text: "We need an AI voice agent that can handle 5,000 calls a day..." },
    { role: 'ai', text: 'LEADNEX handles up to 50,000 concurrent calls with instant CRM sync. Shall we schedule a pilot?' },
  ],
};

/* ── 03 · Features ──────────────────────────────────────────────────────── */
export const features = {
  index: '03',
  badge: 'Enterprise Platform Capabilities',
  title: 'Everything Required to',
  titleAccent: 'Scale Voice Operations',
  subtitle:
    'Battle-tested AI calling infrastructure built for high-concurrency enterprise sales, 24/7 customer care, and revenue operations.',
  cards: [
    {
      code: 'HIGH-CONCURRENCY CORE',
      title: 'Autonomous Inbound & Outbound Calling',
      body:
        'Handle 10,000+ concurrent calls simultaneously. AI agents understand context, handle objections, and navigate complex phone trees with zero human lag.',
      widget: {
        kind: 'call',
        rows: [
          'LIVE CALL #9182 — Active Outbound',
          'Agent Speech: Pitching Enterprise Tier',
          'Sentiment: Positive (98%)',
        ],
      },
      wide: true,
    },
    {
      code: 'HUMAN-PARITY SPEED',
      title: 'Sub-300ms Voice Latency',
      body: 'Fluid natural dialogue with zero awkward pauses. Customers feel they are speaking with a sharp, responsive specialist.',
      note: 'Faster than natural human response',
      widget: { kind: 'meter', value: 94, label: '<280ms' },
    },
    {
      code: 'BRAND DNA',
      title: 'Studio Voice Cloning',
      body: "Clone your top sales executive's voice in 60 seconds with perfect pitch, tone, and brand consistency.",
      widget: {
        kind: 'voice',
        title: 'Voice DNA Profile',
        rows: ['Sarah (Senior VP Accent)', 'Tone: Authoritative & Warm'],
      },
    },
    {
      code: 'GLOBAL REACH',
      title: '40+ Native Languages',
      body: 'Detect caller dialect automatically and switch fluently with localized vocabulary and cultural nuances.',
      widget: { kind: 'langs' },
    },
    {
      code: 'ECOSYSTEM',
      title: '50+ Native Integrations',
      body: 'Bi-directional sync with Salesforce, HubSpot, Twilio, Zapier, and custom Webhooks with zero middleware.',
      widget: { kind: 'integrations' },
    },
    {
      code: 'INTELLIGENCE SUITE',
      title: 'Live Conversation Intelligence & Sentiment Analysis',
      body:
        'Obtain deep analytics on objection trends, closing percentages, talk-to-listen ratios, and customer sentiment after every conversation.',
      widget: {
        kind: 'telemetry',
        rows: [
          { label: 'Speed to Lead', value: '< 12s', note: 'Instant automated dial' },
          { label: 'Booking Conversion', value: '3.4x', note: 'vs human rep baseline' },
          { label: 'CRM Sync Speed', value: '<1s', note: 'Zero manual data entry' },
          { label: 'Compliance Grade', value: 'SOC 2', note: 'HIPAA & GDPR certified' },
        ],
      },
      wide: true,
    },
  ],
  integrations: ['Salesforce', 'HubSpot', 'Twilio', 'Zapier', 'Pipedrive', 'Zoho', 'Slack', 'Calendly'],
  languages: ['EN', 'ES', 'HI', 'AR', 'FR', 'DE', 'PT', 'JA', 'ZH', 'KO', 'IT', 'NL'],
  comparison: {
    title: 'Traditional Call Centers vs',
    titleAccent: 'LEADNEX.AI Voice Agents',
    subtitle:
      'Discover why modern revenue teams are replacing traditional call center seats with autonomous LEADNEX voice agents.',
    columns: ['Operational Dimension', 'Traditional Call Centers', 'LEADNEX.AI Voice Agents'],
    rows: [
      { label: '24/7/365 Availability without shift gaps', old: 'No (High Overtime Costs)', now: 'Yes (100% Constant Uptime)' },
      { label: 'Concurrent Call Scalability', old: 'Constrained by Headcount', now: 'Unlimited (10,000+ Concurrent)' },
      { label: 'Voice Response Latency', old: '3 - 15 Second Pauses', now: 'Sub-300ms (Instant Parity)' },
      { label: 'Automated CRM Sync & Transcripts', old: 'Manual (Prone to Data Loss)', now: 'Instant Real-time Sync (<1s)' },
      { label: 'Ramp-up & Onboarding Speed', old: 'Weeks of Human Training', now: 'Instant (Upload Playbook)' },
      { label: 'Cost Per Connected Conversation', old: '$3.50 - $6.50 / call', now: '< $0.12 / call' },
    ],
  },
};

/* ── 04 · Testimonials ──────────────────────────────────────────────────── */
export const testimonials = {
  index: '04',
  badge: 'Customer Proof',
  title: 'Trusted by High-Growth',
  titleAccent: 'Enterprises',
  subtitle:
    'Explore how leading companies scale their revenue and support operations with LEADNEX.AI.',
  cloudLabel: 'Trusted by enterprise revenue leaders worldwide',
  items: [
    {
      name: 'Marcus Chen',
      role: 'VP of Sales',
      company: 'TechFlow',
      quote:
        'LEADNEX.AI completely transformed our outbound qualification. The voice agents book 3.4x more meetings than our previous SDR setup, and the lead qualification quality is pristine.',
      metric: '340%',
      metricLabel: 'Increase in qualified meetings',
    },
    {
      name: 'Sarah Williams',
      role: 'Head of Operations',
      company: 'Quantum Health',
      quote:
        'We manage over 60,000 patient inquiries monthly. LEADNEX slashed our hold times from 9 minutes to zero while maintaining rigorous HIPAA compliance. It is an absolute powerhouse.',
      metric: '82%',
      metricLabel: 'Reduction in operational cost',
    },
    {
      name: 'David Park',
      role: 'CEO',
      company: 'Apex Commercial',
      quote:
        'Every missed call was lost revenue. Deploying LEADNEX gave us 100% speed-to-lead capture within 15 seconds. Our sales team closes twice as many deals without ever cold calling.',
      metric: '2.8x',
      metricLabel: 'More deals closed per month',
    },
    {
      name: 'Elena Rodriguez',
      role: 'CTO',
      company: 'NovaStar Cloud',
      quote:
        'The Twilio and Salesforce integration took less than an hour. The voice naturalness is breathtaking — our prospects genuinely believe they are speaking with our top executives.',
      metric: '99.8%',
      metricLabel: 'Customer satisfaction score',
    },
    {
      name: 'James Morrison',
      role: 'Director of Growth',
      company: 'Meridian Capital',
      quote:
        'We scaled from 500 to 45,000 daily outbound touches without adding a single headcount. LEADNEX handles objections with nuance and books directly into AE calendars.',
      metric: '100x',
      metricLabel: 'Scale without extra headcount',
    },
    {
      name: 'Priya Sharma',
      role: 'Global COO',
      company: 'Pinnacle Logistics',
      quote:
        'The multi-lingual capability is extraordinary. We support customers across 18 countries in Spanish, German, French, and Japanese seamlessly through a single LEADNEX pipeline.',
      metric: '40+',
      metricLabel: 'Languages supported natively',
    },
  ],
};

/* ── 05 · Pricing ───────────────────────────────────────────────────────── */
export const pricing = {
  index: '05',
  badge: 'Pricing & Plans',
  title: 'Transparent, Scalable',
  titleAccent: 'Pricing',
  subtitle:
    'No hidden telephony fees. Choose the tier that matches your team and scale seamlessly as call volume increases.',
  monthly: 'Monthly',
  yearly: 'Yearly',
  yearlyNote: 'Save 20%',
  plans: [
    {
      name: 'Starter',
      price: '$99',
      yearlyPrice: '$79',
      description: 'Ideal for fast-moving teams launching their first autonomous voice agent.',
      features: [
        '1 Autonomous Voice Agent',
        '600 minutes included monthly',
        '5 concurrent calls',
        'Sub-300ms voice engine',
        'Salesforce & HubSpot integration',
        'Real-time call transcripts',
        'Standard studio voices',
        'Email & Slack community support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Growth',
      price: '$399',
      yearlyPrice: '$319',
      description: 'For scaling companies automating inbound reception and outbound campaigns.',
      features: [
        '5 Autonomous Voice Agents',
        '6,000 minutes included monthly',
        '50 concurrent calls',
        'Studio voice cloning (2 reps)',
        '40+ native languages',
        'Custom knowledge base upload',
        'Advanced sentiment analytics',
        'Priority 24/7 technical support',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      yearlyPrice: 'Custom',
      description: 'For high-volume enterprises needing dedicated telephony clusters and custom SLAs.',
      features: [
        'Unlimited Voice Agents',
        'Unlimited high-volume minutes',
        '1,000+ concurrent calls',
        'Dedicated SIP trunking & private edge',
        'Custom fine-tuned voice models',
        'SOC 2 Type II & HIPAA BAA included',
        '99.99% uptime SLA guarantee',
        'Dedicated Solutions Architect',
      ],
      cta: 'Talk to Enterprise Sales',
      popular: false,
    },
  ],
  guarantees: [
    '14-day risk-free pilot',
    'No long-term lock-in',
    'Enterprise SLA guarantee',
  ],
  comparison: {
    title: 'Detailed Plan Comparison',
    columns: ['Starter', 'Growth', 'Enterprise'],
    rows: [
      { name: 'Autonomous Voice Agents', values: ['1', '5', 'Unlimited'] },
      { name: 'Monthly Minutes', values: ['600', '6,000', 'Custom Volume'] },
      { name: 'Concurrent Calls', values: ['5', '50', '1,000+ Concurrent'] },
      { name: 'Studio Voice Cloning', values: [false, true, true] },
      { name: 'CRM & Webhook Sync', values: ['2 Connectors', '10 Connectors', 'Unlimited Custom'] },
      { name: 'Conversation Intelligence', values: ['Standard', 'Advanced', 'Full Telemetry'] },
      { name: 'Multi-Language Dialects', values: [false, true, true] },
      { name: 'Knowledge Base Upload', values: [false, true, true] },
      { name: 'Dedicated SIP Trunking', values: [false, false, true] },
      { name: 'Dedicated Architect', values: [false, false, true] },
      { name: 'Platform SLA', values: ['99.9%', '99.9%', '99.99% Guaranteed'] },
      { name: 'HIPAA & SOC 2 BAA', values: [false, false, true] },
    ],
  },
};

/* ── 06 · Security & compliance ─────────────────────────────────────────── */
export const security = {
  index: '06',
  badge: 'Security & Enterprise Trust',
  title: 'Cryptographic Protection &',
  titleAccent: 'Compliance',
  subtitle:
    'Protect every conversation with end-to-end encryption, strict role-based access controls, and zero-data-retention options.',
  flowLabel: 'CRYPTOGRAPHIC VOICE PIPELINE / ACTIVE',
  flowTitle: 'Every conversation protected end to end',
  flowSubtitle:
    'Real-time stream encryption, automated PII redaction, and strict compliance validation.',
  flow: [
    { title: 'Call Captured', meta: 'TLS 1.3 Audio Stream' },
    { title: 'PII Redacted', meta: 'Zero Local Logging' },
    { title: 'Policy Checked', meta: 'RBAC & Audit Guardrails' },
    { title: 'Stored Securely', meta: 'AES-256 Encrypted Vault' },
  ],
  badgesLabel: 'Enterprise Certifications',
  badges: [
    'SOC 2 Type II',
    'GDPR Compliant',
    'HIPAA Ready',
    'ISO 27001',
    'CCPA Ready',
    'AES-256 Encryption',
    'Audit Trails',
    '99.99% SLA',
  ],
  ctaTitle: 'Require a formal security & compliance review?',
  ctaBody: 'Our InfoSec team provides full documentation, architecture diagrams, and SOC 2 reports.',
  ctaLabel: 'REQUEST COMPLIANCE PACK →',
};

/* ── 07 · FAQ ───────────────────────────────────────────────────────────── */
export const faq = {
  index: '07',
  badge: 'FAQ & Knowledge',
  title: 'Frequently Asked Questions',
  subtitle: 'Everything you need to know about deploying and scaling LEADNEX.AI voice agents.',
  searchPlaceholder: 'Search questions regarding setup, latency, telephony...',
  empty: 'No questions match your query.',
  items: [
    {
      q: 'How fast can our team deploy LEADNEX.AI voice agents?',
      a: 'Most teams launch their first working agent in under 15 minutes. Connect your CRM or phone number, upload your playbook, and test immediately. For high-volume enterprise telephony migrations, our solutions engineers assist with live onboarding.',
    },
    {
      q: 'Is the voice truly indistinguishable from a human specialist?',
      a: 'Yes. LEADNEX utilizes proprietary low-latency speech synthesis models operating under 300ms total turn-around. In double-blind evaluations, 99.2% of callers could not distinguish the voice from an experienced human representative.',
    },
    {
      q: 'What occurs when an unexpected scenario arises during a call?',
      a: 'LEADNEX agents intelligently detect complex objections, emotional escalation, or edge cases. The call is seamlessly handed over to a designated human agent with live transcript and context, ensuring zero customer friction.',
    },
    {
      q: 'How does high-concurrency pricing work?',
      a: 'Our Growth and Enterprise plans accommodate scalable minute packages. High-volume teams receive tiered discounts with custom SIP interconnect pricing. Contact our revenue team for an exact model based on your projections.',
    },
    {
      q: 'Does LEADNEX.AI integrate with our existing CRM and dialers?',
      a: 'Yes. We natively support Salesforce, HubSpot, Twilio, Pipedrive, Zoho, and 50+ other platforms via webhooks and REST APIs. Call records, transcripts, and calendar appointments sync within one second.',
    },
    {
      q: 'Are caller data and voice recordings secure?',
      a: 'Absolutely. LEADNEX is SOC 2 Type II certified, GDPR compliant, and HIPAA ready. All data is encrypted with TLS 1.3 in transit and AES-256 at rest. Your customer conversations are never utilized to train public foundation models.',
    },
  ],
};

/* ── Lead capture / book a demo ─────────────────────────────────────────── */
export const lead = {
  index: '08',
  badge: 'Get Started Today',
  title: 'Start Automating',
  titleAccent: 'Your Voice Operations',
  subtitle:
    'Book a personalized architecture consultation or test your custom agent live. Setup takes less than 15 minutes.',
  bookTitle: 'Experience LEADNEX.AI handle live operations',
  benefits: [
    'Live customized agent demo with your company playbook',
    'Custom ROI projection based on current call volume',
    'Walkthrough of sub-300ms telephony infrastructure',
    'Hands-on CRM integration preview (Salesforce & HubSpot)',
    'Enterprise security & compliance Q&A',
  ],
  calendarKicker: 'Ready for Autonomous Calling?',
  calendar: [
    { title: '25 Minutes', note: 'Focused walkthrough' },
    { title: 'Live Voice Test', note: 'Interactive call test' },
  ],
  calendarNote: 'Select a time that suits your revenue leadership team',
  pickDate: 'Select a Consultation Time',
  flexible: 'Instant confirmation',
  industries: [
    'SaaS & B2B Technology',
    'Healthcare & Telehealth',
    'Real Estate & Mortgage',
    'Financial Services & Fintech',
    'Insurance & Claims',
    'Automotive Dealerships',
    'E-Commerce & Retail',
    'Home Services & Solar',
  ],
  volumes: ['Under 2,500 calls/mo', '2,500 - 10,000 calls/mo', '10,000 - 50,000 calls/mo', '50,000+ calls/mo'],
  fields: {
    name: 'Full Name *',
    email: 'Work Email *',
    phone: 'Direct Phone Number',
    company: 'Company Name *',
    industry: 'Select industry',
    volume: 'Monthly Call Volume',
    volumePlaceholder: 'Select expected volume',
    message: 'Describe your calling workflow (inbound, outbound, lead qualification)...',
    consent:
      "I agree to LEADNEX.AI's Privacy Policy and consent to receiving communications regarding platform features. You can unsubscribe at any time.",
  },
  errors: {
    name: 'Full name is required.',
    email: 'Work email is required.',
    emailInvalid: 'Please enter a valid business email address.',
    company: 'Company name is required.',
    consent: 'Please accept the privacy policy to proceed.',
  },
  submit: 'Book Your Demo',
  trial: 'Start Free Trial',
  successTitle: "We have received your demo request.",
  successBody:
    'A LEADNEX Voice Specialist will reach out within 2 hours to confirm your tailored platform demonstration.',
};

/* ── Closing CTA banner ─────────────────────────────────────────────────── */
export const ctaBanner = {
  eyebrow: 'Ready to Transform Your Business Conversations?',
  title: 'Deploy Autonomous',
  titleAccent: 'AI Voice Agents.',
  primary: 'Book Your Demo',
  secondary: 'Explore Capabilities',
  points: ['Sub-300ms Voice Latency', 'Unlimited Concurrent Calls', 'Instant CRM Synchronization'],
};

/* ── Footer ─────────────────────────────────────────────────────────────── */
export const footer = {
  kicker: 'LEADNEX.AI · Autonomous Calling Platform',
  headline: "Let's automate your voice",
  headlineAccent: 'operations.',
  link: 'Book Your Demo',
  description:
    'LEADNEX.AI is the enterprise AI calling platform delivering autonomous voice agents, inbound receptionist, speed-to-lead outbound dialing, and conversation intelligence.',
  newsletter: {
    label: 'Subscribe to AI Telephony Insights',
    placeholder: 'Enter your work email',
    cta: 'Subscribe',
    success: 'Subscribed — welcome to LEADNEX insights!',
    error: 'Enter a valid email address.',
  },
  columns: [
    {
      title: 'Platform',
      links: [
        { label: 'Autonomous Voice Agents', href: '/#demo' },
        { label: 'Outbound Speed-to-Lead', href: '/#features' },
        { label: 'Inbound 24/7 Receptionist', href: '/#features' },
        { label: 'Studio Voice Cloning', href: '/#features' },
        { label: 'Conversation Intelligence', href: '/#compliance' },
        { label: 'Native Integrations', href: '/#features' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Revenue & Sales Teams', href: '/#how-it-works' },
        { label: 'Customer Support Centers', href: '/#demo' },
        { label: 'Healthcare & Clinics' },
        { label: 'Real Estate Brokerages' },
        { label: 'Financial Services' },
        { label: 'Automotive' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation' },
        { label: 'Telephony API Reference' },
        { label: 'Customer Stories', href: '/#testimonials' },
        { label: 'Audio Benchmarks' },
        { label: 'Voice Playbooks' },
        { label: 'Platform Status' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About LEADNEX' },
        { label: 'Careers' },
        { label: 'Press Kit' },
        { label: 'Contact Team', href: '/#contact' },
        { label: 'Partners & Affiliates' },
        { label: 'Trust & Security', href: '/#compliance' },
      ],
    },
  ],
  socials: ['Website', 'Community', 'Docs', 'Status'],
  legalLinks: ['Privacy Policy', 'Terms of Service', 'Security Overview', 'Cookie Policy'],
};
