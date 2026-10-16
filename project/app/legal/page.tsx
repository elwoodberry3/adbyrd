import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Lock, Cookie, SlidersHorizontal, Accessibility, ShieldCheck, Bot } from "lucide-react";
import { legalDocs } from "@/lib/legal";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Trust & Legal Center",
  description: "Adbyrd's privacy, terms, cookie, accessibility, security, and responsible AI policies.",
  alternates: { canonical: "/legal" },
};

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  privacy: Lock,
  terms: FileText,
  cookies: Cookie,
  "privacy-choices": SlidersHorizontal,
  accessibility: Accessibility,
  security: ShieldCheck,
  "responsible-ai": Bot,
};

export default function LegalIndex() {
  return (
    <section className="container-x py-16 lg:py-24">
      <SectionHeading
        eyebrow="Trust & Legal Center"
        title="Transparency by Default."
        intro={<p>The policies that govern our website, how we handle data, and how we build and operate AI systems responsibly.</p>}
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {legalDocs.map((d) => {
          const Icon = iconFor[d.slug] ?? FileText;
          return (
            <Link key={d.slug} href={`/legal/${d.slug}`} className="group flex flex-col rounded-lg p-7 ring-1 ring-line transition-colors hover:bg-ivory">
              <span className="grid h-11 w-11 place-items-center rounded-pill bg-night text-mist"><Icon className="h-5 w-5" /></span>
              <h2 className="mt-5 text-xl font-semibold">{d.title}</h2>
              <p className="mt-2 flex-1 text-slate">{d.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-night">
                Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
