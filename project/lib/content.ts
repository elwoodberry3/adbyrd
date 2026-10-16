// Structured site copy — edit here to update the site.
// Positioning: fixed-price custom apps, booking systems, and AI phone agents for
// small businesses in Western Michigan (typical project $3,000–$7,500).
//
// CONFIRM BEFORE LAUNCH: package prices and timelines in `packages`, and the
// "up to 70% faster" iPhone claim in `faqs` (state the baseline you measure against).

export const site = {
  name: "Adbyrd",
  tagline: "Intelligence, Engineered.",
  description:
    "Adbyrd builds custom apps, online booking and payment systems, iPhone apps, and AI phone receptionists for small businesses in Western Michigan. Fixed price, typically $3,000–$7,500, delivered in weeks. Based in Kalamazoo, Michigan.",
  location: "251 N Rose St, Kalamazoo, MI 49007",
};

/** Cities named in copy and in structured data (areaServed). */
export const serviceAreas = ["Kalamazoo", "Portage", "Battle Creek", "Grand Rapids", "Holland", "St. Joseph"];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/what-we-do", label: "Services & Pricing" },
  { href: "/process", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

export type IconName = "bot" | "code" | "phone" | "workflow" | "plug" | "activity";

export const capabilities: { title: string; body: string; icon: IconName; anchor: string }[] = [
  {
    title: "AI Phone Receptionist",
    body: "Never miss another call. An AI voice agent answers your business line, answers common questions, books jobs, and texts you the details.",
    icon: "bot",
    anchor: "ai-receptionist",
  },
  {
    title: "Booking & Payment Apps",
    body: "Let customers schedule and pay online instead of calling, texting, and chasing invoices. Built around how your business actually runs.",
    icon: "code",
    anchor: "booking-apps",
  },
  {
    title: "iPhone & Mobile Apps",
    body: "Your own app, built with AI-assisted development so it's ready for App Store review in a fraction of the usual time.",
    icon: "phone",
    anchor: "mobile-apps",
  },
  {
    title: "Workflow Automation",
    body: "Stop copying the same information between email, spreadsheets, and your CRM. We connect the steps so the busywork runs itself.",
    icon: "workflow",
    anchor: "automation",
  },
  {
    title: "Connect Your Tools",
    body: "Make the software you already pay for work together—HubSpot, email, calendars, payments, and the forms on your website.",
    icon: "plug",
    anchor: "integrations",
  },
  {
    title: "Care & Support Plans",
    body: "After launch we keep your app and AI agent running, updated, and improving, so you can focus on customers instead of software.",
    icon: "activity",
    anchor: "care-plans",
  },
];

export const industries = [
  {
    name: "Home & Property Services",
    deliver: ["Online quotes and booking", "AI receptionist for missed calls", "Job scheduling and reminders", "Photo-based estimate requests"],
  },
  {
    name: "Transportation & Delivery",
    deliver: ["Ride and pickup scheduling", "Online payments and deposits", "Automatic confirmations", "Customer records in your CRM"],
  },
  {
    name: "Health, Beauty & Wellness",
    deliver: ["Appointment booking", "Reminder texts and emails", "After-hours call answering", "Client intake forms"],
  },
  {
    name: "Food & Hospitality",
    deliver: ["Catering and event inquiries", "Pre-orders and deposits", "Phone ordering assistant", "Loyalty and repeat-customer tools"],
  },
  {
    name: "Professional Services",
    deliver: ["Client intake and scheduling", "Document collection", "CRM follow-up automation", "Client portals"],
  },
  {
    name: "Retail & Local Shops",
    deliver: ["Local pickup and pre-orders", "Inventory alerts", "Customer text updates", "Simple custom storefront tools"],
  },
];

export const approach = [
  {
    title: "Talk It Through",
    body: "A free conversation about your business and the problem costing you time or customers. If you don't need custom software, we'll tell you.",
  },
  {
    title: "Build It Fast",
    body: "You get a fixed price and a clear plan, then see working progress along the way. Most projects take weeks, not months.",
  },
  {
    title: "Launch & Support",
    body: "We launch, train you on it, and stay available. Optional care plans keep everything running and improving.",
  },
];

export const insights = [
  { title: "What Does a Custom App Cost for a Small Business?", category: "Pricing" },
  { title: "Do You Need an App, or Just Online Booking?", category: "Choosing the Right Tool" },
  { title: "Can an AI Receptionist Really Answer Your Business Phone?", category: "AI for Main Street" },
];

export const principles = [
  { title: "Fixed Price, No Surprises", body: "You know the cost before we start. If the scope changes, we talk about it first." },
  { title: "Plain English", body: "No jargon and no black box. You'll always understand what we're building and why." },
  { title: "Right-Sized Technology", body: "We build what your business needs today—not an enterprise system you'll never use." },
  { title: "Fast, Not Rushed", body: "AI-assisted development lets us move quickly without skipping testing or quality checks." },
  { title: "People Stay in Charge", body: "Our AI agents handle routine work and hand anything sensitive or unusual back to you." },
  { title: "Built to Be Found", body: "Years of SEO work taught us to build apps and sites that Google and AI assistants can find." },
];

export const services = [
  {
    id: "ai-receptionist",
    eyebrow: "AI Phone Receptionist",
    title: "Every Call Answered. Even When You're on a Job.",
    icon: "bot" as IconName,
    priceFrom: "From $3,000",
    body: [
      "For a small business, a missed call is often a missed customer.",
      "We set up an AI voice agent that answers your business phone in a natural voice, handles common questions about services, hours, and pricing, captures the caller's details, and books or routes the job.",
      "It knows when to stop: anything unusual or sensitive gets passed to you with a text or email summary.",
    ],
    buildLabel: "What it can do",
    build: ["Answer calls 24/7", "Answer FAQs about your business", "Book appointments and pickups", "Text you call summaries", "Transfer urgent calls", "Log callers in your CRM"],
    outcome: "Fewer missed calls, more booked jobs, and evenings back.",
  },
  {
    id: "booking-apps",
    eyebrow: "Booking & Payment Apps",
    title: "Let Customers Book and Pay Without Calling You.",
    icon: "code" as IconName,
    priceFrom: "From $3,500",
    body: [
      "Off-the-shelf booking tools rarely fit how a small business really works.",
      "We build a simple web app around your exact process: customers pick a time, enter the details you need, and pay or leave a deposit. You get the booking in your inbox and your CRM automatically.",
      "Built on the same modern stack used by much larger companies (Next.js, Vercel, HubSpot, transactional email), sized and priced for a small business.",
    ],
    buildLabel: "What we can build",
    build: ["Online scheduling", "Payments and deposits", "Automatic confirmation emails", "Customer records in HubSpot", "Quote request forms", "Simple admin dashboard"],
    outcome: "Less back-and-forth, faster payment, and a business that takes bookings while you sleep.",
  },
  {
    id: "mobile-apps",
    eyebrow: "iPhone & Mobile Apps",
    title: "Your Own App. Ready for Review in Weeks.",
    icon: "phone" as IconName,
    priceFrom: "$5,000–$7,500",
    body: [
      "A dedicated app puts your business on your customers' home screens.",
      "Our AI-assisted development process builds iPhone apps in up to 70% less time than a traditional build, so you get to Apple's App Store review sooner and spend less getting there.",
      "We build real native functionality—not a thin website wrapper—so your app is built to meet Apple's guidelines from day one.",
    ],
    buildLabel: "What we can build",
    build: ["Customer booking apps", "Loyalty and rewards apps", "Ordering apps", "Field-service apps for your crew", "Push notifications", "App Store submission support"],
    outcome: "A real app for your business, without an enterprise budget or timeline.",
  },
  {
    id: "automation",
    eyebrow: "Workflow Automation",
    title: "Stop Doing the Same Busywork Every Day.",
    icon: "workflow" as IconName,
    priceFrom: "From $3,000",
    body: [
      "You didn't start a business to copy information between emails, spreadsheets, and apps.",
      "We map the repetitive steps in your week and automate them: new leads land in your CRM, customers get follow-ups automatically, and you get alerts only when something needs you.",
    ],
    buildLabel: "What we can automate",
    build: ["Lead capture and follow-up", "Email and text reminders", "Invoice and payment notices", "Review requests", "Reports you used to build by hand", "Team notifications"],
    outcome: "Hours back every week and fewer things falling through the cracks.",
  },
  {
    id: "integrations",
    eyebrow: "Connect Your Tools",
    title: "Make the Software You Already Pay For Work Together.",
    icon: "plug" as IconName,
    priceFrom: "From $3,000",
    body: [
      "Most small businesses don't need new software. They need their existing tools to talk to each other.",
      "We connect your website forms, CRM, calendar, email, and payment tools so information moves on its own and lives in one place.",
    ],
    buildLabel: "What we can connect",
    build: ["HubSpot and other CRMs", "Website forms", "Google and Outlook calendars", "Payment processors", "Email and SMS", "Spreadsheets"],
    outcome: "One clear picture of your customers without double entry.",
  },
  {
    id: "care-plans",
    eyebrow: "Care & Support Plans",
    title: "Launch Day Is Just the Beginning.",
    icon: "activity" as IconName,
    priceFrom: "Monthly plans",
    body: [
      "Apps and AI agents need a little attention to stay sharp.",
      "Our care plans cover hosting, monitoring, updates, and small improvements, plus tuning your AI receptionist as your services, prices, and questions change.",
    ],
    buildLabel: "What's included",
    build: ["Hosting and monitoring", "Security and software updates", "AI agent tuning", "Small feature changes", "Priority support", "Quarterly check-ins"],
    outcome: "Software that keeps working as your business grows.",
  },
];

/** Packages shown on /what-we-do. Prices/timelines are starting points — confirm before launch. */
export const engagements = [
  {
    name: "AI Phone Receptionist",
    idealFor: "Owner-operators who miss calls while they're working",
    deliverable: "A voice agent on your business line that answers, books, and texts you summaries",
    price: "From $3,000",
    timeline: "Typically 2–3 weeks",
  },
  {
    name: "Booking & Payments App",
    idealFor: "Service businesses booking by phone and text",
    deliverable: "A custom web app for scheduling, payments, confirmations, and CRM records",
    price: "From $3,500",
    timeline: "Typically 3–4 weeks",
  },
  {
    name: "iPhone App",
    idealFor: "Businesses ready for their own app on customers' phones",
    deliverable: "A native iPhone app, built and prepared for App Store submission",
    price: "$5,000–$7,500",
    timeline: "Typically 4–6 weeks",
  },
  {
    name: "Automation Sprint",
    idealFor: "Teams losing hours to repetitive admin work",
    deliverable: "Your top repetitive workflows automated and connected to your tools",
    price: "From $3,000",
    timeline: "Typically 2–3 weeks",
  },
  {
    name: "Web App + AI Receptionist",
    idealFor: "Businesses changing direction or launching a new service",
    deliverable: "A booking web app and AI phone agent built to work together",
    price: "$5,000–$7,500",
    timeline: "Typically 4–6 weeks",
  },
  {
    name: "Care Plan",
    idealFor: "Any Adbyrd client after launch",
    deliverable: "Hosting, monitoring, updates, AI tuning, and small improvements",
    price: "Monthly",
    timeline: "Ongoing",
  },
];

/** Anonymized client stories — no names or metrics that the clients haven't approved. */
export const caseStudies = [
  {
    label: "Transportation · Dallas, TX",
    client: "A one-person ride service",
    problem:
      "Every ride was booked by phone or text, and payments were handled one conversation at a time—while driving.",
    built:
      "A custom web app where riders schedule pickups and pay online. Confirmations go out by email automatically and every customer lands in HubSpot. Built with Next.js, Resend, and HubSpot on Vercel.",
    result: "Riders book and pay on their own, and the owner can stay focused on the road.",
  },
  {
    label: "Home Services · Local Business",
    client: "A furniture removal company",
    problem:
      "The owner pivoted from general trash removal to furniture-only pickups and needed the business to reflect the new focus—fast, and on a small-business budget.",
    built:
      "A simple web app for furniture pickup requests, paired with an AI voice agent that answers the business phone, explains the service, and captures job details.",
    result: "A clear new offer online and calls answered even when the crew is on a job.",
  },
];

export const faqs = [
  {
    q: "How much does a custom app cost for a small business?",
    a: "Most Adbyrd projects cost between $3,000 and $7,500, quoted as a fixed price before work begins. An AI phone receptionist or workflow automation starts around $3,000; an online booking and payment app starts around $3,500; a native iPhone app is typically $5,000–$7,500.",
  },
  {
    q: "How long does it take to build?",
    a: "Most projects launch in two to six weeks. Our AI-assisted development process builds iPhone apps in up to 70% less time than a traditional build, so you reach Apple's App Store review sooner. Apple sets its own review timeline.",
  },
  {
    q: "What is an AI phone receptionist?",
    a: "It's an AI voice agent that answers your business phone, responds to common questions, captures caller details, and books or routes jobs. Anything unusual or sensitive is passed to you, along with a text or email summary of the call.",
  },
  {
    q: "Where is Adbyrd located, and who do you work with?",
    a: "Adbyrd is based in Kalamazoo, Michigan, and works with small businesses across Western Michigan—including Kalamazoo, Portage, Battle Creek, Grand Rapids, Holland, and St. Joseph. We also build for small businesses across the U.S.",
  },
  {
    q: "Didn't Adbyrd used to do SEO?",
    a: "Yes. Adbyrd started as a Western Michigan SEO and digital marketing agency. Today we build custom apps and AI tools for small businesses, and that search background is built into everything we ship so your business is easy for Google and AI assistants to find.",
  },
  {
    q: "Do I need to be technical to work with you?",
    a: "No. Tell us what's costing you time or customers. We'll explain the options in plain English, recommend the simplest thing that works, and tell you if you don't need custom software at all.",
  },
];

export const stages = [
  {
    label: "Free Consultation",
    title: "We Start With Your Business, Not the Technology",
    body: "We talk through how your business runs today, where you're losing time or customers, and what a good result looks like. If an off-the-shelf tool will do the job, we'll say so.",
    outcome: "A clear picture of the problem and whether a custom build makes sense.",
  },
  {
    label: "Fixed-Price Proposal",
    title: "Know the Cost and Timeline Up Front",
    body: "We write down exactly what we'll build, what it costs, and when it will be ready. No hourly billing surprises; scope changes are discussed and agreed before they happen.",
    outcome: "A fixed price, a scope you can read in five minutes, and a launch date.",
  },
  {
    label: "Design & Build",
    title: "See Real Progress Along the Way",
    body: "We design the screens and calls around your customers, then build using AI-assisted development. You see and try working versions as we go, so there are no surprises at the end.",
    outcome: "Working software you've already tested before launch.",
  },
  {
    label: "Test & Launch",
    title: "Launched Carefully, Explained Simply",
    body: "We test every booking, payment, and call flow, set up your accounts, submit iPhone apps for App Store review, and show you how everything works.",
    outcome: "A live app or agent—and you know how to use it.",
  },
  {
    label: "Support & Improve",
    title: "We're Still Here After Launch",
    body: "Questions come up and businesses change. Care plans keep your app and AI agent hosted, updated, and tuned as your services and prices evolve.",
    outcome: "Technology that keeps up with your business.",
  },
];

export const accountability = [
  { title: "Fixed Price", body: "You approve the price before we start. Changes are discussed and agreed first—never billed by surprise." },
  { title: "Regular Check-Ins", body: "You see working progress throughout the build, not just at the end." },
  { title: "Plain-English Updates", body: "We explain what's done, what's next, and any decisions you need to make." },
  { title: "Clear Scope", body: "What's included is written down up front, so everyone knows what 'done' means." },
  { title: "Your Data, Protected", body: "Access, ownership, and confidentiality are spelled out in your project agreement before work begins." },
  { title: "Support After Launch", body: "Hosting, updates, and support options are agreed before launch, not figured out afterward." },
];

export const nextSteps = [
  { title: "Tell Us What's Going On", body: "Missed calls? Booking by text? Hours of busywork? A few sentences is plenty—no technical details needed." },
  { title: "Free Consultation", body: "We'll talk through your business and the simplest solution that would actually help." },
  { title: "Get a Fixed-Price Quote", body: "If custom work makes sense, you'll get a clear scope, price, and timeline. If it doesn't, we'll point you in the right direction." },
];

export const inquiryOptions = {
  help: [
    "AI Phone Receptionist",
    "Booking & Payment App",
    "iPhone / Mobile App",
    "Workflow Automation",
    "Connecting My Tools",
    "Care & Support Plan",
    "Not sure yet",
  ],
  stage: ["Just exploring", "I know the problem, not the solution", "I know what I want built", "Ready to start soon"],
  budget: ["Not sure yet", "Under $3,000", "$3,000 – $5,000", "$5,000 – $7,500", "$7,500+"],
};
