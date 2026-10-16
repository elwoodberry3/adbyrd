import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { LEGAL_LAST_UPDATED, getLegalDoc, legalDocs } from "@/lib/legal";
import CookieSettingsButton from "@/components/analytics/CookieSettingsButton";

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/legal/${doc.slug}` },
  };
}

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <>
      <section className="border-b border-line bg-ivory">
        <div className="container-x py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-slate">
            <Link href="/legal" className="hover:text-night">Trust &amp; Legal</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{doc.short}</span>
          </nav>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{doc.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">{doc.summary}</p>
          <p className="mt-4 text-sm text-slate">Last updated: {LEGAL_LAST_UPDATED}</p>
        </div>
      </section>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[240px_1fr] lg:py-20">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold tracking-[0.16em] text-steel uppercase">On this page</p>
          <ul className="mt-3 space-y-2 text-sm">
            {doc.sections.map((s) => (
              <li key={s.heading}>
                <a href={`#${anchor(s.heading)}`} className="text-slate hover:text-night">{s.heading}</a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-steel uppercase">Other policies</p>
          <ul className="mt-3 space-y-2 text-sm">
            {legalDocs.filter((d) => d.slug !== doc.slug).map((d) => (
              <li key={d.slug}>
                <Link href={`/legal/${d.slug}`} className="text-slate hover:text-night">{d.short}</Link>
              </li>
            ))}
          </ul>
        </aside>

        <article className="max-w-3xl">
          <div role="note" className="mb-10 flex gap-3 rounded-lg border border-ember/40 bg-ember/10 p-5 text-sm text-ink">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-ember-2" aria-hidden="true" />
            <p>
              <strong>Placeholder template.</strong> This page is a structured draft for review. It is not legal advice and must
              be completed and approved by qualified counsel before publication. Replace all bracketed items.
            </p>
          </div>

          {doc.sections.map((s) => (
            <section key={s.heading} id={anchor(s.heading)} className="scroll-mt-24 border-t border-line py-8 first-of-type:border-t-0 first-of-type:pt-0">
              <h2 className="text-2xl font-semibold">{s.heading}</h2>
              <div className="mt-4 space-y-3 leading-relaxed text-slate">
                {s.body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {s.list && (
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-slate marker:text-ember">
                  {s.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
              {(doc.slug === "cookies" || doc.slug === "privacy-choices") && s === doc.sections[doc.slug === "cookies" ? 2 : 0] && (
                <div className="mt-6">
                  <CookieSettingsButton className="rounded-pill bg-night px-5 py-3 text-sm font-semibold text-white hover:bg-night-2" />
                </div>
              )}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
