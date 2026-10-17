import Link from "next/link";
import { ArrowRight, Check, PhoneIncoming, MessageSquareText, CalendarCheck, UserCheck, Smartphone, Quote, MapPin } from "lucide-react";
import AICore from "@/components/AICore";
import IndustryCarousel from "@/components/IndustryCarousel";
import { ArchVisual, Button, CtaBand, Eyebrow, SectionHeading, icons } from "@/components/ui";
import { approach, capabilities, caseStudies, faqs, insights, serviceAreas } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* 01 — Hero */}
      <section className="px-3 pt-3 sm:px-5">
        <div className="relative overflow-hidden rounded-lg bg-night text-white">
          <div className="grid-fade pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-mist/20 blur-[140px]" />
          <div className="container-x relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="glass mb-6 inline-block rounded-pill px-4 py-1.5 text-xs font-semibold tracking-wide text-mist">
                Intelligence, Engineered.
              </span>
              <Eyebrow light>Custom Apps &amp; AI for Small Business · Western Michigan</Eyebrow>
              <h1 className="text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
                Custom Apps &amp; AI That Work as Hard as You Do.
                <span className="mt-2 block text-cream">Built in Weeks. Fixed Price.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
                Adbyrd builds online booking and payment apps, iPhone apps, and AI phone receptionists for small businesses—typically
                $3,000 to $7,500, quoted up front and delivered in weeks, not months.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-white/65">
                Missing calls while you&apos;re on a job? Booking customers by text? Chasing payments? We build the one tool your
                business actually needs—nothing more.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/contact">Get a Fixed-Price Quote</Button>
                <Button href="/what-we-do" variant="outline-light">
                  See Services &amp; Pricing
                </Button>
              </div>
              <p className="mt-8 text-sm text-white/55">
                Based in Kalamazoo. Serving {serviceAreas.slice(1, 4).join(", ")} &amp; small businesses nationwide.
              </p>
            </div>
            <AICore />
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="container-x py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { k: "$3K–$7.5K", v: "Typical project" },
            { k: "Fixed", v: "Price, quoted up front" },
            { k: "Weeks", v: "Not months" },
            { k: "Up to 70%", v: "Faster iPhone builds" },
          ].map((m) => (
            <div key={m.k} className="flex flex-col rounded-lg bg-ivory px-4 py-4 ring-1 ring-line sm:px-6 sm:py-5">
              <span className="font-display text-xl font-semibold sm:text-2xl">{m.k}</span>
              <span className="text-sm text-slate">{m.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 02 — Introduction */}
      <section className="container-x grid items-center gap-14 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-24">
        <div className="relative mx-auto flex w-full max-w-md items-end gap-5">
          <ArchVisual variant="circuit" className="h-[360px] flex-1 sm:h-[440px]" />
          <ArchVisual variant="nodes" className="mb-12 h-[260px] flex-1 sm:h-[320px]" />
        </div>
        <div>
          <SectionHeading
            eyebrow="Built for Small Business"
            title="Your Business Is One of a Kind. Your Tools Should Be Too."
          />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate">
            <p>
              Off-the-shelf software is built for everyone, so it fits no one quite right. You end up working around it—or
              doing the work by hand.
            </p>
            <p>
              Adbyrd builds small, focused tools around the way your business actually runs: a booking app that asks the right
              questions, an AI receptionist that knows your services, an app with your name on it.
            </p>
            <p>
              We started as Western Michigan&apos;s SEO and digital marketing agency. Now we build the apps and AI that run small
              businesses—and we still make sure customers can find you.
            </p>
          </div>
          <div className="mt-8">
            <Button href="/about" variant="dark">
              Meet Adbyrd
            </Button>
          </div>
        </div>
      </section>

      {/* 03 — Services */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading center eyebrow="What We Build" title="Practical Tools. Real Results for Your Business." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => {
              const Icon = icons[c.icon];
              return (
                <Link
                  key={c.title}
                  href={`/what-we-do#${c.anchor}`}
                  className="group relative flex flex-col rounded-lg bg-white p-8 ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-night/10"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-lg bg-fog text-night transition-colors group-hover:bg-ember">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-sm font-semibold text-slate/60">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{c.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-slate">{c.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-night">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Button href="/what-we-do" variant="dark">
              See Packages &amp; Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* 04 — AI receptionist spotlight */}
      <section className="px-3 py-3 sm:px-5">
        <div className="relative overflow-hidden rounded-lg bg-ink text-white">
          <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-mist/15 blur-[130px]" />
          <div className="container-x relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <SectionHeading light eyebrow="AI That Gets Work Done" title="Never Miss Another Call. Never Lose Another Job." />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">
                <p>
                  When you&apos;re under a sink, behind the wheel, or with a client, the phone keeps ringing. Every missed call is
                  a customer who might call your competitor next.
                </p>
                <p className="text-white/60">
                  An Adbyrd AI receptionist answers in a natural voice, knows your services and prices, books the job, and
                  sends you a summary. Anything unusual comes straight to you.
                </p>
                <p className="font-display font-semibold text-mist">AI handles the routine. You stay in charge.</p>
              </div>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Answers calls 24/7, including after hours",
                  "Books appointments and pickups",
                  "Texts you every call summary",
                  "Hands sensitive calls back to you",
                ].map((b) => (
                  <li key={b} className="glass flex items-start gap-3 rounded-lg p-4 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mist" strokeWidth={3} />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <Button href="/what-we-do#ai-receptionist">Explore the AI Receptionist</Button>
              </div>
            </div>

            {/* Illustrative call flow */}
            <div className="glass relative rounded-lg p-6 sm:p-8" aria-label="Example AI receptionist call">
              <p className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">Example: a call at 7:40 pm</p>
              <ol className="mt-6 space-y-3">
                {[
                  { icon: PhoneIncoming, t: "Customer calls your business", s: "You're finishing a job across town" },
                  { icon: MessageSquareText, t: "AI receptionist answers", s: "Explains services, pricing, availability" },
                  { icon: CalendarCheck, t: "Job booked", s: "Details captured, confirmation sent" },
                  { icon: UserCheck, t: "Unusual request?", s: "Routed straight to you", highlight: true },
                  { icon: Smartphone, t: "Summary on your phone", s: "Caller, need, and next step—by text" },
                ].map((step, i, arr) => (
                  <li key={step.t} className="relative flex gap-4">
                    {i < arr.length - 1 && <span className="absolute top-12 left-[22px] h-[calc(100%-28px)] w-px bg-white/15" />}
                    <span
                      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                        step.highlight ? "bg-ember text-ink" : "bg-white/10 text-mist"
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

      {/* 05 — Client stories */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading eyebrow="Recent Work" title="Built for Real Small Businesses." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {caseStudies.map((c) => (
            <article key={c.client} className="flex flex-col rounded-lg bg-white p-8 ring-1 ring-line sm:p-10">
              <p className="text-xs font-semibold tracking-[0.16em] text-steel uppercase">{c.label}</p>
              <h3 className="mt-3 text-2xl font-semibold">{c.client}</h3>
              <dl className="mt-6 flex-1 space-y-5 leading-relaxed">
                <div>
                  <dt className="text-sm font-semibold text-ink">The problem</dt>
                  <dd className="mt-1 text-slate">{c.problem}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink">What we built</dt>
                  <dd className="mt-1 text-slate">{c.built}</dd>
                </div>
              </dl>
              <p className="mt-6 border-l-4 border-ember pl-5 font-display text-lg leading-snug font-semibold text-night">
                {c.result}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 06 — Industries */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Who We Help" title="Built for the Businesses That Keep Main Street Running." />
            <p className="max-w-sm text-slate">
              Different businesses, same problems: missed calls, manual booking, and hours lost to busywork.
            </p>
          </div>
          <div className="mt-12">
            <IndustryCarousel />
          </div>
        </div>
      </section>

      {/* 07 — How it works */}
      <section className="bg-fog py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="How It Works" title="Simple Process. Fixed Price. Fast Launch." />
            <Button href="/process" variant="dark">
              See How We Work
            </Button>
          </div>
          <div className="relative mt-16">
            <div className="absolute top-5 right-[16%] left-[16%] hidden border-t-2 border-dashed border-night/25 md:block" />
            <ol className="grid gap-6 md:grid-cols-3">
              {approach.map((s, i) => (
                <li key={s.title} className="flex flex-col items-center text-center">
                  <span
                    className={`relative z-10 grid h-11 w-11 place-items-center rounded-pill font-display text-sm font-semibold ring-4 ring-fog ${
                      i === 1 ? "bg-ember text-ink" : "bg-white text-night ring-offset-0"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <div
                    className={`mt-6 w-full flex-1 rounded-lg p-8 ${
                      i === 1 ? "bg-night text-white" : "bg-white text-ink ring-1 ring-line"
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

      {/* 08 — Differentiation */}
      <section className="container-x py-20 lg:py-28">
        <div className="relative mx-auto max-w-4xl rounded-lg bg-ivory p-8 ring-1 ring-line sm:p-14">
          <Quote className="absolute -top-6 left-8 h-12 w-12 rounded-lg bg-ember p-3 text-night sm:left-14" />
          <h2 className="text-3xl font-semibold sm:text-4xl">Big-Company Technology. Small-Business Price.</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate">
            You shouldn&apos;t need an enterprise budget to get software built around your business. AI-assisted development lets
            us build in weeks what used to take months—and pass that speed on to you as a fixed, affordable price.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate">
            You work directly with the people building your app, in plain English, from first call to launch.
          </p>
          <p className="mt-8 border-l-4 border-ember pl-5 font-display text-xl leading-snug font-semibold text-night">
            No jargon. No surprise invoices. No technology you don&apos;t need.
          </p>
        </div>
      </section>

      {/* 09 — FAQ (also emitted as FAQPage structured data) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <section id="faq" className="bg-ivory py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Questions" title="Straight Answers for Small Business Owners." />
            <p className="mt-6 flex items-start gap-2 text-slate">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-steel" />
              Serving {serviceAreas.join(", ")} and small businesses across the U.S.
            </p>
          </div>
          <div className="divide-y divide-line rounded-lg bg-white ring-1 ring-line">
            {faqs.map((f) => (
              <details key={f.q} className="group p-6 sm:p-7">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold">
                  {f.q}
                  <span className="mt-1 text-steel transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — Insights */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading center eyebrow="Guides for Owners" title="Know Before You Build." />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {insights.map((post, i) => (
              <article key={post.title} className="overflow-hidden rounded-lg bg-white ring-1 ring-line">
                <ArchVisual
                  variant={(["nodes", "waves", "circuit"] as const)[i]}
                  className="h-48 rounded-none"
                />
                <div className="p-7">
                  <p className="text-xs font-semibold tracking-[0.16em] text-steel uppercase">{post.category}</p>
                  <h3 className="mt-3 text-xl leading-snug font-semibold">{post.title}</h3>
                  <span className="mt-5 inline-flex rounded-pill bg-fog px-3 py-1 text-xs font-semibold text-night">
                    Coming soon
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — Final CTA */}
      <div className="pt-3">
        <CtaBand
          title="Tell Us What's Slowing Your Business Down."
          body={
            <p>
              Missed calls, manual booking, or an app idea you&apos;ve been sitting on—start with a free conversation and get a
              fixed-price quote if custom work makes sense.
            </p>
          }
          primary={{ href: "/contact", label: "Get a Fixed-Price Quote" }}
          secondary={{ href: "/contact#inquiry", label: "Tell Us About Your Business" }}
        />
      </div>
    </>
  );
}
