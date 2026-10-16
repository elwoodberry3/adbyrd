import type { Metadata } from "next";
import {
  CalendarCheck,
  FileText,
  GitPullRequestArrow,
  LifeBuoy,
  MessagesSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button, CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { accountability, stages } from "@/lib/content";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How Adbyrd builds custom apps and AI receptionists for small businesses: free consultation, fixed-price proposal, build, launch, and support. Most projects launch in weeks.",
  alternates: { canonical: "/process" },
};

const accIcons = [CalendarCheck, MessagesSquare, FileText, GitPullRequestArrow, ShieldCheck, LifeBuoy];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        kicker="Simple. Fixed Price. Fast."
        eyebrow="How It Works"
        title="From First Call to Launch in Weeks—With No Surprises."
        aside={
          <ol className="glass space-y-1 rounded-lg p-6">
            {stages.map((s, i) => (
              <li key={s.label} className="flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-pill font-display text-xs font-semibold ${
                    i === 0 ? "bg-ember text-ink" : "bg-white/10 text-white"
                  }`}
                >
                  0{i + 1}
                </span>
                <span className="font-medium text-white/85">{s.label}</span>
              </li>
            ))}
          </ol>
        }
      >
        <p>
          Working with a developer shouldn&apos;t feel like a gamble. You should know what you&apos;re getting, what it
          costs, and when it will be ready—before you spend a dollar.
        </p>
        <p className="text-base text-white/65">
          Our process is built for busy owners: a short conversation, a fixed-price proposal, regular check-ins, and a launch
          you&apos;re ready for.
        </p>
        <p className="text-base text-white/65">
          No jargon. No hourly billing surprises. No disappearing developer.
        </p>
        <div className="pt-4">
          <Button href="/contact">Book a Free Consultation</Button>
        </div>
      </PageHero>

      {/* Stages — timeline */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading center eyebrow="Five Simple Steps" title="What Working With Adbyrd Looks Like." />
        <ol className="relative mx-auto mt-16 max-w-5xl">
          <span className="absolute top-2 bottom-2 left-[23px] w-px bg-line md:left-1/2" aria-hidden="true" />
          {stages.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.label} className="relative pb-10 pl-16 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                <span className="absolute top-0 left-0 z-10 grid h-12 w-12 place-items-center rounded-pill bg-night font-display text-sm font-semibold text-mist ring-8 ring-white md:left-1/2 md:-translate-x-1/2">
                  0{i + 1}
                </span>
                <div className={right ? "md:col-start-2" : "md:col-start-1 md:text-right"}>
                  <div className="rounded-lg bg-white p-7 text-left ring-1 ring-line transition-shadow hover:shadow-xl hover:shadow-night/5">
                    <p className="text-xs font-semibold tracking-[0.16em] text-steel uppercase">{s.label}</p>
                    <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate">{s.body}</p>
                    <div className="mt-5 flex items-start gap-2 rounded-xl bg-fog px-4 py-3 text-sm">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-steel" />
                      <p>
                        <span className="font-semibold text-night">Your outcome: </span>
                        {s.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Accountability */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <SectionHeading
              eyebrow="Our Promise"
              title="You'll Always Know Where Your Project Stands."
            />
            <div className="space-y-3 text-lg leading-relaxed text-slate">
              <p>
                Small businesses can&apos;t afford a project that drifts. We keep the scope tight, the price fixed, and you in
                the loop.
              </p>
              <p className="font-medium text-ink">Clear expectations, written down, from day one.</p>
            </div>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {accountability.map((a, i) => {
              const Icon = accIcons[i];
              return (
                <div key={a.title} className="rounded-lg bg-white p-8 ring-1 ring-line">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-night text-mist">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{a.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{a.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Responsible Agentic Engineering */}
      <section className="px-3 py-3 sm:px-5">
        <div className="relative overflow-hidden rounded-lg bg-night text-white">
          <div className="grid-fade pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-mist/20 blur-[130px]" />
          <div className="container-x relative grid gap-14 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <SectionHeading
                light
                eyebrow="AI With Guardrails"
                title="Your AI Works for You. Never Instead of You."
              />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">
                <p>
                  An AI receptionist talks to your customers, so it has to represent your business well. We set it up to
                  handle routine questions and bookings, and to know when to hand things to you.
                </p>
                <p>You decide what it can and can&apos;t do.</p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-10">
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "Knows your services, hours, and prices",
                  "Only does what you approve",
                  "Sends unusual calls straight to you",
                  "Protects your customers' information",
                  "Tested on real call scenarios before launch",
                  "Every call logged and summarized",
                ].map((t) => (
                  <li key={t} className="glass rounded-lg px-5 py-4 text-sm font-medium">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="border-l-4 border-ember pl-6">
                <p className="text-lg text-white/70">AI handles the routine.</p>
                <p className="mt-1 font-display text-2xl font-semibold text-mist sm:text-3xl">
                  You stay in charge of your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready When You Are."
        body={
          <p>
            Start with a free consultation. If custom work makes sense, you&apos;ll get a fixed-price quote and a launch date.
          </p>
        }
        primary={{ href: "/contact", label: "Book a Free Consultation" }}
      />
    </>
  );
}
