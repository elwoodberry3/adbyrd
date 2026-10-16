"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Factory,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { industries } from "@/lib/content";

const industryIcons = [Landmark, HeartPulse, ShoppingBag, Factory, Briefcase, GraduationCap];

export default function IndustryCarousel() {
  const [i, setI] = useState(0);
  const count = industries.length;
  const go = (n: number) => setI((n + count) % count);
  const item = industries[i];
  const Icon = industryIcons[i];

  return (
    <div>
      {/* Pills (Ref 003) */}
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Industries">
        {industries.map((ind, idx) => (
          <button
            key={ind.name}
            role="tab"
            aria-selected={idx === i}
            aria-controls="industry-panel"
            onClick={() => setI(idx)}
            className={`shrink-0 rounded-full border-2 px-5 py-3 text-sm font-semibold transition-colors ${
              idx === i
                ? "border-forest bg-lime text-ink"
                : "border-forest bg-forest text-white hover:bg-forest-2"
            }`}
          >
            {ind.name}
          </button>
        ))}
      </div>

      {/* Featured card (Ref 001 carousel) */}
      <div
        id="industry-panel"
        role="tabpanel"
        aria-live="polite"
        className="mt-8 grid overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-forest/5 ring-1 ring-line md:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-forest">
          <div className="grid-fade absolute inset-0" />
          <div className="absolute h-56 w-56 rounded-full bg-glow/30 blur-3xl" />
          <div className="relative grid h-28 w-28 place-items-center rounded-[2rem] bg-lime text-ink shadow-2xl shadow-black/40">
            <Icon className="h-12 w-12" strokeWidth={1.6} />
          </div>
          <span className="absolute bottom-5 left-6 font-display text-sm font-semibold text-white/60">
            {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-8 p-8 sm:p-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-moss uppercase">What Adbyrd Can Deliver</p>
            <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">{item.name}</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {item.deliver.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-slate">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-moss">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate">Scoped around the industry&apos;s security, privacy, and regulatory requirements.</p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => go(i - 1)}
                aria-label="Previous industry"
                className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-cloud"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(i + 1)}
                aria-label="Next industry"
                className="grid h-11 w-11 place-items-center rounded-full bg-forest text-lime transition-colors hover:bg-forest-2"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
