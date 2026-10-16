import Link from "next/link";
import { ArrowRight, Check, Inbox, Tags, Wrench, UserCheck, CircleCheckBig, Quote } from "lucide-react";
import AICore from "@/components/AICore";
import IndustryCarousel from "@/components/IndustryCarousel";
import { ArchVisual, Button, CtaBand, Eyebrow, SectionHeading, icons } from "@/components/ui";
import { approach, capabilities, insights } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* 01 — Hero (Ref 002/003: dark split, glowing visual, glass cards) */}
      <section className="px-3 pt-3 sm:px-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest text-white">
          <div className="grid-fade pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-glow/20 blur-[140px]" />
          <div className="container-x relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="glass mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-lime">
                Intelligence, Engineered.
              </span>
              <Eyebrow light>Agentic AI &amp; Custom Software Development</Eyebrow>
              <h1 className="text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
                The Future Doesn&apos;t Build Itself.
                <span className="mt-2 block text-lime">We Do.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
                Tomorrow&apos;s most competitive businesses won&apos;t simply use technology. They&apos;ll operate through
                intelligent systems designed to think, act, adapt, and scale.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-white/65">
                Adbyrd engineers custom applications, AI-powered workflows, and agentic systems that turn ambitious ideas
                into measurable business capabilities.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/contact">Start Your Project</Button>
                <Button href="/what-we-do" variant="outline-light">
                  Explore Our Capabilities
                </Button>
              </div>
              <p className="mt-8 text-sm text-white/55">Based in Kalamazoo, Michigan. Built for businesses everywhere.</p>
            </div>
            <AICore />
          </div>
        </div>
      </section>

      {/* Metric strip (Ref 002) */}
      <section className="container-x py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {["Strategy", "Design", "Engineering", "Deployment"].map((w, i) => (
            <div key={w} className="flex items-center gap-4 rounded-2xl bg-cloud px-6 py-5 ring-1 ring-line">
              <span className="font-display text-sm font-semibold text-moss">0{i + 1}</span>
              <span className="font-display text-lg font-semibold">{w}.</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-slate">One technology partner.</p>
      </section>

      {/* 02 — Introduction (Ref 003 arch-framed imagery) */}
      <section className="container-x grid items-center gap-14 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-24">
        <div className="relative mx-auto flex w-full max-w-md items-end gap-5">
          <ArchVisual variant="circuit" className="h-[360px] flex-1 sm:h-[440px]" />
          <ArchVisual variant="nodes" className="mb-12 h-[260px] flex-1 sm:h-[320px]" />
        </div>
        <div>
          <SectionHeading
            eyebrow="Beyond Traditional Software"
            title="Your Business Has Ambition. We Build the Intelligence Behind It."
          />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate">
            <p>
              The next generation of business technology does more than execute commands. It connects information,
              orchestrates workflows, assists decisions, and performs complex tasks within clearly defined boundaries.
            </p>
            <p>
              At Adbyrd, we combine thoughtful product strategy, modern software engineering, and agentic AI development to
              create technology that works with your business—not against it.
            </p>
            <p>From the first prototype to production-scale infrastructure, we turn technical complexity into practical business advantage.</p>
          </div>
          <div className="mt-8">
            <Button href="/about" variant="dark">
              Discover Adbyrd
            </Button>
          </div>
        </div>
      </section>

      {/* 03 — Capabilities (Ref 001 service card grid) */}
      <section className="bg-cloud py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading center eyebrow="What We Engineer" title="Intelligent Solutions. Real Business Impact." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => {
              const Icon = icons[c.icon];
              return (
                <Link
                  key={c.title}
                  href={`/what-we-do#${c.anchor}`}
                  className="group relative flex flex-col rounded-[1.5rem] bg-white p-8 ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/10"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-forest transition-colors group-hover:bg-lime">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-sm font-semibold text-slate/60">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{c.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-slate">{c.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Button href="/what-we-do" variant="dark">
              Explore All Services
            </Button>
          </div>
        </div>
      </section>

      {/* 04 — Agentic Technology */}
      <section className="px-3 py-3 sm:px-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white">
          <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-glow/15 blur-[130px]" />
          <div className="container-x relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <SectionHeading light eyebrow="The Agentic Advantage" title="Software That Doesn't Just Respond. It Gets Work Done." />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">
                <p>
                  Traditional software waits for instructions. Agentic systems can pursue defined goals, coordinate approved
                  tools, and complete complex workflows while keeping people in control of critical decisions.
                </p>
                <p className="text-white/60">
                  Imagine a business where incoming requests are classified automatically, information moves securely between
                  systems, routine processes execute with minimal intervention, and your team focuses on the work that
                  requires human judgment.
                </p>
                <p className="font-display font-semibold text-lime">That&apos;s the opportunity we&apos;re engineering.</p>
              </div>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Reduce repetitive administrative work",
                  "Connect disconnected business systems",
                  "Accelerate service and operational workflows",
                  "Maintain human approvals and operational visibility",
                ].map((b) => (
                  <li key={b} className="glass flex items-start gap-3 rounded-2xl p-4 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" strokeWidth={3} />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <Button href="/what-we-do#agentic">Explore Agentic Development</Button>
              </div>
            </div>

            {/* Illustrative agent workflow */}
            <div className="glass relative rounded-[1.75rem] p-6 sm:p-8" aria-label="Example agentic workflow">
              <p className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">Example agentic workflow</p>
              <ol className="mt-6 space-y-3">
                {[
                  { icon: Inbox, t: "Incoming request received", s: "Email, form, or ticket" },
                  { icon: Tags, t: "Classified automatically", s: "Intent and priority identified" },
                  { icon: Wrench, t: "Approved tools coordinated", s: "CRM, documents, internal systems" },
                  { icon: UserCheck, t: "Human approval", s: "Sensitive actions stay with your team", highlight: true },
                  { icon: CircleCheckBig, t: "Work completed & logged", s: "Full operational visibility" },
                ].map((step, i, arr) => (
                  <li key={step.t} className="relative flex gap-4">
                    {i < arr.length - 1 && <span className="absolute top-12 left-[22px] h-[calc(100%-28px)] w-px bg-white/15" />}
                    <span
                      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                        step.highlight ? "bg-lime text-ink" : "bg-white/10 text-glow"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </span>
                    <div className="pb-3">
                      <p className="font-semibold">{step.t}</p>
                      <p className="text-sm text-white/55">{step.s}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Industries (Ref 003 pills + Ref 001 featured carousel) */}
      <section className="container-x py-20 lg:py-28">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Built for Business" title="Across Industries. Beyond Limitations." />
          <p className="max-w-sm text-slate">
            Different industries. Different challenges. One principle: technology should create measurable value.
          </p>
        </div>
        <div className="mt-12">
          <IndustryCarousel />
        </div>
      </section>

      {/* 06 — Approach (Ref 003 numbered step process) */}
      <section className="bg-mint py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="From Vision to Execution" title="Complex Technology. A Clear Path Forward." />
            <Button href="/process" variant="dark">
              See Our Development Process
            </Button>
          </div>
          <div className="relative mt-16">
            <div className="absolute top-5 right-[16%] left-[16%] hidden border-t-2 border-dashed border-forest/25 md:block" />
            <ol className="grid gap-6 md:grid-cols-3">
              {approach.map((s, i) => (
                <li key={s.title} className="flex flex-col items-center text-center">
                  <span
                    className={`relative z-10 grid h-11 w-11 place-items-center rounded-full font-display text-sm font-semibold ring-4 ring-mint ${
                      i === 1 ? "bg-lime text-ink" : "bg-white text-forest ring-offset-0"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <div
                    className={`mt-6 w-full flex-1 rounded-[1.5rem] p-8 ${
                      i === 1 ? "bg-forest text-white" : "bg-white text-ink ring-1 ring-line"
                    }`}
                  >
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className={`mt-3 leading-relaxed ${i === 1 ? "text-white/75" : "text-slate"}`}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 07 — Differentiation (Ref 001 quote banner) */}
      <section className="container-x py-20 lg:py-28">
        <div className="relative mx-auto max-w-4xl rounded-[2rem] bg-cloud p-8 ring-1 ring-line sm:p-14">
          <Quote className="absolute -top-6 left-8 h-12 w-12 rounded-2xl bg-lime p-3 text-forest sm:left-14" />
          <h2 className="text-3xl font-semibold sm:text-4xl">Not Another Vendor. Your Technology Partner.</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate">
            You don&apos;t need another company selling software you don&apos;t understand. You need engineers who understand the
            business problem, challenge assumptions, explain trade-offs, and take responsibility for the work.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate">
            At Adbyrd, we bring product thinking, engineering discipline, and practical AI expertise together under one
            collaborative development approach.
          </p>
          <p className="mt-8 border-l-4 border-lime pl-5 font-display text-xl leading-snug font-semibold text-forest">
            No unnecessary complexity. No technology for technology&apos;s sake. Just purposeful systems built to solve
            meaningful problems.
          </p>
        </div>
      </section>

      {/* 08 — Insights (Ref 001 3-column blog grid) */}
      <section className="bg-cloud py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading center eyebrow="Perspectives From a Changing Industry" title="Ideas Worth Building On." />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {insights.map((post, i) => (
              <article key={post.title} className="overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-line">
                <ArchVisual
                  variant={(["nodes", "waves", "circuit"] as const)[i]}
                  className="h-48 rounded-none"
                />
                <div className="p-7">
                  <p className="text-xs font-semibold tracking-[0.16em] text-moss uppercase">{post.category}</p>
                  <h3 className="mt-3 text-xl leading-snug font-semibold">{post.title}</h3>
                  <span className="mt-5 inline-flex rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
                    Coming soon
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — Final CTA */}
      <div className="pt-3">
        <CtaBand
          title="Your Next Competitive Advantage Starts With a Conversation."
          body={
            <p>
              Whether you&apos;re exploring an idea, modernizing existing technology, or preparing to deploy your first AI agent,
              Adbyrd can help define the right next step.
            </p>
          }
          primary={{ href: "/contact", label: "Schedule a Consultation" }}
          secondary={{ href: "/contact#inquiry", label: "Tell Us About Your Project" }}
        />
      </div>
    </>
  );
}
