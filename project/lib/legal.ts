/**
 * PLACEHOLDER legal & compliance pages.
 * These are structured templates to speed up review — they are NOT legal advice
 * and must be completed and approved by qualified counsel before launch.
 * Replace every [BRACKETED] item.
 */

export type LegalSection = { heading: string; body: string[]; list?: string[] };
export type LegalDoc = {
  slug: string;
  title: string;
  short: string;
  summary: string;
  sections: LegalSection[];
};

const CONTACT_BLOCK = [
  "Adbyrd [LEGAL ENTITY NAME, e.g. Adbyrd LLC]",
  "251 N Rose St, Kalamazoo, MI 49007, United States",
  "Email: support@adbyrd.com · Phone: +1 (888) 712-1694",
];

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    short: "Privacy Policy",
    summary: "How Adbyrd collects, uses, shares, and protects personal information — and the rights you have.",
    sections: [
      {
        heading: "Who we are",
        body: [
          "This Privacy Policy explains how [LEGAL ENTITY NAME] (\"Adbyrd,\" \"we,\" \"us\") handles personal information when you visit adbyrd.com, contact us, or engage our services.",
        ],
      },
      {
        heading: "Information we collect",
        body: ["[CONFIRM AND EDIT] We may collect:"],
        list: [
          "Information you provide — name, company, business email, phone, project details, and budget range submitted through forms or email.",
          "Device and usage data — IP address, browser type, pages viewed, referring URL, and interactions, collected through cookies and similar technologies.",
          "Marketing attribution data — campaign parameters (e.g. UTM tags) and advertising click identifiers (e.g. gclid, fbclid, msclkid, ttclid, li_fat_id).",
          "Business contact data from public sources or partners [IF APPLICABLE].",
        ],
      },
      {
        heading: "How we use information",
        body: ["We use personal information to:"],
        list: [
          "Respond to inquiries and provide proposals and services.",
          "Operate, secure, and improve the website.",
          "Measure website performance and the effectiveness of our marketing.",
          "Deliver advertising, including interest-based advertising, where you have consented or where permitted by law.",
          "Comply with legal obligations and enforce our agreements.",
        ],
      },
      {
        heading: "Analytics and advertising technologies",
        body: [
          "[LIST ONLY TOOLS ACTUALLY ENABLED] We may use Google Analytics 4, Google Tag Manager, Google Ads, Microsoft Clarity, Microsoft Advertising (UET), Meta Pixel, LinkedIn Insight Tag, TikTok Pixel, and Vercel Web Analytics & Speed Insights.",
          "Non-essential analytics and advertising technologies load only after you consent through our cookie banner where consent is required. We use Google Consent Mode v2 and honor Global Privacy Control (GPC) signals as an opt-out of sale/sharing and targeted advertising.",
          "See our Cookie Policy for details and to change your preferences.",
        ],
      },
      {
        heading: "How we share information",
        body: ["[CONFIRM] We share personal information with:"],
        list: [
          "Service providers (hosting, analytics, CRM, email, and communications) under contract.",
          "Advertising and analytics partners, subject to your choices.",
          "Professional advisers, and authorities where required by law.",
          "A successor entity in the event of a merger, acquisition, or asset sale.",
        ],
      },
      {
        heading: "Your privacy rights",
        body: [
          "Depending on where you live (including California, Colorado, Connecticut, Virginia, Texas, Oregon, and other U.S. states, the EEA, the UK, and Canada), you may have the right to access, correct, delete, or port your personal information; to opt out of the sale or sharing of personal information and of targeted advertising; and to withdraw consent.",
          "To exercise these rights, visit Your Privacy Choices or email support@adbyrd.com. We will verify requests and respond within the time required by law. We do not discriminate against you for exercising your rights.",
        ],
      },
      {
        heading: "Data retention",
        body: ["[DEFINE RETENTION PERIODS] We retain personal information only as long as needed for the purposes described here, then delete or de-identify it."],
      },
      {
        heading: "Security",
        body: ["We use administrative, technical, and physical safeguards appropriate to the sensitivity of the information. No system is completely secure. See our Security page for more."],
      },
      {
        heading: "International transfers",
        body: ["[IF APPLICABLE] Information may be processed in the United States. Where required, we rely on appropriate safeguards such as Standard Contractual Clauses."],
      },
      {
        heading: "Children",
        body: ["Our website and services are intended for businesses and are not directed to children under 16. We do not knowingly collect their personal information."],
      },
      { heading: "Changes", body: ["We may update this policy. The \"Last updated\" date shows when it last changed."] },
      { heading: "Contact", body: CONTACT_BLOCK },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    short: "Terms of Service",
    summary: "The terms that govern your use of adbyrd.com.",
    sections: [
      { heading: "Acceptance", body: ["By using adbyrd.com (the \"Site\"), you agree to these Terms. If you do not agree, do not use the Site."] },
      {
        heading: "Website use only",
        body: [
          "These Terms cover use of the Site. Client engagements are governed by a separate signed agreement, statement of work, or master services agreement, which controls in case of conflict.",
        ],
      },
      {
        heading: "Acceptable use",
        body: ["You agree not to:"],
        list: [
          "Use the Site unlawfully or to infringe others' rights.",
          "Attempt to gain unauthorized access, probe, or disrupt the Site or its infrastructure (see our Security page for responsible disclosure).",
          "Scrape, harvest, or use automated means to access the Site except as permitted by robots.txt.",
          "Submit false, misleading, or malicious content.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "The Site, including the Adbyrd name, logo, Sentinel character, text, graphics, and code, is owned by Adbyrd or its licensors and protected by intellectual-property laws. No license is granted except to view the Site for personal or internal business purposes.",
        ],
      },
      { heading: "Submissions", body: ["Information you submit is handled under our Privacy Policy. Do not send confidential information until a confidentiality agreement is in place."] },
      { heading: "Third-party links", body: ["The Site may link to third-party sites and social platforms. We are not responsible for their content or practices."] },
      {
        heading: "Disclaimers",
        body: ["THE SITE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND. Content is for general information and is not professional advice. [COUNSEL TO REVIEW]"],
      },
      { heading: "Limitation of liability", body: ["[COUNSEL TO DRAFT — liability cap and exclusions consistent with Michigan law.]"] },
      { heading: "Indemnification", body: ["[COUNSEL TO DRAFT]"] },
      { heading: "Governing law & venue", body: ["These Terms are governed by the laws of the State of Michigan. [CONFIRM venue — e.g. state or federal courts located in Kalamazoo County, Michigan.]"] },
      { heading: "Changes", body: ["We may update these Terms by posting a revised version on the Site."] },
      { heading: "Contact", body: CONTACT_BLOCK },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    short: "Cookie Policy",
    summary: "The cookies and similar technologies used on adbyrd.com, and how to control them.",
    sections: [
      {
        heading: "What cookies are",
        body: ["Cookies, pixels, and local storage are small pieces of data that help websites function, measure performance, and support advertising."],
      },
      {
        heading: "Categories we use",
        body: ["[CONFIRM AGAINST ENABLED TOOLS]"],
        list: [
          "Strictly necessary — security, load balancing, and remembering your cookie choices. Always on.",
          "Analytics — Google Analytics 4, Microsoft Clarity. Help us understand how the Site is used. Off until you consent where consent is required.",
          "Marketing — Google Ads, Meta Pixel, LinkedIn Insight Tag, TikTok Pixel, Microsoft Advertising (UET). Measure campaigns and enable relevant advertising. Off until you consent.",
          "Cookieless measurement — Vercel Web Analytics and Speed Insights collect aggregated, anonymized page and performance data without cookies.",
        ],
      },
      {
        heading: "Managing your choices",
        body: [
          "Use \"Cookie Settings\" in the site footer to change your preferences at any time. You can also block cookies in your browser. We honor Global Privacy Control (GPC) signals.",
        ],
      },
      { heading: "Cookie table", body: ["[INSERT TABLE — name, provider, purpose, category, duration — generated from a cookie scan after launch.]"] },
      { heading: "Contact", body: CONTACT_BLOCK },
    ],
  },
  {
    slug: "privacy-choices",
    title: "Your Privacy Choices",
    short: "Your Privacy Choices",
    summary: "Opt out of the sale or sharing of personal information and targeted advertising, or submit a privacy request.",
    sections: [
      {
        heading: "Opt out of sale/sharing and targeted advertising",
        body: [
          "Adbyrd does not sell personal information for money. Some advertising cookies may be considered a \"sale\" or \"sharing\" under certain U.S. state laws. You can opt out by choosing \"Reject non-essential\" in Cookie Settings or by enabling Global Privacy Control in your browser, which we honor automatically.",
        ],
      },
      {
        heading: "Submit a privacy request",
        body: [
          "To request access, correction, deletion, or portability of your personal information, email support@adbyrd.com with the subject \"Privacy Request\" or call +1 (888) 712-1694. [ADD WEB FORM IF REQUIRED] We will verify your identity before fulfilling a request. Authorized agents may submit requests with proof of authorization.",
        ],
      },
      { heading: "Appeals", body: ["If we decline your request, you may appeal by replying to our decision. [CONFIRM state-specific appeal process.]"] },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    short: "Accessibility",
    summary: "Our commitment to an inclusive, accessible website.",
    sections: [
      {
        heading: "Our commitment",
        body: [
          "Adbyrd is committed to making adbyrd.com accessible to everyone. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA.",
        ],
      },
      {
        heading: "Measures we take",
        list: [
          "Semantic HTML, keyboard navigation, and visible focus states.",
          "Sufficient color contrast and text that scales.",
          "Respect for reduced-motion preferences on animated visuals.",
          "Periodic automated and manual testing. [ADD AUDIT DATE / PROVIDER]",
        ],
        body: [],
      },
      { heading: "Known limitations", body: ["[LIST ANY KNOWN ISSUES AND REMEDIATION DATES]"] },
      {
        heading: "Feedback",
        body: ["If you encounter a barrier, contact support@adbyrd.com or +1 (888) 712-1694. We aim to respond within [5] business days."],
      },
    ],
  },
  {
    slug: "security",
    title: "Security & Trust",
    short: "Security",
    summary: "How we protect our website and client engagements, and how to report a vulnerability.",
    sections: [
      {
        heading: "Our approach",
        body: ["Security is designed into our engineering process from the start, including for agentic systems that use tools and act on data."],
        list: [
          "Encryption in transit (TLS/HSTS) and at rest for systems we operate.",
          "Least-privilege access, multi-factor authentication, and access reviews.",
          "Secure development practices, dependency scanning, and code review.",
          "Defined permissions, execution boundaries, and human approval for sensitive agent actions.",
          "Logging and monitoring to investigate failures and incidents.",
          "Vendor review for sub-processors. [ADD SUB-PROCESSOR LIST]",
        ],
      },
      {
        heading: "Compliance",
        body: ["[STATE ONLY WHAT IS TRUE — e.g. \"SOC 2 Type II report available under NDA\" or \"aligned with NIST CSF / ISO 27001 controls\". Do not claim certifications that are not held.]"],
      },
      {
        heading: "Responsible disclosure",
        body: [
          "If you believe you have found a security vulnerability, please email support@adbyrd.com with the subject \"Security Report\" [OR a dedicated security@ address]. Include steps to reproduce. Please do not access data that isn't yours, degrade service, or publicly disclose before we have had a reasonable time to respond. Our security.txt is available at /.well-known/security.txt.",
        ],
      },
      { heading: "Data processing agreements", body: ["A Data Processing Agreement (DPA) is available for client engagements on request."] },
    ],
  },
  {
    slug: "responsible-ai",
    title: "Responsible AI Policy",
    short: "Responsible AI",
    summary: "The principles that guide how Adbyrd designs, deploys, and governs AI and agentic systems.",
    sections: [
      {
        heading: "Principles",
        body: ["Our AI work follows the same principles that guide every engagement:"],
        list: [
          "Human oversight — people stay in control of consequential decisions; sensitive actions require approval.",
          "Right-sized autonomy — agents receive only the tools and permissions their job requires.",
          "Transparency — we document what systems do, their limitations, and when users are interacting with AI.",
          "Data stewardship — client data is not used to train third-party models without explicit written consent. [CONFIRM with model-provider terms]",
          "Evaluation — systems are tested against defined tasks, failure cases, and escalation paths before and after launch.",
          "Accountability — every deployment has an owner, monitoring, and an incident process.",
        ],
      },
      {
        heading: "Use of AI providers",
        body: ["[LIST MODEL PROVIDERS / PLATFORMS USED AND HOW DATA IS HANDLED BY EACH]"],
      },
      { heading: "Regulatory alignment", body: ["[CONFIRM — e.g. NIST AI RMF, applicable state AI laws, EU AI Act where relevant to clients.]"] },
      { heading: "Questions", body: ["Contact support@adbyrd.com with questions about our AI practices."] },
    ],
  },
];

export const LEGAL_LAST_UPDATED = "[MONTH DAY, 2027]";

export function getLegalDoc(slug: string) {
  return legalDocs.find((d) => d.slug === slug);
}
