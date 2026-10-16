import type { Metadata } from "next";
import { Compass, Layers, Target, Users } from "lucide-react";
import { ArchVisual, Button, CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { principles } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Adbyrd is a majority woman-of-color-owned agentic development firm headquartered in Kalamazoo, Michigan.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="Different by Design."
        eyebrow="Who We Are"
        title="Technology Is Changing Everything. We're Here to Help Shape What Comes Next."
        aside={
          <div className="flex items-end justify-center gap-5">
            <ArchVisual variant="waves" className="h-[380px] w-44 ring-1 ring-white/10" />
            <ArchVisual variant="nodes" className="mb-10 h-[300px] w-44 ring-1 ring-white/10" />
          </div>
        }
      >
        <p>
          Adbyrd is a majority woman-of-color-owned agentic development firm headquartered in Kalamazoo, Michigan.
        </p>
        <p className="text-base text-white/65">
          We bring together software engineering, artificial intelligence, intelligent automation, and human-centered design
          to help organizations build technology that moves their businesses forward.
        </p>
        <p className="text-base text-white/65">
          We&apos;re not interested in innovation for its own sake. We&apos;re interested in what happens when intelligent
          technology solves real problems.
        </p>
        <div className="pt-4">
          <Button href="/contact">Work With Adbyrd</Button>
        </div>
      </PageHero>

      {/* Story */}
      <section className="container-x grid gap-14 py-20 lg:grid-cols-[1fr_1fr] lg:py-28">
        <div>
          <SectionHeading eyebrow="Our Story" title="Built in Western Michigan. Thinking Beyond Boundaries." />
          <p className="mt-8 font-display text-2xl leading-snug font-semibold text-forest">
            Great technology doesn&apos;t have to come from Silicon Valley.
          </p>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-slate">
          <p>
            Adbyrd represents a different kind of technology company—one grounded in the resourcefulness, work ethic, and
            entrepreneurial spirit of Western Michigan, with the technical ambition to serve businesses across the country.
          </p>
          <p>
            As a majority woman-of-color-owned firm, we bring a distinct perspective to an industry where the people designing
            technology don&apos;t always reflect the communities and businesses using it.
          </p>
          <p>
            We believe better technology begins with different perspectives, thoughtful questions, and the willingness to
            challenge conventional solutions.
          </p>
          <p className="border-l-4 border-lime pl-5 font-semibold text-ink">
            Our headquarters may be in Kalamazoo. Our vision has no geographic limits.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-cloud py-20 lg:py-28">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2rem] bg-forest p-10 text-white sm:p-12">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-glow/25 blur-3xl" />
            <Target className="relative h-10 w-10 text-lime" />
            <p className="relative mt-8 text-xs font-semibold tracking-[0.18em] text-lime uppercase">Our Mission</p>
            <h2 className="relative mt-3 text-3xl leading-tight font-semibold">
              Make Intelligent Technology Accessible, Practical, and Transformative.
            </h2>
            <p className="relative mt-5 text-lg leading-relaxed text-white/75">
              We exist to help businesses move beyond disconnected tools and manual processes by designing intelligent digital
              systems that improve operations, expand capabilities, and create new opportunities for growth.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-10 ring-1 ring-line sm:p-12">
            <Compass className="h-10 w-10 text-moss" />
            <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-moss uppercase">Our Vision</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold">
              A Future Where Businesses Operate With Intelligence Built In.
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate">
              <p>
                We envision a business landscape where AI is no longer an isolated experiment or an expensive novelty.
              </p>
              <p>
                Instead, intelligent systems become a dependable part of everyday operations—helping teams solve problems,
                make informed decisions, and accomplish more with the resources they already have.
              </p>
              <p>Our ambition is to help engineer that transition, one purposeful solution at a time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading center eyebrow="Our Principles" title="What Guides Every Engagement." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p.title} className="group rounded-[1.5rem] p-8 ring-1 ring-line transition-colors hover:bg-mint">
              <span className="font-display text-4xl font-semibold text-sage transition-colors group-hover:text-moss">
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
        <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white">
          <div className="pointer-events-none absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-lime/10 blur-[120px]" />
          <div className="container-x relative py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <SectionHeading light eyebrow="The Adbyrd Difference" title="Engineering Discipline. Entrepreneurial Thinking." />
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">
                  <p>Some development companies understand software. Others understand business.</p>
                  <p>We believe the most valuable technology partners understand both.</p>
                </div>
              </div>
              <div className="space-y-4 text-lg leading-relaxed text-white/70 lg:pt-12">
                <p>
                  That means asking difficult questions early, choosing technology intentionally, and engineering systems that
                  can be maintained, measured, and improved.
                </p>
                <p>
                  We don&apos;t believe every problem requires an AI agent. Sometimes the best answer is a better workflow, a
                  clean integration, or thoughtfully designed software.
                </p>
              </div>
            </div>

            <p className="mt-16 text-sm font-semibold tracking-[0.18em] text-white/50 uppercase">
              Every engagement, through three interconnected perspectives
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: Target, t: "The business outcome" },
                { icon: Users, t: "The user experience" },
                { icon: Layers, t: "The technical architecture required to deliver it" },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="glass flex items-center gap-4 rounded-2xl p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lime text-ink">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="font-display text-lg font-semibold">{t}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 grid gap-2 border-t border-white/10 pt-10 sm:grid-cols-2">
              <p className="text-xl text-white/70">The objective is never to sell you more technology than you need.</p>
              <p className="font-display text-2xl font-semibold text-lime sm:text-right">The objective is to build what works.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="container-x py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading center eyebrow="Our Commitment" title="Your Ambition Deserves More Than a Development Ticket." />
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-slate">
            <p>
              Behind every application is a business goal. Behind every automation is a team trying to work more effectively.
              Behind every AI initiative is a decision about how an organization will operate in the future.
            </p>
            <p className="font-semibold text-ink">We take those decisions seriously.</p>
            <p>
              Our role is to bring clarity to complex technical challenges, make recommendations grounded in your business
              needs, and build solutions with the discipline those investments deserve.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's Build Something Meaningful."
        primary={{ href: "/contact", label: "Work With Adbyrd" }}
        secondary={{ href: "/what-we-do", label: "Explore Our Capabilities" }}
      />
    </>
  );
}
