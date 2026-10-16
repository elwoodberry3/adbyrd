import Link from "next/link";
import { MapPin } from "lucide-react";
import { capabilities, nav, site } from "@/lib/content";
import { Logo } from "./ui";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1.1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate">
            Strategy. Design. Engineering. Deployment. One technology partner.
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate">
            A majority woman-of-color-owned agentic development firm.
          </p>
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

        <FooterCol title="Headquarters">
          <li className="flex gap-2.5 text-sm text-slate">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
            {site.location}
          </li>
          <li className="text-sm text-slate">Built for businesses everywhere.</li>
          <li className="pt-2">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink hover:bg-lime-2"
            >
              Connect With Our Team
            </Link>
          </li>
        </FooterCol>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Adbyrd. All rights reserved.</p>
          <p>Intelligence, Engineered. — Kalamazoo, Michigan</p>
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
      <Link href={href} className="text-sm text-slate transition-colors hover:text-forest">
        {children}
      </Link>
    </li>
  );
}
