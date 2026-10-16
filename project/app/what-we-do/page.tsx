import type { Metadata } from "next";
import { Check, TrendingUp } from "lucide-react";
import AICore from "@/components/AICore";
import { ArchVisual, Button, CtaBand, PageHero, SectionHeading, icons } from "@/components/ui";
import { engagements, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Agentic AI development, custom software, business process automation, AI integration and modernization, product strategy and UX, and managed AI operations.",
};

const visuals = ["nodes", "circuit", "waves", "circuit", "waves", "nodes"] as const;

export default function WhatWeDoPage() {
  return (
    <>
      <PageHero
        kicker="Your Vision. Engineered Into Reality."
        eyebrow="Our Services & Capabilities"
        title="Whatever Your Business Needs Next, Let's Build It."
        aside={
          <div className="mx-auto max-w-[420px]">
            <AICore />
          </div>
        }
      >
        <p>
          A new digital product. An intelligent business assistant. A custom application. A workflow that practically runs
          itself.
        </p>
        <p className="text-base text-white/65">
          Whatever the challenge, Adbyrd combines strategic thinking and technical execution to transform your ideas into
          functional, connected, and scalable technology.
        </p>
        <p className="font-display font-semibold text-lime">You bring the business vision. We help engineer the solution.</p>
        <div className="flex flex-wrap gap-3 pt-4">
          <Button href="/contact">Discuss Your Project</Button>
          <Button href="/process" variant="outline-light">
            Explore Our Process
          </Button>
        </div>
      </PageHero>

      {/* Jump nav */}
      <nav aria-label="Services" className="container-x pt-10">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {services.map((s) => {
            const Icon = icons[s.icon];
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-cloud px-4 py-2.5 text-sm font-medium text-slate ring-1 ring-line transition-colors hover:bg-forest hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {s.eyebrow}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Services — asymmetrical split feature sections (Ref 002) */}
      <div className="container-x space-y-6 py-12 lg:py-16">
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          const flip = i % 2 === 1;
          return (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 grid overflow-hidden rounded-[2rem] bg-white ring-1 ring-line lg:grid-cols-[1.35fr_1fr]"
            >
              <div className={`p-8 sm:p-12 ${flip ? "lg:order-2" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="text-xs font-semibold tracking-[0.18em] text-moss uppercase">{s.eyebrow}</p>
                </div>
                <h2 className="mt-6 text-3xl leading-tight font-semibold sm:text-4xl">{s.title}</h2>
                <div className="mt-5 space-y-3 leading-relaxed text-slate">
                  {s.body.map((p, k) => (
                    <p key={k} className={k === 0 ? "text-lg font-medium text-ink" : ""}>
                      {p}
                    </p>
                  ))}
                </div>
                <p className="mt-8 text-sm font-semibold">{s.buildLabel}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.build.map((b) => (
                    <li key={b} className="rounded-full bg-cloud px-3.5 py-1.5 text-sm text-slate ring-1 ring-line">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`relative flex flex-col justify-end overflow-hidden bg-forest p-8 text-white sm:p-12 ${flip ? "lg:order-1" : ""}`}>
                <div className="absolute top-8 left-1/2 h-[62%] w-[58%] max-w-[260px] -translate-x-1/2 opacity-85">
                  <ArchVisual variant={visuals[i]} className="h-full w-full ring-1 ring-white/10" />
                </div>
                <div className="glass relative mt-56 rounded-2xl p-6 lg:mt-0">
                  <div className="flex items-center gap-2 text-lime">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-semibold tracking-[0.18em] uppercase">Business outcome</span>
                  </div>
                  <p className="mt-3 font-display text-xl leading-snug font-semibold">{s.outcome}</p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Engagement models (Ref 002 vertical table/cards) */}
      <section className="bg-cloud py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading center eyebrow="How We Can Work Together" title="The Right Engagement for the Right Challenge." />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {engagements.map((e) => {
              const featured = e.name === "Agentic Transformation";
              return (
                <div
                  key={e.name}
                  className={`relative flex flex-col rounded-[1.75rem] p-8 ${
                    featured ? "bg-forest text-white shadow-2xl shadow-forest/25" : "bg-white ring-1 ring-line"
                  }`}
                >
                  {featured && (
                    <span className="absolute top-6 right-6 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-ink">
                      Agentic focus
                    </span>
                  )}
                  <h3 className="pr-24 text-2xl font-semibold">{e.name}</h3>
                  <div className={`my-6 h-px ${featured ? "bg-white/15" : "bg-line"}`} />
                  <p className={`text-xs font-semibold tracking-[0.16em] uppercase ${featured ? "text-lime" : "text-moss"}`}>
                    Ideal for
                  </p>
                  <p className={`mt-2 ${featured ? "text-white/80" : "text-slate"}`}>{e.idealFor}</p>
                  <p className={`mt-6 text-xs font-semibold tracking-[0.16em] uppercase ${featured ? "text-lime" : "text-moss"}`}>
                    Deliverable
                  </p>
                  <p className="mt-2 flex flex-1 items-start gap-2 font-medium">
                    <Check className={`mt-1 h-4 w-4 shrink-0 ${featured ? "text-lime" : "text-moss"}`} strokeWidth={3} />
                    {e.deliverable}
                  </p>
                  <div className="mt-8">
                    <Button href="/contact" variant={featured ? "lime" : "outline"}>
                      Discuss This Engagement
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="pt-3">
        <CtaBand
          title="Let's Turn Your Next Big Challenge Into Your Next Big Capability."
          body={
            <>
              <p>You don&apos;t need to arrive with technical specifications or a fully developed product plan.</p>
              <p className="text-base text-white/55">
                Tell us what you&apos;re trying to accomplish. We&apos;ll help you understand what is possible, what makes
                business sense, and what it could take to build.
              </p>
            </>
          }
          primary={{ href: "/contact", label: "Start a Project Conversation" }}
        />
      </div>
    </>
  );
}
