// Structured copy from adbyrd_content.md — edit here to update the site.

export const site = {
  name: "Adbyrd",
  tagline: "Intelligence, Engineered.",
  description:
    "Adbyrd engineers custom applications, AI-powered workflows, and agentic systems that turn ambitious ideas into measurable business capabilities. Based in Kalamazoo, Michigan.",
  location: "Kalamazoo, Michigan, USA",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/what-we-do", label: "What We Do" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export type IconName =
  | "bot"
  | "code"
  | "workflow"
  | "plug"
  | "pen"
  | "activity";

export const capabilities: { title: string; body: string; icon: IconName; anchor: string }[] = [
  {
    title: "Agentic AI Development",
    body: "Custom AI agents that coordinate tasks, access approved tools, and execute multi-step workflows with human oversight.",
    icon: "bot",
    anchor: "agentic",
  },
  {
    title: "Custom Software Development",
    body: "Purpose-built web platforms, business applications, and digital products engineered around your operational needs.",
    icon: "code",
    anchor: "custom-software",
  },
  {
    title: "Workflow Automation",
    body: "Connected systems that reduce repetitive work, eliminate unnecessary handoffs, and keep business information moving.",
    icon: "workflow",
    anchor: "automation",
  },
  {
    title: "AI Integration & Modernization",
    body: "Bring intelligent capabilities into existing applications, databases, CRMs, and enterprise technology ecosystems.",
    icon: "plug",
    anchor: "modernization",
  },
  {
    title: "Product Design & UX",
    body: "Research-driven interfaces and interactive prototypes that make complex technology intuitive and useful.",
    icon: "pen",
    anchor: "product-ux",
  },
  {
    title: "Managed AI Operations",
    body: "Monitoring, maintenance, evaluation, and continuous improvement to keep intelligent systems reliable after deployment.",
    icon: "activity",
    anchor: "managed-ops",
  },
];

export const industries = [
  {
    name: "Financial Services",
    deliver: ["Intelligent document workflows", "Operational platforms", "Reporting automation"],
  },
  {
    name: "Healthcare & Wellness",
    deliver: ["Administrative automation", "Scheduling systems", "Secure digital experiences"],
  },
  {
    name: "Retail & eCommerce",
    deliver: ["Commerce integrations", "Inventory workflows", "Intelligent customer operations"],
  },
  {
    name: "Manufacturing & Logistics",
    deliver: ["Workflow orchestration", "Operational dashboards", "Process intelligence"],
  },
  {
    name: "Professional Services",
    deliver: ["Client intake", "CRM integration", "Document processing", "Service automation"],
  },
  {
    name: "Education & Training",
    deliver: ["Learning platforms", "Intelligent assistants", "Personalized digital experiences"],
  },
];

export const approach = [
  {
    title: "Discover & Strategize",
    body: "We identify your business goals, operational challenges, technical requirements, and opportunities for intelligent transformation.",
  },
  {
    title: "Design & Engineer",
    body: "We translate strategy into intuitive experiences, reliable architecture, and functional systems built around your requirements.",
  },
  {
    title: "Deploy & Evolve",
    body: "We test, launch, monitor, and improve your technology as your business and its requirements change.",
  },
];

export const insights = [
  { title: "What Agentic AI Actually Means for Your Business", category: "Agentic Development" },
  { title: "Build, Buy, or Automate? Choosing the Right Technology", category: "Technology Strategy" },
  { title: "Why the Future of Enterprise Software Is Agentic", category: "Industry Insights" },
];

export const principles = [
  { title: "Purpose Before Technology", body: "We start with the business problem, not the newest software trend." },
  { title: "Engineering With Accountability", body: "Reliable systems require disciplined development, testing, documentation, and oversight." },
  { title: "Human Intelligence Matters", body: "We build AI to extend human capability, not remove the judgment and responsibility businesses depend on." },
  { title: "Transparency by Default", body: "Our partners deserve clear communication, realistic expectations, and visibility into technical decisions." },
  { title: "Security Is Foundational", body: "Privacy, permissions, operational controls, and risk management belong in the design from the beginning." },
  { title: "Build for What Comes Next", body: "We favor adaptable architectures and maintainable systems over short-lived technical shortcuts." },
];

export const services = [
  {
    id: "agentic",
    eyebrow: "Agentic AI Development",
    title: "Give Your Software the Ability to Act.",
    icon: "bot" as IconName,
    body: [
      "AI is moving beyond conversations and into execution.",
      "Adbyrd designs agentic systems that can interpret information, coordinate approved tools, and carry out multi-step business processes within defined operational boundaries.",
      "From intelligent customer operations to internal workflow orchestration, we engineer AI capabilities that connect directly to the systems your organization already depends on.",
    ],
    buildLabel: "What we can build",
    build: ["Task-oriented AI agents", "Multi-agent workflows", "Internal knowledge assistants", "Document processing agents", "Tool-connected business assistants", "Human-supervised operational systems"],
    outcome: "Less manual coordination, faster information flow, and more time for high-value work.",
  },
  {
    id: "custom-software",
    eyebrow: "Custom Software Development",
    title: "Your Business Isn't Off the Shelf. Your Software Shouldn't Have to Be.",
    icon: "code" as IconName,
    body: [
      "Generic platforms solve generic problems.",
      "When your business requires something more specific, Adbyrd engineers custom digital products built around your processes, users, and long-term objectives.",
      "We develop web applications, business platforms, internal tools, and connected software ecosystems that make complex operations easier to manage.",
    ],
    buildLabel: "What we can build",
    build: ["SaaS platforms", "Customer portals", "Internal dashboards", "Operational applications", "MVPs", "API-driven software", "Custom management systems"],
    outcome: "Technology designed around the way your business actually operates.",
  },
  {
    id: "automation",
    eyebrow: "Business Process Automation",
    title: "Stop Managing Repetitive Work. Start Automating It.",
    icon: "workflow" as IconName,
    body: [
      "Your employees weren't hired to spend their days copying information between systems, chasing updates, and performing the same administrative tasks repeatedly.",
      "We connect your applications, data, and workflows to create coordinated processes that reduce unnecessary manual effort.",
      "From lead intake to internal notifications and operational reporting, we help eliminate friction where it costs your business the most.",
    ],
    buildLabel: "What we can build",
    build: ["CRM automation", "Sales workflow integrations", "Email and messaging workflows", "Webhook-driven systems", "Data synchronization", "Document routing", "Operational alerts"],
    outcome: "Fewer repetitive tasks, more consistent processes, and better operational visibility.",
  },
  {
    id: "modernization",
    eyebrow: "AI Integration & Modernization",
    title: "Your Existing Technology Has More Potential.",
    icon: "plug" as IconName,
    body: [
      "Not every business needs to start over.",
      "Sometimes the greatest opportunity is already inside the applications, databases, and systems your organization uses every day.",
      "Adbyrd helps modernize existing technology by connecting fragmented platforms, introducing intelligent functionality, and improving the architecture behind essential business operations.",
    ],
    buildLabel: "What we can build",
    build: ["API integrations", "Legacy-system modernization", "AI-enabled interfaces", "Intelligent search", "Enterprise knowledge systems", "Connected data services"],
    outcome: "Greater value from existing technology investments without unnecessary replacement.",
  },
  {
    id: "product-ux",
    eyebrow: "Product Strategy & UX Design",
    title: "Great Technology Begins Before the First Line of Code.",
    icon: "pen" as IconName,
    body: [
      "A successful product must solve the right problem for the right people.",
      "We translate business ideas into clearly defined product requirements, intuitive user experiences, and testable prototypes before committing to full-scale development.",
      "Through research, wireframing, interface design, and product validation, we help reduce uncertainty and make development decisions more informed.",
    ],
    buildLabel: "What we can deliver",
    build: ["Product discovery", "User journeys", "Information architecture", "Wireframes", "High-fidelity UI design", "Interactive prototypes", "MVP planning"],
    outcome: "Clearer requirements, better user experiences, and reduced development rework.",
  },
  {
    id: "managed-ops",
    eyebrow: "Managed AI & Software Operations",
    title: "Launch Is a Milestone. Not the Finish Line.",
    icon: "activity" as IconName,
    body: [
      "Intelligent software requires ongoing attention.",
      "Models change. Integrations evolve. Business rules expand. Security requirements grow. Your technology needs a plan for what happens after deployment.",
      "Adbyrd can provide ongoing engineering support, system monitoring, performance evaluations, workflow improvements, and controlled feature releases.",
    ],
    buildLabel: "What we can provide",
    build: ["Application maintenance", "AI agent evaluation", "Incident response planning", "System monitoring", "Workflow optimization", "Security updates", "Feature development"],
    outcome: "A more dependable technology investment that continues adapting to business needs.",
  },
];

export const engagements = [
  { name: "Strategy & Discovery", idealFor: "Businesses evaluating AI or a new product", deliverable: "Technical roadmap and project scope" },
  { name: "MVP Development", idealFor: "Startups validating a commercial concept", deliverable: "Focused, functional initial product" },
  { name: "Custom Engineering", idealFor: "Businesses with specialized requirements", deliverable: "Production-ready software or integrations" },
  { name: "Agentic Transformation", idealFor: "Organizations automating complex workflows", deliverable: "AI agents, tools, and operational controls" },
  { name: "Modernization & Rescue", idealFor: "Teams with aging or unfinished software", deliverable: "Assessment, remediation, and development plan" },
  { name: "Ongoing Engineering", idealFor: "Organizations needing continued support", deliverable: "Agreed maintenance and improvement services" },
];

export const stages = [
  {
    label: "Discovery & Consultation",
    title: "We Start by Understanding Your Business",
    body: "We discuss your goals, challenges, existing technology, target users, and operational requirements. Together, we identify the problem worth solving and determine whether custom software, AI, automation, or another approach makes sense.",
    outcome: "A shared understanding of the opportunity and recommended next steps.",
  },
  {
    label: "Solution Architecture & Planning",
    title: "A Clear Blueprint Before Development",
    body: "We define functional requirements, technical dependencies, system integrations, data flows, security considerations, project milestones, and delivery priorities. Where appropriate, we establish a focused MVP to validate the solution before broader investment.",
    outcome: "A documented technical direction, proposed scope, and delivery roadmap.",
  },
  {
    label: "UX Design & Prototyping",
    title: "Experience the Solution Before It's Built",
    body: "We translate requirements into user journeys, interface designs, workflow diagrams, and interactive prototypes. Stakeholders can review the intended experience, identify gaps, and provide feedback before significant engineering resources are committed.",
    outcome: "An approved experience and a clearer foundation for development.",
  },
  {
    label: "Engineering & Integration",
    title: "From Architecture to Working Software",
    body: "Our development work connects frontend experiences, backend services, data systems, APIs, and automation workflows. For agentic solutions, we establish approved tool access, execution boundaries, and appropriate human review mechanisms.",
    outcome: "Working software developed against defined requirements and acceptance criteria.",
  },
  {
    label: "Testing, Security & AI Evaluation",
    title: "Trust Is Engineered, Not Assumed",
    body: "We test functionality, integrations, reliability, accessibility, and relevant security controls. AI-enabled systems also require evaluation of tool behavior, incorrect outputs, failure recovery, permissions, and situations requiring human intervention.",
    outcome: "A tested solution with documented findings and release-readiness criteria.",
  },
  {
    label: "Deployment & Launch",
    title: "Move Into Production With Confidence",
    body: "We prepare production environments, configure deployment pipelines, review operational dependencies, and coordinate launch activities. The release process is tailored to the product, infrastructure, and operational risk.",
    outcome: "A deployed solution with the required configuration and handover materials.",
  },
  {
    label: "Monitoring & Optimization",
    title: "Measure Performance. Improve What Matters.",
    body: "After launch, we review agreed operational metrics, system behavior, defects, and improvement opportunities. For agentic systems, this may include task completion, error patterns, human escalations, latency, and operating costs.",
    outcome: "Actionable performance insights and prioritized improvements.",
  },
  {
    label: "Ongoing Development & Partnership",
    title: "Technology That Evolves With Your Business",
    body: "As requirements change, we can expand functionality, update integrations, improve workflows, and support new capabilities through separately agreed development or maintenance engagements.",
    outcome: "A defined path for continued maintenance, enhancement, and growth.",
  },
];

export const accountability = [
  { title: "Defined Milestones", body: "Development is organized around agreed deliverables, priorities, and acceptance criteria." },
  { title: "Collaborative Reviews", body: "Stakeholders review progress and provide feedback at established checkpoints." },
  { title: "Documented Decisions", body: "Technical architecture, requirements, changes, and operational procedures are documented throughout the engagement." },
  { title: "Change Management", body: "New requirements and scope changes are evaluated for their effect on budget, timeline, and technical risk." },
  { title: "Security & Ownership", body: "Confidentiality, intellectual property ownership, access permissions, and delivery responsibilities are defined in the project agreement." },
  { title: "Post-Launch Planning", body: "Maintenance, monitoring, warranties, and ongoing support are established before deployment rather than assumed afterward." },
];

export const nextSteps = [
  { title: "Tell Us About Your Project", body: "Share your goals, challenges, and whatever information you already have. You don't need a finished technical specification." },
  { title: "Let's Discuss the Opportunity", body: "We'll review your inquiry and, when appropriate, arrange a discovery conversation to understand your business and technical requirements." },
  { title: "Define the Right Next Step", body: "Depending on the project, we may recommend further discovery, a technical assessment, an MVP roadmap, or a formal development proposal." },
];

export const inquiryOptions = {
  help: [
    "Agentic AI Development",
    "Custom Software Development",
    "Business Process Automation",
    "AI Integration & Modernization",
    "Product Strategy & UX Design",
    "Managed AI & Software Operations",
    "Not sure yet",
  ],
  stage: ["Exploring an idea", "Planning a new product", "Existing system needs improvement", "Ready to begin development"],
  // Placeholder ranges — adjust to Adbyrd's actual engagement sizes.
  budget: ["Not Sure Yet", "Under $25K", "$25K – $75K", "$75K – $150K", "$150K+"],
};
