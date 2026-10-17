import type { Metadata } from "next";
import { Check, TrendingUp } from "lucide-react";
import AICore from "@/components/AICore";
import { ArchVisual, Button, CtaBand, PageHero, SectionHeading, icons } from "@/components/ui";
import { engagements, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Fixed-price AI phone receptionists, online booking and payment apps, iPhone apps, and workflow automation for small businesses in Kalamazoo and Western Michigan. Most projects $3,000–$7,500.",
  alternates: { canonical: "/what-we-do" },
};

const visuals = ["nodes", "circuit", "waves", "circuit", "waves", "nodes"] as const;

export default function WhatWeDoPage() {
  return (
    <>
      <PageHero
        kicker="Fixed Price. Built in Weeks."
        eyebrow="Services & Pricing"
        title="The Right Tool for Your Business, at a Price You Know Up Front."
        aside={
          <div className="mx-auto max-w-[420px]">
            <AICore showCards={false} />
          </div>
        }
      >
        <p>
          An AI receptionist that answers every call. A booking app customers actually use. Your own iPhone app. Busywork
          that runs itself.
        </p>
        <p className="text-base text-white/65">
          Most small-business projects cost $3,000 to $7,500, quoted as a fixed price before we start and delivered in
          weeks, not months.
        </p>
        <p className="font-display font-semibold text-mist">You know your business. We build the tool that fits it.</p>
        <div className="flex flex-wrap gap-3 pt-4">
          <Button href="/contact">Get a Fixed-Price Quote</Button>
          <Button href="/process" variant="outline-light">
            See How It Works
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
                  className="inline-flex items-center gap-2 rounded-pill bg-ivory px-4 py-2.5 text-sm font-medium text-slate ring-1 ring-line transition-colors hover:bg-night hover:text-white"
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
              className="scroll-mt-24 grid overflow-hidden rounded-lg bg-white ring-1 ring-line lg:grid-cols-[1.35fr_1fr]"
            >
              <div className={`p-8 sm:p-12 ${flip ? "lg:order-2" : ""}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-fog text-night">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="text-xs font-semibold tracking-[0.18em] text-steel uppercase">{s.eyebrow}</p>
                  <span className="rounded-pill bg-ember px-3 py-1 text-xs font-semibold text-ink">{s.priceFrom}</span>
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
                    <li key={b} className="rounded-pill bg-ivory px-3.5 py-1.5 text-sm text-slate ring-1 ring-line">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`relative flex flex-col justify-end overflow-hidden bg-night p-8 text-white sm:p-12 ${flip ? "lg:order-1" : ""}`}>
                <div className="absolute top-8 left-1/2 h-[62%] w-[58%] max-w-[260px] -translate-x-1/2 opacity-85">
                  <ArchVisual variant={visuals[i]} className="h-full w-full ring-1 ring-white/10" />
                </div>
                <div className="glass relative mt-56 rounded-lg p-6 lg:mt-0">
                  <div className="flex items-center gap-2 text-mist">
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
      <section className="bg-ivory py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading center eyebrow="Packages" title="Clear Packages. Fixed Prices." />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {engagements.map((e) => {
              const featured = e.name === "Booking & Payments App";
              return (
                <div
                  key={e.name}
                  className={`relative flex flex-col rounded-lg p-8 ${
                    featured ? "bg-night text-white shadow-2xl shadow-night/25" : "bg-white ring-1 ring-line"
                  }`}
                >
                  {featured && (
                    <span className="absolute top-6 right-6 rounded-pill bg-ember px-3 py-1 text-xs font-semibold text-ink">
                      Most popular
                    </span>
                  )}
                  <h3 className="pr-24 text-2xl font-semibold">{e.name}</h3>
                  <p className="mt-3 font-display text-3xl font-semibold">{e.price}</p>
                  <p className={`mt-1 text-sm ${featured ? "text-white/60" : "text-slate"}`}>{e.timeline}</p>
                  <div className={`my-6 h-px ${featured ? "bg-white/15" : "bg-line"}`} />
                  <p className={`text-xs font-semibold tracking-[0.16em] uppercase ${featured ? "text-mist" : "text-steel"}`}>
                    Ideal for
                  </p>
                  <p className={`mt-2 ${featured ? "text-white/80" : "text-slate"}`}>{e.idealFor}</p>
                  <p className={`mt-6 text-xs font-semibold tracking-[0.16em] uppercase ${featured ? "text-mist" : "text-steel"}`}>
                    Deliverable
                  </p>
                  <p className="mt-2 flex flex-1 items-start gap-2 font-medium">
                    <Check className={`mt-1 h-4 w-4 shrink-0 ${featured ? "text-mist" : "text-steel"}`} strokeWidth={3} />
                    {e.deliverable}
                  </p>
                  <div className="mt-8">
                    <Button href="/contact" variant={featured ? "ember" : "outline"}>
                      Get a Quote
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
          title="Not Sure Which Package Fits?"
          body={
            <>
              <p>You don&apos;t need technical details or a plan—just tell us what&apos;s costing you time or customers.</p>
              <p className="text-base text-white/55">
                We&apos;ll recommend the simplest option that works and give you a fixed price. Prices shown are starting
                points; your quote is based on exactly what you need.
              </p>
            </>
          }
          primary={{ href: "/contact", label: "Get a Fixed-Price Quote" }}
        />
      </div>
    </>
  );
}
