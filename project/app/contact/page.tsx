import type { Metadata } from "next";
import { Building2, Lightbulb, MapPin, Rocket, Settings2, Users } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import { ArchVisual, Button, CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { nextSteps, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Planning a new digital product, exploring agentic AI, or modernizing existing software? Tell Adbyrd what you're working on.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Let's Build What's Next."
        eyebrow="Start a Conversation"
        title="Have a Challenge Worth Solving? We'd Like to Hear About It."
        aside={
          <div className="glass mx-auto max-w-sm rounded-[1.75rem] p-7">
            <p className="text-xs font-semibold tracking-[0.18em] text-lime uppercase">What happens next</p>
            <ol className="mt-5 space-y-4">
              {nextSteps.map((s, i) => (
                <li key={s.title} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 font-display text-xs font-semibold">
                    0{i + 1}
                  </span>
                  <span className="text-sm font-medium text-white/85">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>
        }
      >
        <p>
          Whether you&apos;re planning a new digital product, exploring agentic AI, modernizing existing software, or trying to
          eliminate an expensive operational bottleneck, the right conversation can help clarify what comes next.
        </p>
        <p className="text-base text-white/65">
          Tell us what you&apos;re working on. We&apos;ll explore the challenge, ask the right questions, and determine whether
          Adbyrd is the right technology partner.
        </p>
        <div className="pt-4">
          <Button href="#inquiry">Tell Us About Your Project</Button>
        </div>
      </PageHero>

      {/* Form + What Happens Next (Ref 001 contact details + form) */}
      <section id="inquiry" className="container-x scroll-mt-24 grid gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
        <div>
          <SectionHeading eyebrow="What Happens Next?" title="A Straightforward Start. No Unnecessary Complexity." />
          <ol className="mt-10 space-y-4">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="flex gap-5 rounded-[1.5rem] bg-cloud p-6 ring-1 ring-line">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-sm font-semibold ${
                    i === 0 ? "bg-lime text-ink" : "bg-forest text-lime"
                  }`}
                >
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-slate">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center gap-4 rounded-[1.5rem] p-6 ring-1 ring-line">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint text-moss">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-slate uppercase">Headquarters</p>
              <p className="font-semibold">{site.location}</p>
            </div>
          </div>
        </div>
        <InquiryForm />
      </section>

      {/* Who should reach out */}
      <section className="bg-cloud py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Who Should Reach Out?"
            title="From First-Time Founders to Established Technology Teams."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: Rocket, t: "Entrepreneurs bringing new products to market" },
              { icon: Lightbulb, t: "Business leaders exploring AI" },
              { icon: Building2, t: "Companies with outdated systems" },
              { icon: Settings2, t: "Organizations pursuing automation" },
              { icon: Users, t: "Technical teams that need specialized engineering expertise" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="rounded-[1.5rem] bg-white p-6 ring-1 ring-line">
                <Icon className="h-6 w-6 text-moss" />
                <p className="mt-4 font-medium leading-snug">{t}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-14 max-w-2xl text-center">
            <p className="text-lg text-slate">You don&apos;t need to know exactly what technology to use.</p>
            <p className="mt-2 font-display text-2xl font-semibold">You need to know what you&apos;re trying to accomplish.</p>
            <p className="mt-2 font-display text-2xl font-semibold text-moss">We&apos;ll start there.</p>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <SectionHeading eyebrow="Location" title="Rooted in Kalamazoo. Connected to What's Next." />
          <p className="mt-6 text-lg leading-relaxed text-slate">
            Adbyrd is proud to contribute to Western Michigan&apos;s evolving technology and entrepreneurial ecosystem while
            collaborating with businesses beyond the region.
          </p>
          <div className="mt-8">
            <Button href="#inquiry" variant="dark">
              Connect With Our Team
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] bg-forest p-10 text-white">
            <div className="grid-fade absolute inset-0" />
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/25 blur-3xl" />
            <div className="relative flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-lime uppercase">Headquarters</p>
                <p className="mt-3 font-display text-3xl font-semibold">Kalamazoo,</p>
                <p className="font-display text-3xl font-semibold">Michigan, USA</p>
                <p className="mt-6 text-white/60">Built for businesses everywhere.</p>
              </div>
              <ArchVisual variant="nodes" className="hidden h-56 w-36 shrink-0 ring-1 ring-white/10 sm:block" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="The Next Version of Your Business Starts With an Idea."
        body={
          <>
            <p>It doesn&apos;t have to be perfectly defined.</p>
            <p>It just has to be worth exploring.</p>
          </>
        }
        primary={{ href: "/contact#inquiry", label: "Start the Conversation" }}
      />
    </>
  );
}
