import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { capabilities, nav } from "@/lib/content";
import { legalDocs } from "@/lib/legal";
import { addressOneLine, contact, gbp } from "@/lib/site-config";
import CookieSettingsButton from "./analytics/CookieSettingsButton";
import SocialLinks from "./SocialLinks";
import { Logo } from "./ui";

export default function Footer() {
  return (
    <footer className="bg-white" data-placement="footer">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1.2fr_0.95fr_1.3fr]">
        <div>
          <Link href="/" aria-label="Adbyrd home" className="inline-block">
            <Logo withText />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate">
            Strategy. Design. Engineering. Deployment. One technology partner.
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate">
            A majority woman-of-color-owned agentic development firm.
          </p>
          <SocialLinks className="mt-6" placement="footer" />
        </div>

        <FooterCol title="Company">
          {nav.map((n) => (
            <FooterLink key={n.href} href={n.href}>
              {n.label}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Capabilities">
          {capabilities.map((c) => (
            <FooterLink key={c.anchor} href={`/what-we-do#${c.anchor}`}>
              {c.title}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Trust & Legal">
          {legalDocs.map((d) => (
            <FooterLink key={d.slug} href={`/legal/${d.slug}`}>
              {d.short}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Headquarters">
          <li>
            <a
              href={gbp.directionsUrl}
              target="_blank"
              rel="noopener"
              data-directions
              className="flex gap-2.5 text-sm text-slate transition-colors hover:text-night"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
              <span>
                {contact.street}
                <br />
                {contact.city}, {contact.region} {contact.postalCode}
              </span>
            </a>
          </li>
          <li>
            <a href={`tel:${contact.phoneE164}`} className="flex items-center gap-2.5 text-sm text-slate transition-colors hover:text-night">
              <Phone className="h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
              {contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-sm text-slate transition-colors hover:text-night">
              <Mail className="h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
              {contact.email}
            </a>
          </li>
          <li className="pt-2">
            <Link
              href="/contact"
              data-cta="Connect With Our Team"
              className="inline-flex rounded-pill bg-night px-4 py-2.5 text-sm font-semibold text-white hover:bg-night-2"
            >
              Connect With Our Team
            </Link>
          </li>
          {gbp.reviewUrl && (
            <li>
              <a href={gbp.reviewUrl} target="_blank" rel="noopener" className="text-sm font-medium text-night underline underline-offset-4">
                Review us on Google
              </a>
            </li>
          )}
        </FooterCol>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-slate lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} Adbyrd. All rights reserved. · <span className="sr-only">Address: </span>
            {addressOneLine}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/legal/privacy" className="hover:text-night">Privacy</Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-night">Terms</Link>
            </li>
            <li>
              <Link href="/legal/privacy-choices" className="hover:text-night">Your Privacy Choices</Link>
            </li>
            <li>
              <CookieSettingsButton className="hover:text-night" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-ink">{title}</h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-slate transition-colors hover:text-night">
        {children}
      </Link>
    </li>
  );
}
