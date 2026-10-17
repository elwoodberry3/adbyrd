import type { Metadata } from "next";
import { Building2, Mail, MapPin, Phone, Rocket, Settings2, Users } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import { ArchVisual, Button, CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { nextSteps, serviceAreas } from "@/lib/content";
import { contact, gbp } from "@/lib/site-config";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get a free consultation and fixed-price quote for a custom app, booking system, iPhone app, or AI phone receptionist. Adbyrd is based in Kalamazoo, Michigan.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Free Consultation. Fixed-Price Quote."
        eyebrow="Get a Quote"
        title="What's Costing Your Business Time or Customers?"
        aside={
          <div className="glass mx-auto max-w-sm rounded-lg p-7">
            <p className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">What happens next</p>
            <ol className="mt-5 space-y-4">
              {nextSteps.map((s, i) => (
                <li key={s.title} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-white/10 font-display text-xs font-semibold">
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
          Missed calls, booking by text, chasing payments, or an app idea you&apos;ve been sitting on—tell us what&apos;s
          going on and we&apos;ll tell you the simplest way to fix it.
        </p>
        <p className="text-base text-white/65">
          Most projects cost $3,000 to $7,500 as a fixed price. If you don&apos;t need custom software, we&apos;ll say so.
        </p>
        <div className="pt-4">
          <Button href="#inquiry">Tell Us About Your Business</Button>
        </div>
      </PageHero>

      {/* Form + What Happens Next (Ref 001 contact details + form) */}
      <section id="inquiry" className="container-x scroll-mt-24 grid gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
        <div>
          <SectionHeading eyebrow="What Happens Next?" title="A Simple Start. No Pressure." />
          <ol className="mt-10 space-y-4">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="flex gap-5 rounded-lg bg-ivory p-6 ring-1 ring-line">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-pill font-display text-sm font-semibold ${
                    i === 0 ? "bg-ember text-ink" : "bg-night text-mist"
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
          <ul className="mt-6 divide-y divide-line rounded-lg ring-1 ring-line" data-placement="contact_details">
            <ContactRow icon={MapPin} label="Headquarters" href={gbp.directionsUrl} external>
              {contact.street}, {contact.city}, {contact.region} {contact.postalCode}
            </ContactRow>
            <ContactRow icon={Phone} label="Phone" href={`tel:${contact.phoneE164}`}>
              {contact.phoneDisplay}
            </ContactRow>
            <ContactRow icon={Mail} label="Email" href={`mailto:${contact.email}`}>
              {contact.email}
            </ContactRow>
          </ul>
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-slate uppercase">Follow Adbyrd</p>
            <SocialLinks placement="contact_page" />
          </div>
        </div>
        <InquiryForm />
      </section>

      {/* Who should reach out */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Who We Help"
            title="Small Businesses Ready to Work Smarter."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: Phone, t: "Owner-operators missing calls while they work" },
              { icon: Settings2, t: "Service businesses booking by phone and text" },
              { icon: Rocket, t: "Owners with an app idea for their customers" },
              { icon: Building2, t: "Businesses launching a new service or direction" },
              { icon: Users, t: "Small teams buried in repetitive admin work" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="rounded-lg bg-white p-6 ring-1 ring-line">
                <Icon className="h-6 w-6 text-steel" />
                <p className="mt-4 font-medium leading-snug">{t}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-14 max-w-2xl text-center">
            <p className="text-lg text-slate">You don&apos;t need to know anything about technology.</p>
            <p className="mt-2 font-display text-2xl font-semibold">You just need to know what&apos;s slowing you down.</p>
            <p className="mt-2 font-display text-2xl font-semibold text-steel">We&apos;ll start there.</p>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <SectionHeading eyebrow="Location" title="Rooted in Kalamazoo. Serving Western Michigan." />
          <p className="mt-6 text-lg leading-relaxed text-slate">
            Adbyrd works with small businesses across {serviceAreas.join(", ")}—and builds for owners across the U.S.
            who want a local-feeling partner without the big-agency price.
          </p>
          <div className="mt-8">
            <Button href="#inquiry" variant="dark">
              Get a Fixed-Price Quote
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg bg-night p-10 text-white">
            <div className="grid-fade absolute inset-0" />
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mist/25 blur-3xl" />
            <div className="relative flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">Headquarters</p>
                <p className="mt-3 font-display text-3xl font-semibold">{contact.street}</p>
                <p className="font-display text-3xl font-semibold">
                  {contact.city}, {contact.region} {contact.postalCode}
                </p>
                <p className="mt-6 text-white/60">Serving Western Michigan and small businesses nationwide.</p>
                <a
                  href={gbp.directionsUrl}
                  target="_blank"
                  rel="noopener"
                  data-directions
                  className="mt-6 inline-flex rounded-pill bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Get Directions
                </a>
              </div>
              <ArchVisual variant="nodes" className="hidden h-56 w-36 shrink-0 ring-1 ring-white/10 sm:block" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Your Next Customer Might Be Calling Right Now."
        body={
          <>
            <p>Let&apos;s make sure someone answers.</p>
          </>
        }
        primary={{ href: "/contact#inquiry", label: "Get a Fixed-Price Quote" }}
      />
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  href,
  external = false,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener", "data-directions": "" } : {})}
        className="flex items-center gap-4 p-5 transition-colors hover:bg-ivory"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-pill bg-fog text-steel">
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-xs font-semibold tracking-[0.16em] text-slate uppercase">{label}</span>
          <span className="block font-semibold text-ink">{children}</span>
        </span>
      </a>
    </li>
  );
}
