import type { Metadata } from "next";
import { Compass, Layers, Target, Users } from "lucide-react";
import { ArchVisual, Button, CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { principles } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Adbyrd is a majority woman-of-color-owned firm in Kalamazoo, Michigan, building custom apps and AI tools for small businesses. Formerly a Western Michigan SEO and digital marketing agency.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="Different by Design."
        eyebrow="Who We Are"
        title="Big-Company Technology, Built for Small Business."
        aside={
          <div className="flex items-end justify-center gap-5">
            <ArchVisual variant="waves" className="h-[380px] w-44 ring-1 ring-white/10" />
            <ArchVisual variant="nodes" className="mb-10 h-[300px] w-44 ring-1 ring-white/10" />
          </div>
        }
      >
        <p>
          Adbyrd is a majority woman-of-color-owned technology firm in Kalamazoo, Michigan.
        </p>
        <p className="text-base text-white/65">
          We build custom apps, booking and payment systems, and AI phone receptionists for small businesses—the kind of
          tools that used to be out of reach without an enterprise budget.
        </p>
        <p className="text-base text-white/65">
          We&apos;re not interested in technology for its own sake. We&apos;re interested in fewer missed calls, faster
          payments, and more time back for the people running the business.
        </p>
        <div className="pt-4">
          <Button href="/contact">Work With Adbyrd</Button>
        </div>
      </PageHero>

      {/* Story */}
      <section className="container-x grid gap-14 py-20 lg:grid-cols-[1fr_1fr] lg:py-28">
        <div>
          <SectionHeading eyebrow="Our Story" title="From Getting Businesses Found to Building How They Run." />
          <p className="mt-8 font-display text-2xl leading-snug font-semibold text-night">
            Great technology doesn&apos;t have to come from Silicon Valley—or cost like it.
          </p>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-slate">
          <p>
            Adbyrd started as a Western Michigan SEO and digital marketing agency, helping local businesses get found online.
            Along the way we saw the same problems again and again: missed calls, booking by text, and owners buried in
            busywork that software should handle.
          </p>
          <p>
            AI-assisted development changed what&apos;s possible. Custom apps and AI agents that once took months and
            enterprise budgets can now be built in weeks for a few thousand dollars. So we made the shift—from marketing
            small businesses to building the tools that run them.
          </p>
          <p>
            As a majority woman-of-color-owned firm, we bring a distinct perspective to an industry where the people designing
            technology don&apos;t always reflect the communities and businesses using it.
          </p>
          <p className="border-l-4 border-ember pl-5 font-semibold text-ink">
            Rooted in Kalamazoo. Building for Main Street—here and everywhere.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-lg bg-night p-10 text-white sm:p-12">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-mist/25 blur-3xl" />
            <Target className="relative h-10 w-10 text-mist" />
            <p className="relative mt-8 text-xs font-semibold tracking-[0.18em] text-mist uppercase">Our Mission</p>
            <h2 className="relative mt-3 text-3xl leading-tight font-semibold">
              Make Custom Software and AI Affordable for Small Business.
            </h2>
            <p className="relative mt-5 text-lg leading-relaxed text-white/75">
              We help small businesses replace phone tag, paper, and disconnected tools with focused apps and AI agents—built
              fast, priced fairly, and explained in plain English.
            </p>
          </div>
          <div className="rounded-lg bg-white p-10 ring-1 ring-line sm:p-12">
            <Compass className="h-10 w-10 text-steel" />
            <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-steel uppercase">Our Vision</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold">
              Every Small Business With the Tools Big Companies Take for Granted.
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate">
              <p>
                Online booking, instant answers, automatic follow-up—large companies have had these for years.
              </p>
              <p>
                We want the junk hauler, the salon, the one-person ride service, and the family restaurant to have them too,
                built around how they actually work.
              </p>
              <p>One practical tool at a time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading center eyebrow="Our Principles" title="What You Can Count On." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p.title} className="group rounded-lg p-8 ring-1 ring-line transition-colors hover:bg-fog">
              <span className="font-display text-4xl font-semibold text-haze transition-colors group-hover:text-steel">
                0{i + 1}
              </span>
              <h3 className="mt-5 text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-slate">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Adbyrd Difference */}
      <section className="px-3 sm:px-5">
        <div className="relative overflow-hidden rounded-lg bg-ink text-white">
          <div className="pointer-events-none absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-mist/10 blur-[120px]" />
          <div className="container-x relative py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <SectionHeading light eyebrow="The Adbyrd Difference" title="We Think Like Owners. We Build Like Engineers." />
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">
                  <p>Some developers understand software. Some marketers understand small business.</p>
                  <p>Years of working with local owners taught us both.</p>
                </div>
              </div>
              <div className="space-y-4 text-lg leading-relaxed text-white/70 lg:pt-12">
                <p>
                  That means asking how your business really runs before we write any code, and building something you can
                  understand, use, and grow with.
                </p>
                <p>
                  Not every problem needs an AI agent. Sometimes the right answer is a simple booking form or connecting two
                  tools you already pay for—and we&apos;ll tell you when it is.
                </p>
              </div>
            </div>

            <p className="mt-16 text-sm font-semibold tracking-[0.18em] text-white/50 uppercase">
              Every project starts with three questions
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: Target, t: "What will this do for your business?" },
                { icon: Users, t: "Will your customers find it easy?" },
                { icon: Layers, t: "What's the simplest way to build it?" },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="glass flex items-center gap-4 rounded-lg p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ember text-ink">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="font-display text-lg font-semibold">{t}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 grid gap-2 border-t border-white/10 pt-10 sm:grid-cols-2">
              <p className="text-xl text-white/70">The objective is never to sell you more technology than you need.</p>
              <p className="font-display text-2xl font-semibold text-mist sm:text-right">The objective is to build what works.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="container-x py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading center eyebrow="Our Commitment" title="Your Business Is Personal. So Is Our Work." />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-slate">
            <p>
              Behind every app we build is an owner who put their savings, evenings, and reputation into a business. A few
              thousand dollars is a real investment, and it needs to pay off.
            </p>
            <p className="font-semibold text-ink">We take those decisions seriously.</p>
            <p>
              Our job is to recommend only what will help, quote it honestly, build it well, and stick around after launch.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's Build Something That Pays for Itself."
        primary={{ href: "/contact", label: "Work With Adbyrd" }}
        secondary={{ href: "/what-we-do", label: "See Services & Pricing" }}
      />
    </>
  );
}
